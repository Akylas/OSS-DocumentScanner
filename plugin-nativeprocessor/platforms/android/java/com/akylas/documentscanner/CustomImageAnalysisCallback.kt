package com.akylas.documentscanner

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Point
import android.os.Handler
import android.util.Log
import androidx.camera.core.ImageProxy
import androidx.camera.view.PreviewView
import com.akylas.documentscanner.utils.ImageUtil
import com.akylas.documentscanner.utils.FunctionCallback
import com.nativescript.cameraview.ImageAnalysisCallback
import com.nativescript.cameraview.ImageAsyncProcessor
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.io.FileOutputStream
import java.io.IOException
import java.nio.ByteBuffer
import java.util.*
import kotlin.concurrent.thread
import kotlin.math.max
import kotlin.math.min


class CustomImageAnalysisCallback
@JvmOverloads
constructor(
    private val context: Context, private val cropView: CropView? = null,
    private val onQRCode: OnQRCode? = null
    /*, private val onTestBitmap: OnTestBitmap? = null*/
) :
    ImageAnalysisCallback {

    private var handler = Handler(context.mainLooper)
    var previewResizeThreshold = 200.0
    var autoScanHandler: AutoScanHandler? = null
        set(value) {
            if (field != null) {
                (field as AutoScanHandler).enabled = false
            }
            if (cropView != null) {
                cropView.drawFill = value == null
            }
            field = value
        }
    var detectQRCode = false
    var detectDocuments = true
    var detectQRCodeOptions = "{\"resizeThreshold\":500}"

    interface OnTestBitmap {
        fun onTestBitmap(bitmap: Bitmap)
    }

    interface OnQRCode {
        fun onQRCodes(data: String)
    }

    interface FunctionCallbackProgress {
        fun onProgress(progress: Int)
    }

    companion object {
        private external fun nativeScanJSON(
            srcBitmap: Bitmap,
            shrunkImageHeight: Int,
            imageRotation: Int,
            scale: Double,
            options: String?
        ): String

//        private external fun nativeScanJSONFromProxy(
//            width: Int,
//            height: Int,
//            chromaPixelStride: Int,
//            buffer1: ByteBuffer,
//            rowStride1: Int,
//            buffer2: ByteBuffer,
//            rowStride2: Int,
//            buffer3: ByteBuffer,
//            rowStride3: Int,
//            shrunkImageHeight: Int,
//            imageRotation: Int,
//            outBitmap: Bitmap
//        ): String
//
//        private external fun nativeScanJSONFromProxyOnePlane(
//            width: Int,
//            height: Int,
//            buffer1: ByteBuffer,
//            rowStride1: Int,
//            shrunkImageHeight: Int,
//            imageRotation: Int,
//            outBitmap: Bitmap
//        ): String

        private external fun nativeBufferScanJSON(
            width: Int,
            height: Int,
            chromaPixelStride: Int,
            buffer1: ByteBuffer,
            rowStride1: Int,
            buffer2: ByteBuffer,
            rowStride2: Int,
            buffer3: ByteBuffer,
            rowStride3: Int,
            shrunkImageHeight: Int,
            imageRotation: Int
        ): String

        private external fun testImageProxyToBitmap(
            width: Int,
            height: Int,
            chromaPixelStride: Int,
            buffer1: ByteBuffer,
            rowStride1: Int,
            buffer2: ByteBuffer,
            rowStride2: Int,
            buffer3: ByteBuffer,
            rowStride3: Int,
            outBitmap: Bitmap
        )

        private external fun nativeScan(
            srcBitmap: Bitmap,
            shrunkImageHeight: Int,
            imageRotation: Int
        ): Vector<Vector<Point>>

        // private external fun nativeScanAndQRCode(
        //     srcBitmap: Bitmap,
        //     shrunkImageHeight: Int,
        //     imageRotation: Int,
        //     options: String,
        // ): String

        private external fun nativeColorPalette(
            srcBitmap: Bitmap,
            shrunkImageHeight: Int,
            colorsFilterDistanceThreshold: Int,
            nbColors: Int,
            colorPalette: Int,
        ): String

        private external fun nativeCrop(
            srcBitmap: Bitmap,
            points: String,
            transforms: String,
            outBitmap: Bitmap
        )

        private external fun nativeGenerateQRCode(
            text: String,
            format: String,
            width: Int,
            height: Int,
            options: String
        ): Bitmap
        private external fun nativeGenerateQRCodeSVG(
            text: String,
            format: String,
            sizeHint: Int,
            options: String
        ): String

        private external fun nativeOCR(
            srcBitmap: Bitmap,
            options: String,
            progress: FunctionCallbackProgress?
        ): String

        private external fun nativeQRCodeRead(
            srcBitmap: Bitmap,
            options: String,
            scale: Double
        ): String

        private external fun nativeQRCodeReadBuffer(
            width: Int,
            height: Int,
            rotation: Int,
            buffer1: ByteBuffer,
            rowStride1: Int,
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

        @JvmOverloads
        fun ocrDocumentSync(
            bitmap: Bitmap,
            callback: FunctionCallback,
            options: String = "",
            progress: FunctionCallbackProgress? = null,
        ) {
            try {
                callback.onResult(null, nativeOCR(bitmap, options, progress))
            } catch (e: Exception) {
                callback.onResult(e, null)
            }
        }
        @JvmOverloads
        fun ocrDocument(
            bitmap: Bitmap,
            callback: FunctionCallback,
            options: String = "",
            progress: FunctionCallbackProgress? = null,
        ) {
            thread(start = true) {
                ocrDocumentSync(bitmap, callback, options, progress)
            }
        }
        @JvmOverloads
        fun ocrDocumentFromFile(
            context: Context,
            src: String,
            callback: FunctionCallback,
            options: String = "",
            progress: FunctionCallbackProgress? = null,
        ) {
            thread(start = true) {
                var bitmap: Bitmap? = null
                try {
                    bitmap = ImageUtil.readBitmapFromFile(context, src, options)

                    if (bitmap == null || bitmap.byteCount == 0) {
                        throw ImageUtil.ImageNotFoundException(src)
                    }
                    ocrDocumentSync(bitmap, callback, options, progress)
                    bitmap?.recycle()

                } catch (e: Exception) {
                    callback.onResult(e, null)
                } finally {
                    bitmap?.recycle()
                }
            }
        }

        @JvmOverloads
        fun readQRCodeSync(
            bitmap: Bitmap,
            options: String = "",
            scale: Double = 1.0
        ): String {
            return nativeQRCodeRead(bitmap, options, scale)
        }
        @JvmOverloads
        fun readQRCode(
            bitmap: Bitmap,
            callback: FunctionCallback,
            options: String = "",
        ) {
            thread(start = true) {
                try {
                    
                    callback.onResult(null, readQRCodeSync(bitmap, options))
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }
        @JvmOverloads
        fun readQRCodeFromFile(
            context: Context,
            src: String,
            callback: FunctionCallback,
            options: String = "",
        ) {
            thread(start = true) {
                var bitmap: Bitmap? = null
                try {
                    var imageSize = ImageUtil.getImageSizeSync(context, src)
                    val loadingOptions = ImageUtil.LoadImageOptions(options);
                    bitmap = ImageUtil.readBitmapFromFile(context, src, loadingOptions, Pair(imageSize[0], imageSize[1]))
                    if (bitmap == null || bitmap.byteCount == 0) {
                        throw ImageUtil.ImageNotFoundException(src)
                    }
                    var scale = 1.0
                    if (imageSize[2] % 180 !== 0) {
                        scale = imageSize[0].toDouble() / bitmap!!.height
                    } else {
                        scale = imageSize[0].toDouble() / bitmap!!.width
                    }
                    callback.onResult(null, readQRCodeSync(bitmap, options, scale))
                } catch (e: Exception) {
                    callback.onResult(e, null)
                } finally {
                    bitmap?.recycle()
                }
            }
        }

        @JvmOverloads
        fun generateQRCodeSync(
            text: String,
            format: String,
            width: Int,
            height: Int,
            options: String = "",
        ): Bitmap {
            return nativeGenerateQRCode(text, format, width, height, options)
        }
        @JvmOverloads
        fun generateQRCodeSVGSync(
            text: String,
            format: String,
            sizeHint: Int,
            options: String = "",
        ): String {
            return nativeGenerateQRCodeSVG(text, format, sizeHint, options)
        }

        @JvmOverloads
        fun generateQRCode(
            text: String,
            format: String,
            width: Int,
            height: Int,
            callback: FunctionCallback,
            options: String = "",
        ) {
            thread(start = true) {
                try {
                    callback.onResult(
                        null,
                        generateQRCodeSync(text, format, width, height, options)
                    )
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }
        @JvmOverloads
        fun generateQRCodeSVG(
            text: String,
            format: String,
            sizeHint: Int,
            callback: FunctionCallback,
            options: String = "",
        ) {
            thread(start = true) {
                try {
                    callback.onResult(
                        null,
                        generateQRCodeSVGSync(text, format, sizeHint, options)
                    )
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }

//        @JvmOverloads
//        fun readQRCodeSync(
//            image: Bitmap,
//            options: String = "",
//        ): String {
//            return nativeQRCodeRead(image, options)
//        }

        @JvmOverloads
        fun getJSONDocumentCornersSync(
            bitmap: Bitmap,
            shrunkImageHeight: Double = 500.0,
            imageRotation: Int = 0,
            scale: Double = 1.0,
            options: String? = null
        ): String {
            return nativeScanJSON(bitmap, shrunkImageHeight.toInt(), imageRotation, scale, options)
        }
        @JvmOverloads
        fun getJSONDocumentCorners(
            image: Bitmap,
            callback: FunctionCallback,
            shrunkImageHeight: Double = 500.0,
            imageRotation: Int = 0,
            scale: Double = 1.0,
            options: String? = null
        ) {
            thread(start = true) {
                try {
                    callback.onResult(null, getJSONDocumentCornersSync(image, shrunkImageHeight, imageRotation, scale, options))
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }
        @JvmOverloads
        fun getJSONDocumentCornersFromFile(
            context: Context,
            src: String,
            callback: FunctionCallback,
            shrunkImageHeight: Double = 300.0,
            options: String?
        ) {
            thread(start = true) {
                var bitmap: Bitmap? = null
                try {
                    var shrunkImageHeight = shrunkImageHeight
                    var imageSize = ImageUtil.getImageSizeSync(context, src)
                    val loadingOptions = ImageUtil.LoadImageOptions(options);
                    bitmap = ImageUtil.readBitmapFromFile(context, src, loadingOptions, Pair(imageSize[0], imageSize[1]))
                    if (bitmap == null) {
                        callback.onResult(ImageUtil.ImageNotFoundException(src), null)
                        return@thread
                    }
                    var scale = 1.0
                    if (imageSize[2] % 180 !== 0) {
                        scale = imageSize[0].toDouble() / bitmap!!.height
                    } else {
                        scale = imageSize[0].toDouble() / bitmap!!.width
                    }
                    if (scale != 1.0) {
                        shrunkImageHeight = 0.0
                    }
//                    FileOutputStream(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).absolutePath + "/test.png").use { out ->
//                        bitmap.compress(
//                            Bitmap.CompressFormat.PNG,
//                            100,
//                            out
//                        )
//                    }
                    // resized images from android side are more blurry than when resized with openCV
                    // val start = System.currentTimeMillis()
                    // Log.d("ImageAnalysis", "getJSONDocumentCornersSync")
                    callback.onResult(null, getJSONDocumentCornersSync(bitmap, shrunkImageHeight,  0, scale, options))
                    // Log.d("ImageAnalysis", "getJSONDocumentCornersSync in ${System.currentTimeMillis() - start} ms")
                } catch (e: Exception) {
                    callback.onResult(e, null)
                } finally {
                    bitmap?.recycle()
                }
            }
        }

        @JvmOverloads
        fun getColorPaletteSync(
            bitmap: Bitmap,
            shrunkImageHeight: Double = 100.0,
            colorsFilterDistanceThreshold: Int = 20,
            nbColors: Int = 5,
            colorPalette: Int = 2
        ): String {
            return nativeColorPalette(
                bitmap,
                shrunkImageHeight.toInt(),
                colorsFilterDistanceThreshold,
                nbColors,
                colorPalette
            )
        }
        @JvmOverloads
        fun getColorPalette(
            image: Bitmap,
            callback: FunctionCallback,
            shrunkImageHeight: Double = 100.0,
            colorsFilterDistanceThreshold: Int = 20,
            nbColors: Int = 5,
            colorPalette: Int = 2
        ) {
            thread(start = true) {
                try {
                    callback.onResult(null, getColorPaletteSync(image, shrunkImageHeight, colorsFilterDistanceThreshold, nbColors, colorPalette))
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }
        @JvmOverloads
        fun getColorPaletteFromFile(
            context: Context,
            src: String,
            callback: FunctionCallback,
            shrunkImageHeight: Double = 100.0,
            colorsFilterDistanceThreshold: Int = 20,
            nbColors: Int = 5,
            colorPalette: Int = 2,
            options: String?
        ) {
            thread(start = true) {
                var bitmap: Bitmap? = null
                try {
                    var colorsFilterDistanceThreshold = colorsFilterDistanceThreshold
                    var colorPalette = colorPalette
                    var nbColors = nbColors
                    var shrunkImageHeight = shrunkImageHeight
                    val loadingOptions = ImageUtil.LoadImageOptions(options);
                    var bitmap = ImageUtil.readBitmapFromFile(context, src, loadingOptions, null)
                    if (bitmap == null || bitmap.byteCount == 0) {
                        callback.onResult(ImageUtil.ImageNotFoundException(src), null)
                        return@thread
                    }
                    val jsOptions =loadingOptions.options
                    if (jsOptions != null) {
                        if (jsOptions.has("colorsFilterDistanceThreshold")) {
                            colorsFilterDistanceThreshold = jsOptions.optInt("colorsFilterDistanceThreshold",colorsFilterDistanceThreshold )
                        }
                        if (jsOptions.has("colorPalette")) {
                            colorPalette = jsOptions.optInt("colorPalette",colorPalette )
                        }
                        if (jsOptions.has("nbColors")) {
                            colorPalette = jsOptions.optInt("nbColors",colorPalette )
                        }
                        shrunkImageHeight = 0.0
                    }
                    callback.onResult(null, getColorPaletteSync(bitmap, shrunkImageHeight, colorsFilterDistanceThreshold, nbColors, colorPalette))
                } catch (e: Exception) {
                    callback.onResult(e, null)
                } finally {
                    bitmap?.recycle()
                }
            }
        }
        @JvmOverloads
        fun processFromFile(
            context: Context,
            src: String,
            processes: String,
            callback: FunctionCallback,
            options: String?
        ) {
            thread(start = true) {
                var bitmap: Bitmap? = null
                try {
                    val processesArray = JSONArray(processes)
                    if (processesArray.length() > 0) {
                        var result = ArrayList<String>()
                        var imageSize = ImageUtil.getImageSizeSync(context, src)
                        val loadingOptions = ImageUtil.LoadImageOptions(options);
                        bitmap = ImageUtil.readBitmapFromFile(context, src, loadingOptions, Pair(imageSize[0], imageSize[1]))
                        if (bitmap == null) {
                            callback.onResult(ImageUtil.ImageNotFoundException(src), null)
                            return@thread
                        }
                        var scale = 1.0
                        if (imageSize[2] % 180 !== 0) {
                            scale = imageSize[0].toDouble() / bitmap!!.height
                        } else {
                            scale = imageSize[0].toDouble() / bitmap!!.width
                        }
                        var shrunkImageHeight = if (scale != 1.0)  0 else 500

                        for (i in 0 until processesArray.length()) {
                            var processJSON = processesArray[i] as JSONObject
                            when (processJSON.optString("type")) {
                                "qrcode" -> result.add(nativeQRCodeRead(bitmap, processJSON.toString(), scale))
                                "palette" -> result.add(nativeColorPalette(
                                    bitmap,
                                    processJSON.optInt("shrunkImageHeight", shrunkImageHeight),
                                    processJSON.optInt("colorsFilterDistanceThreshold", 20),
                                    processJSON.optInt("nbColors", 5),
                                    processJSON.optInt("colorPalette", 2)
                                ))
                            }
                        }
                        callback.onResult(null, result.joinToString(",", "[", "]"))
                        bitmap.recycle()
                    } else {
                        callback.onResult(null, null)
                    }
                } catch (e: Exception) {
                    callback.onResult(e, null)
                } finally {
                    bitmap?.recycle()
                }
            }
        }

        fun pointsFromJSONArray(jsonArray: JSONArray): MutableList<List<Point>> {
            val list = mutableListOf<List<Point>>()
            for (i in 0 until jsonArray.length()) {
                var value = jsonArray[i] as JSONArray
                list.add(pointFromJSONArray(value))
            }
            return list
        }

        fun pointFromJSONArray(jsonArray: JSONArray, scale: Float = 1.0f): List<Point> {
            val list = mutableListOf<Point>()
            for (i in 0 until jsonArray.length()) {
                var value2 = jsonArray[i] as JSONArray

                list.add(
                    Point(
                        ((value2[0] as Int) * scale).toInt(),
                        ((value2[1] as Int) * scale).toInt()
                    )
                )
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
//        fun findDocumentCorners(
//            image: Bitmap,
//            shrunkImageHeight: Double = 500.0,
//            imageRotation: Int = 0
//        ): List<List<Point>>? {
//            val outPoints = nativeScan(image, shrunkImageHeight.toInt(), imageRotation)
//            if (outPoints.size > 0) {
//                if (outPoints[0].size == 0) {
//                    return null
//                }
//                return (outPoints)
//            }
//            return null
//        }
//        fun findDocumentCornersFromFile(
//            context: Context,
//            src: String,
//            shrunkImageHeight: Double = 500.0,
//            imageRotation: Int = 0,
//            options: String?
//        ): List<List<Point>>? {
//            var bitmap = ImageUtil.readBitmapFromFile(context, src, options)
//            if (bitmap != null && bitmap.byteCount != 0) {
//                val outPoints = nativeScan(bitmap, shrunkImageHeight.toInt(), imageRotation)
//                if (outPoints.size > 0) {
//                    if (outPoints[0].size == 0) {
//                        return null
//                    }
//                    return (outPoints)
//                }
//            } else {
//                throw ImageUtil.ImageNotFoundException()
//            }
//            return null
//        }
//
//        @JvmOverloads
//        fun getDocumentCorners(
//            photo: Bitmap,
//            shrunkImageHeight: Double = 500.0,
//            imageRotation: Int = 0,
//            returnDefault: Boolean = true
//        ): List<List<Point>>? {
//            val cornerPoints: List<List<Point>>? =
//                nativeScan(photo, shrunkImageHeight.toInt(), imageRotation)
//            // if cornerPoints is null then default the corners to the photo bounds with
//            // a margin
//            val default =
//                if (returnDefault)
//                    listOf(
//                        Point(cropperOffsetWhenCornersNotFound, cropperOffsetWhenCornersNotFound),
//                        Point(
//                            photo.width - cropperOffsetWhenCornersNotFound,
//                            cropperOffsetWhenCornersNotFound
//                        ),
//                        Point(
//                            cropperOffsetWhenCornersNotFound,
//                            photo.height - cropperOffsetWhenCornersNotFound
//                        ),
//                        Point(
//                            photo.width - cropperOffsetWhenCornersNotFound,
//                            photo.height - cropperOffsetWhenCornersNotFound
//                        )
//                    )
//                else null
//            return if (cornerPoints != null) cornerPoints
//            else (if (default != null) listOf(default) else null)
//        }

//        @JvmOverloads
//        fun cropDocumentSync(
//            bitmap: Bitmap?,
//            quads: List<List<Point>>,
//            callback: FunctionCallback,
//            transforms: String = "",
//            saveInFolder: String?,
//            compressFormat: String = "jpg",
//            compressQuality: Int = 100,
//
//            ) {
//            try {
//                if (bitmap == null || bitmap.byteCount == 0) {
//                    throw ImageUtil.ImageNotFoundException()
//                }
//                val bitmaps = arrayListOf<Bitmap>()
//                val filePaths = arrayListOf<String>()
//                quads.forEachIndexed { index, points ->
//                    // convert corners from image preview coordinates to original photo
//                    // coordinates
//                    // (original image is probably bigger than the preview image)
//                    // convert output image matrix to bitmap
//                    val cropWidth =
//                        ((points[0].distance(points[1]) + points[2].distance(points[3])) / 2).toInt()
//                    val cropHeight =
//                        ((points[3].distance(points[0]) + points[2].distance(points[1])) / 2).toInt()
//
//                    val cropBitmap =
//                        Bitmap.createBitmap(
//                            cropWidth,
//                            cropHeight,
//                            Bitmap.Config.ARGB_8888
//                        )
//                    val jsonArray = JSONArray(quads)
//                    nativeCrop(
//                        bitmap,
//                        jsonArray.getJSONArray(index).toString(),
//                        transforms,
//                        cropBitmap
//                    )
//                    if (saveInFolder != null) {
//                        try {
//                            var tempFileName = "$saveInFolder/cropedBitmap_$index.$compressFormat"
//                            FileOutputStream(tempFileName).use { out ->
//                                cropBitmap.compress(
//                                    ImageUtil.getTargetFormat(compressFormat),
//                                    compressQuality,
//                                    out
//                                )
//                            }
//                            filePaths.add(tempFileName)
//                        } catch (e: IOException) {
//                            e.printStackTrace()
//                        }
//                        cropBitmap.recycle()
//                    } else {
//                        bitmaps.add(cropBitmap)
//                    }
//                }
//                if (bitmaps.size > 0) {
//                    callback.onResult(null, bitmaps.toArray())
//                } else {
//                    callback.onResult(null, filePaths.toArray())
//                }
//            } catch (e: Exception) {
//                callback.onResult(e, null)
//            }
//        }

//        @JvmOverloads
//        fun cropDocument(
//            bitmap: Bitmap,
//            quads: List<List<Point>>,
//            callback: FunctionCallback,
//            transforms: String = "",
//            saveInFolder: String?,
//            compressFormat: String = "jpg",
//            compressQuality: Int = 100,
//        ) {
//            thread(start = true) {
//                cropDocumentSync(bitmap, quads, callback, transforms, saveInFolder, compressFormat, compressQuality)
//            }
//        }

//        @JvmOverloads
//        fun cropDocumentFromFile(
//            context: Context,
//            src: String,
//            quads: List<List<Point>>,
//            callback: FunctionCallback,
//            options: String?
//        ) {
//            thread(start = true) {
//                var loadBitmapOptions: ImageUtil.LoadImageOptions? = null
//                var transforms = ""
//                var saveInFolder: String? = null
//                var compressFormat = "jpg"
//                var compressQuality = 100
//                if (options != null) {
//                    try {
//                        var jsOptions = JSONObject(options)
//                        loadBitmapOptions = ImageUtil.LoadImageOptions(jsOptions)
//                        transforms = jsOptions.optString("transforms", transforms)
//                        saveInFolder = jsOptions.optString("saveInFolder", saveInFolder)
//                        compressFormat = jsOptions.optString("compressFormat", compressFormat)
//                        compressQuality = jsOptions.optInt("compressQuality", compressQuality)
//                    } catch (ignored: JSONException) {
//                    }
//                }
//                cropDocumentSync(ImageUtil.readBitmapFromFile(context, src, loadBitmapOptions), quads, callback, transforms, saveInFolder, compressFormat,compressQuality )
//            }
//        }

        @JvmOverloads
        fun cropDocumentSync(
            bitmap: Bitmap,
            quads: String,
            transforms: String = "",
            saveInFolder: String?,
            fileName: String?,
            compressFormat: String = "jpg",
            compressQuality: Int = 100,
        ): Any? {
            // val start = System.currentTimeMillis()
            val bitmaps = arrayListOf<Bitmap>()
            val jsonResult = JSONArray()
            val jsonArray = JSONArray(quads)
//            if (jsonArray.length() == 0) {
//                val crop = JSONArray()
//                crop.put(JSONArray("[0,0]"))
//                crop.put(JSONArray("[${bitmap.width},0]"))
//                crop.put(JSONArray("[${bitmap.width},${bitmap.height}]"))
//                crop.put(JSONArray("[0,${bitmap.height}]"))
//                jsonArray.put(crop)
//            }
            pointsFromJSONArray(jsonArray).forEachIndexed { index, points ->
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
                nativeCrop(
                    bitmap,
                    jsonArray.getJSONArray(index).toString(),
                    transforms,
                    cropBitmap
                )
                if (saveInFolder != null) {
                    try {

                        var imagePath = "$saveInFolder/${fileName ?: "cropedBitmap_$index.$compressFormat"}"
                        FileOutputStream(imagePath).use { out ->
                            cropBitmap.compress(
                                ImageUtil.getTargetFormat(compressFormat),
                                compressQuality,
                                out
                            )
                        }
                        var result = JSONObject()
                        result.put("imagePath", imagePath)
                        result.put("width", cropWidth)
                        result.put("height", cropHeight)
                        jsonResult.put(result)
                    } catch (e: IOException) {
                        e.printStackTrace()
                    }
                    cropBitmap.recycle()
                } else {
                    bitmaps.add(cropBitmap)
                }
            }
            // Log.d("ImageAnalysis", "cropDocumentSync in ${System.currentTimeMillis() - start} ms")
            if (bitmaps.size > 0) {
                return bitmaps.toArray()
            } else {
                return jsonResult.toString()
            }
        }
        @JvmOverloads
        fun cropDocument(
            bitmap: Bitmap,
            quads: String,
            callback: FunctionCallback,
            transforms: String = "",
            saveInFolder: String? = null,
            fileName: String? = null,
            compressFormat: String = "jpg",
            compressQuality: Int = 100,
        ) {
            thread(start = true) {
                try {
                    callback.onResult(null, cropDocumentSync(bitmap, quads, transforms, saveInFolder, fileName, compressFormat, compressQuality))
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }
        @JvmOverloads
        fun cropDocumentFromFile(
            context: Context,
            src: String,
            quads: String,
            callback: FunctionCallback,
            options: String?
        ) {
            thread(start = true) {
                var bitmap: Bitmap? = null
                try {
                    var loadBitmapOptions: ImageUtil.LoadImageOptions? = null
                    var transforms = ""
                    var saveInFolder: String? = null
                    var fileName: String? = null
                    var compressFormat = "jpg"
                    var compressQuality = 100
                    if (options != null) {
                        try {
                            var jsOptions = JSONObject(options)
                            loadBitmapOptions = ImageUtil.LoadImageOptions(jsOptions)
                            transforms = jsOptions.optString("transforms", transforms)
                            saveInFolder = jsOptions.optString("saveInFolder", saveInFolder)
                            fileName = jsOptions.optString("fileName", fileName)
                            compressFormat = jsOptions.optString("compressFormat", compressFormat)
                            compressQuality = jsOptions.optInt("compressQuality", compressQuality)
                        } catch (ignored: JSONException) {
                        }
                    }
                    bitmap = ImageUtil.readBitmapFromFile(context, src, loadBitmapOptions, null)
                    if (bitmap == null || bitmap.byteCount == 0) {
                        callback.onResult(ImageUtil.ImageNotFoundException(src), null)
                        return@thread
                    }
                    callback.onResult(null, cropDocumentSync(bitmap, quads, transforms, saveInFolder, fileName, compressFormat,compressQuality ))
                } catch (e: Exception) {
                    callback.onResult(e, null)
                } finally {
                    bitmap?.recycle()
                }
            }
        }
        
    }
    private fun handleProcessResult(imageWidth:Int, imageHeight:Int, imageRotation: Int, scanJSONResult: String?,qrcodeResult: String? ) {
        // should we run it on main thread? We know we dont want to make "process" slower
        handler.post(Runnable() {
            run() {
                var pointsList: MutableList<List<Point>> =  mutableListOf<List<Point>>();
                if (scanJSONResult != null) {
                    pointsList.addAll(pointsFromJSONArray(JSONArray(scanJSONResult)));
                }
                autoScanHandler?.process(pointsList)

                if (qrcodeResult != null) {
//                Log.d("JS", "detectQRCode ${(System.nanoTime() - start) / 1000000}ms");
                    val qrcode = JSONArray(qrcodeResult)
                    if (qrcode.length() > 0) {
                        val qrcode = qrcode.getJSONObject(0)
                        pointsList.add(pointFromJSONArray(qrcode.getJSONArray("position")));
                        onQRCode?.onQRCodes(qrcodeResult)
                    }
                }
                // pointsList is sorted by area
                if (cropView != null) {
                    if (pointsList != null && pointsList.size > 0) {
                        if (imageRotation == 180 ||
                            imageRotation ==
                            0
                        ) {

                            cropView.imageWidth = imageWidth
                            cropView.imageHeight = imageHeight
                        } else {

                            cropView.imageWidth = imageHeight
                            cropView.imageHeight = imageWidth
                        }
                        val scaleX = cropView.height.toFloat() / imageWidth.toFloat()
                        val scaleY = cropView.width.toFloat() / imageHeight.toFloat()
                        when (cropView.scaleType) {
                            PreviewView.ScaleType.FILL_END, PreviewView.ScaleType.FILL_START, PreviewView.ScaleType.FILL_CENTER -> cropView.scale = max(scaleX, scaleY)
                            PreviewView.ScaleType.FIT_END, PreviewView.ScaleType.FIT_START, PreviewView.ScaleType.FIT_CENTER -> cropView.scale = min(scaleX, scaleY)
                        }
                        cropView.quads = pointsList
                    } else {
                        cropView.quads = null
                    }
                    cropView.invalidate()
                }

                // Code to run on UI thread
            }
        });
    }

    @SuppressLint("UnsafeOptInUsageError")
    override fun process(
        imageProxy: ImageProxy,
        info: androidx.camera.core.ImageInfo,
        processor: ImageAsyncProcessor
    ) {
        try {
            if (cropView == null) {
                return
            }
//            val start = System.currentTimeMillis()
            val image = imageProxy.image!!
            val planes = image.planes
            val imageWidth = image.width
            val imageHeight = image.height
            val imageRotation = info.rotationDegrees

            var scanJSONResult: String? = null;
            var qrcodeResult: String? = null;

            if (detectDocuments) {
                val chromaPixelStride = planes[1].pixelStride
                scanJSONResult = nativeBufferScanJSON(
                    image.width, image.height, chromaPixelStride, planes[0].buffer,
                    planes[0].rowStride, planes[1].buffer,
                    planes[1].rowStride, planes[2].buffer,
                    planes[2].rowStride, previewResizeThreshold.toInt(), info.rotationDegrees
                );
                
            }
            if (detectQRCode) {
                qrcodeResult = nativeQRCodeReadBuffer(
                    image.width, image.height, info.rotationDegrees, planes[0].buffer,
                    planes[0].rowStride, detectQRCodeOptions
                )
            }
            // Log.d("ImageAnalysis", "processor finished")
            // mark the processor as finished as soon as possible
            processor.finished()
            handleProcessResult(imageWidth, imageHeight, imageRotation, scanJSONResult, qrcodeResult)

        } catch (exception: Exception) {
            exception.printStackTrace()
        } finally {
            processor.finished()
        }
    }
}
