package com.akylas.documentscanner

import android.app.Activity
import android.content.Context
import android.graphics.Point
import android.util.Log
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.json.JSONArray

class AutoScanHandler
@JvmOverloads
constructor(
private val context: Context, private val cropView: CropView? = null,
private val onAutoScan: AutoScanHandler.OnAutoScan? = null
) {
    companion object {
        val TAG = "AutoScanHandler"

        fun getHash(points: List<Point>): Long {
            return points[0].hashCode() +
                    10000L * points[1].hashCode() +
                    100000L * points[2].hashCode() +
                    1000000L * points[3].hashCode();
        }
    }
    var distanceThreshod = 50.0f;
    var preAutoScanDelay = 1000L;
    var autoScanDuration = 1000.0f;
    var enabled: Boolean = true
        set(value) {
            field = value
            cropView?.drawFill = !value
            Log.d(TAG, "AutoScanHandler set enabled:" + value)
            if (!value) {
                clearAll()
            }
        }
    private val job = SupervisorJob()
    private val scope = CoroutineScope(Dispatchers.Default + job)

    private var currentPoints: List<List<Point>>? = null
    private val hashMapping:HashBiMap<Long, Long> = HashBiMap()
    private val autoScanJobs: HashMap<Long, Job> = hashMapOf()
    private val preAutoScanJobs: HashMap<Long, Job> = hashMapOf()

    interface OnAutoScan {
        fun onAutoScan(corners: String)
    }

    init {
        cropView?.drawFill = !enabled
    }

    fun replaceHash(oldValue: Long, newValue:Long) {
        try {
            if(hashMapping.containsKey(oldValue) ) {
                val originalHash = hashMapping[oldValue]!!
                hashMapping.remove(oldValue)
                hashMapping[newValue] = originalHash
            } else {
                hashMapping[newValue] = oldValue
            }
        } catch (exception: Exception) {
            exception.printStackTrace()
        }

    }
    fun clearAll() {
        //stop all
        if (autoScanJobs.isNotEmpty()) {
            autoScanJobs.forEach {
                it.value.cancel()
                val hash = it.key
                val progressHash =if (hashMapping.containsValue(it.key)) hashMapping.getkeyForValue(hash)!! else hash
                cropView?.updateProgress(progressHash, 0)
            }
            autoScanJobs.clear()
        }

        if (preAutoScanJobs.isNotEmpty()) {
            preAutoScanJobs.forEach {
                it.value.cancel()
            }
            preAutoScanJobs.clear()
        }
        currentPoints = null
    }

    fun process(points: List<List<Point>>?) {
        if (!enabled || points.isNullOrEmpty()) {
            clearAll()
            return
        } else if (currentPoints == null) {
            // we need to add them all as pre jobs
            points.forEach {
                startAutoScanPreJob(it)
            }
        } else  {
            val mutableList = mutableListOf<List<Point>>()
            mutableList.addAll(points)
            // we need to compare and find closest ones
            currentPoints!!.forEach { existingPointList ->
                val hash = getHash(existingPointList)
                val originalHash = if (hashMapping.containsKey(hash)) hashMapping[hash]!! else hash
                //find if one is close enough
                var found = false
                mutableList.forEach { comparingPointList->
                        val distance = (listOf(existingPointList[0].distance(comparingPointList[0]),
                            existingPointList[1].distance(comparingPointList[1]),
                            existingPointList[2].distance(comparingPointList[2]),
                            existingPointList[3].distance(comparingPointList[3]))).max()
                    if (distance < distanceThreshod) {
                        if (!autoScanJobs.containsKey(originalHash) && !preAutoScanJobs.containsKey(originalHash)) {
                        // for now we dont allow scan to start over on the same document
                        // startAutoScanPreJob(existingPointList)
                            mutableList.remove(comparingPointList)
                        } else {

                            // we found one existing, good let s do nothing!
                            // we need to replace the hash in the cropView
                            val newHash = getHash(comparingPointList)
                            cropView?.replaceProgressHash(hash, newHash)
                            replaceHash(hash, newHash)
                            mutableList.remove(comparingPointList)
                        }
                        found = true
                        return@forEach
                    }
                }
                if (!found) {
                    // we cant find a close one, let s stop the job for this one
                    if (autoScanJobs.containsKey(originalHash)) {
                        autoScanJobs[originalHash]?.cancel()
                        autoScanJobs.remove(originalHash)
                        //this will clear the progress
                        cropView?.updateProgress(hash, 0)
                    }
                    if (preAutoScanJobs.containsKey(originalHash)) {
                        preAutoScanJobs[originalHash]?.cancel()
                        preAutoScanJobs.remove(originalHash)
                    }
                }
            }
            // remaining points should be added as pre Scan
            mutableList.forEach {
                startAutoScanPreJob(it)
            }
        }
        currentPoints = points
    }
    fun startAutoScanPreJob(points:List<Point>) {
        val hash = getHash(points)
        preAutoScanJobs[hash] = scope.launch(Dispatchers.IO) {
            delay(preAutoScanDelay)
            startAutoScanJob(points)
            preAutoScanJobs.remove(hash)
        }

    }
    fun startAutoScanJob(points:List<Point>) {
        val hash = getHash(points)
        val delayMs = (autoScanDuration / 100.0f).toLong();
        autoScanJobs[hash] = scope.launch(Dispatchers.IO) {
            for (i in 0 .. 100) {
                delay(delayMs)
                try {

                    val updateKey = if (hashMapping.containsValue(hash)) hashMapping.getkeyForValue(hash)!! else hash
                    // there we need to know the new hash
                    cropView?.updateProgress(updateKey, i)
                } catch(e: Exception) {
                    e.printStackTrace()
                }
            }
            if (onAutoScan != null && enabled && hashMapping.containsValue(hash)) {
                val jsonArray = JSONArray(points.map {
                        listOf(it.x, it.y)
                })
                val result = jsonArray.toString()
                onAutoScan.onAutoScan(result)
            }
            // done let s clear things up
            autoScanJobs.remove(hash)
            val updateKey = if (hashMapping.containsValue(hash)) hashMapping.getkeyForValue(hash)!! else hash
            cropView?.updateProgress(updateKey, 0)
        }
    }
}