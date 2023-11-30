package com.akylas.documentscanner

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Point
import android.util.Log
import androidx.camera.core.ImageProxy
import com.akylas.documentscanner.extensions.toBitmap
import com.nativescript.cameraview.ImageAnalysisCallback
import com.nativescript.cameraview.ImageAsyncProcessor
import java.util.*
import kotlin.concurrent.thread
import org.json.JSONArray
import kotlin.math.max

class CustomImageAnalysisCallback
@JvmOverloads
constructor(private val context: Context, private val cropView: CropView? = null) :
    ImageAnalysisCallback {

    var previewResizeThreshold = 200.0

    interface FunctionCallback {
        fun onResult(e: Exception?, result: Any?)
    }

    interface FunctionCallbackProgress {
        fun onProgress(progress: Int)
    }

    companion object {
        private external fun nativeScanJSON(
            srcBitmap: Bitmap,
            shrunkImageHeight: Int,
            imageRotation: Int
        ): String

        private external fun nativeScan(
            srcBitmap: Bitmap,
            shrunkImageHeight: Int,
            imageRotation: Int
        ): Vector<Vector<Point>>

        private external fun nativeScanAndQRCode(
            srcBitmap: Bitmap,
            shrunkImageHeight: Int,
            imageRotation: Int,
            options: String,
        ): String

        private external fun nativeCrop(
            srcBitmap: Bitmap,
            points: String,
            transforms: String,
            outBitmap: Bitmap
        )

        private external fun nativeOCR(
            srcBitmap: Bitmap,
            options: String,
            progress: FunctionCallbackProgress?
        ): String

        private external fun nativeQRCodeRead(
            srcBitmap: Bitmap,
            options: String,
        ): String

        /**
         * @property cropperOffsetWhenCornersNotFound if we can't find document corners, we
         * set corners to image size with a slight margin
         */
        private const val cropperOffsetWhenCornersNotFound = 100

        init {
            try {
                System.loadLibrary("document_detector")
            } catch (exception: Exception) {
                exception.printStackTrace()
            }
        }

        /**
         * take a photo with a document, and find the document's corners
         *
         * @param image a photo with a document
         * @return a list with document corners (top left, top right, bottom right, bottom
         * left)
         */
        @JvmOverloads
        fun ocrDocument(
            image: Bitmap,
            callback: FunctionCallback,
            options: String = "",
            progress: FunctionCallbackProgress? = null,
        ) {
            thread(start = true) {
                try {
                    callback.onResult(null, nativeOCR(image, options, progress))
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }

        /**
         * take a photo with a document, and find the document's corners
         *
         * @param image a photo with a document
         * @return a list with document corners (top left, top right, bottom right, bottom
         * left)
         */
        @JvmOverloads
        fun readQRCode(
            image: Bitmap,
            callback: FunctionCallback,
            options: String = "",
        ) {
            thread(start = true) {
                try {
                    callback.onResult(null, nativeQRCodeRead(image, options))
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }
        @JvmOverloads
        fun readQRCodeSync(
            image: Bitmap,
            callback: FunctionCallback,
            options: String = "",
        ): String {
            return nativeQRCodeRead(image, options)
        }

        /**
         * take a photo with a document, and find the document's corners
         *
         * @param image a photo with a document
         * @return a list with document corners (top left, top right, bottom right, bottom
         * left)
         */
        @JvmOverloads
        fun getJSONDocumentCorners(
            image: Bitmap,
            callback: FunctionCallback,
            shrunkImageHeight: Double = 500.0,
            imageRotation: Int = 0
        ) {
            thread(start = true) {
                try {
                    callback.onResult(
                        null,
                        nativeScanJSON(image, shrunkImageHeight.toInt(), imageRotation)
                    )
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }
        fun pointsFromJSONArray(jsonArray: JSONArray): MutableList<List<Point>> {
//             val start = System.nanoTime()
            val list = mutableListOf<List<Point>>()
            for (i in 0 until jsonArray.length()) {
                var value = jsonArray[i] as JSONArray
                list.add(pointFromJSONArray(value))
            }
//             Log.d("JS", "pointsFromJSONString ${(System.nanoTime() - start) / 1000000}ms");
            return list
        }
        fun pointFromJSONArray(jsonArray: JSONArray, scale: Float = 1.0f): List<Point> {
                val list = mutableListOf<Point>()
                for (i in 0 until jsonArray.length()) {
                    var value2 = jsonArray[i] as JSONArray

                    list.add(Point(((value2[0] as Int) * scale).toInt(), ((value2[1] as Int) * scale).toInt()))
                }
            return list
        }

        fun pointsFromJSONString(str: String): List<List<Point>> {
            return pointsFromJSONArray(JSONArray(str))
        }

        /**
         * take a photo with a document, and find the document's corners
         *
         * @param image a photo with a document
         * @return a list with document corners (top left, top right, bottom right, bottom
         * left)
         */
        fun findDocumentCorners(
            image: Bitmap,
            shrunkImageHeight: Double = 500.0,
            imageRotation: Int = 0
        ): List<List<Point>>? {
            val outPoints = nativeScan(image, shrunkImageHeight.toInt(), imageRotation)
            if (outPoints.size > 0) {
                if (outPoints[0].size == 0) {
                    return null
                }
                return (outPoints)
            }
            return null
        }

        /**
         * Pass in a photo of a document, and get back 4 corner points (top left, top right,
         * bottom right, bottom left). This tries to detect document corners, but falls back
         * to photo corners with slight margin in case we can't detect document corners.
         *
         * @param photo the original photo with a rectangular document
         * @return a List of 4 OpenCV points (document corners)
         */
        @JvmOverloads
        fun getDocumentCorners(
            photo: Bitmap,
            shrunkImageHeight: Double = 500.0,
            imageRotation: Int = 0,
            returnDefault: Boolean = true
        ): List<List<Point>>? {
//            val cornerPoints: List<List<Point>>? =  pointsFromJSONString(nativeScanJSON(photo, shrunkImageHeight.toInt(), imageRotation))
            val cornerPoints: List<List<Point>>? =  nativeScan(photo, shrunkImageHeight.toInt(), imageRotation)
            // if cornerPoints is null then default the corners to the photo bounds with
            // a margin
            val default =
                if (returnDefault)
                    listOf(
                        Point(cropperOffsetWhenCornersNotFound, cropperOffsetWhenCornersNotFound),
                        Point(
                            photo.width - cropperOffsetWhenCornersNotFound,
                            cropperOffsetWhenCornersNotFound
                        ),
                        Point(
                            cropperOffsetWhenCornersNotFound,
                            photo.height - cropperOffsetWhenCornersNotFound
                        ),
                        Point(
                            photo.width - cropperOffsetWhenCornersNotFound,
                            photo.height - cropperOffsetWhenCornersNotFound
                        )
                    )
                else null
            return if (cornerPoints != null) cornerPoints
            else (if (default != null) listOf(default) else null)
        }

        @JvmOverloads
        fun cropDocument(
            bitmap: Bitmap,
            quads: String,
            callback: FunctionCallback,
            transforms: String = ""
        ) {
            thread(start = true) {
                try {
                    val bitmaps = arrayListOf<Bitmap>()
                    pointsFromJSONString(quads).forEachIndexed { index, points ->
                        // convert corners from image preview coordinates to original photo
                        // coordinates
                        // (original image is probably bigger than the preview image)
                        // convert output image matrix to bitmap
                        val cropWidth =
                            ((points[0].distance(points[1]) + points[2].distance(points[3])) / 2).toInt()
                        val cropHeight =
                            ((points[3].distance(points[0]) + points[2].distance(points[1])) / 2).toInt()

                        val cropBitmap =
                            Bitmap.createBitmap(
                                cropWidth,
                                cropHeight,
                                Bitmap.Config.ARGB_8888
                            )
                        val jsonArray = JSONArray(quads)
                        nativeCrop(
                            bitmap,
                            jsonArray.getJSONArray(index).toString(),
                            transforms,
                            cropBitmap
                        )
                        bitmaps.add(cropBitmap)
                    }
                    callback.onResult(null, bitmaps.toArray())
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }
    }


    @SuppressLint("UnsafeOptInUsageError")
    override fun process(
        imageProxy: ImageProxy,
        info: androidx.camera.core.ImageInfo,
        processor: ImageAsyncProcessor
    ) {
        try {
            if (cropView == null) {
                processor.finished()
                return
            }
             val start = System.nanoTime()
            val image = imageProxy.image!!
            val previewBitmap = imageProxy.toBitmap(context)
            if (previewBitmap == null) {
                processor.finished()
                return
            }
//            val result = nativeScanAndQRCode(previewBitmap, previewResizeThreshold.toInt(), info.rotationDegrees, "");
//            val jsonRes = JSONObject(result)
//            var pointsList: MutableList<List<Point>>? =  pointsFromJSONArray(jsonRes.getJSONArray("points"))
//
//
//            val qrcodeRes = jsonRes.getJSONArray("qrcodes")
//            if (pointsList != null && pointsList.size > 0 && qrcodeRes.length() > 0) {
//                val qrcode =qrcodeRes.getJSONObject(0)
//                pointsList.add(pointFromJSONArray(qrcode.getJSONArray("position"),
//                    jsonRes.getDouble("resizeScale").toFloat()
//                ))
//            }
            val result = nativeScanJSON(previewBitmap, previewResizeThreshold.toInt(), info.rotationDegrees);
             var pointsList: MutableList<List<Point>>? =  pointsFromJSONArray(JSONArray(result))
//            val pointsList: List<List<Point>>? =
//                getDocumentCorners(
//                    previewBitmap,
//                    previewResizeThreshold,
//                    info.rotationDegrees,
//                    false
//                )
            Log.d("JS", "getDocumentCorners ${(System.nanoTime() - start) /1000000}ms");
            if (pointsList != null) {

//                val ratio = cropView.height.toFloat() / photoHeight.toFloat()
//                val quads =
//                    pointsList.map { points ->
//                        points
//                            .sortedBy { it.y }
//                            .chunked(2)
//                            .map {
//                                it.sortedBy { point
//                                    ->
//                                    point.x
//                                }
//                            }
//                            .flatten()
//                    }

                if (info.rotationDegrees == 180 ||
                    info.rotationDegrees ==
                    0
                ) {

                    cropView.imageWidth = image.width
                    cropView.imageHeight = image.height
                } else {

                    cropView.imageWidth = image.height
                    cropView.imageHeight = image.width
                }
                val scaleX = cropView.height.toFloat() / image.width.toFloat()
                val scaleY = cropView.width.toFloat() / image.height.toFloat()
                cropView.scale = max(scaleX, scaleY)
                cropView.quads = pointsList
//                    quads.map { points -> Quad(points) }.map { quad ->
//                        quad.applyRatio(ratio)
//                    }
            } else {
                cropView.quads = null
            }
            cropView.invalidate()
            previewBitmap.recycle()
            processor.finished()
        } catch (exception: Exception) {
            exception.printStackTrace()
        }
    }
}
