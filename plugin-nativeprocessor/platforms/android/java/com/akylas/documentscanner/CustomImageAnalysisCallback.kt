package com.akylas.documentscanner

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Point
import android.util.Log
import androidx.camera.core.ImageInfo
import androidx.camera.core.ImageProxy
import com.akylas.documentscanner.extensions.toBitmap
import com.nativescript.cameraview.ImageAnalysisCallback
import com.nativescript.cameraview.ImageAsyncProcessor
import java.util.*
import kotlin.concurrent.thread
import org.json.JSONArray
import org.json.JSONObject
import java.nio.ByteBuffer
import kotlin.math.max

class CustomImageAnalysisCallback
@JvmOverloads
constructor(
    private val context: Context, private val cropView: CropView? = null,
    private val onQRCode: OnQRCode? = null
    /*, private val onTestBitmap: OnTestBitmap? = null*/
) :
    ImageAnalysisCallback {

    var previewResizeThreshold = 200.0
    var autoScanHandler: AutoScanHandler? = null
    var detectQRCode = false
    var detectQRCodeOptions = "{\"resizeThreshold\":500}"

    interface FunctionCallback {
        fun onResult(e: Exception?, result: Any?)
    }

    interface OnTestBitmap {
        fun onTestBitmap(bitmap: Bitmap)
    }

    interface OnQRCode {
        fun onQRCode(text: String, format: String)
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

        private external fun nativeScanAndQRCode(
            srcBitmap: Bitmap,
            shrunkImageHeight: Int,
            imageRotation: Int,
            options: String,
        ): String

        private external fun nativeColorPalette(
            srcBitmap: Bitmap,
            shrunkImageHeight: Int,
            colorsFilterDistanceThreshold: Int,
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
            options: String,
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
                    val result = Bitmap.createBitmap(
                        width,
                        height,
                        Bitmap.Config.ARGB_8888
                    )
                    nativeGenerateQRCode(text, format, width, height, options, result)
                    callback.onResult(
                        null,
                        result
                    )
                } catch (e: Exception) {
                    callback.onResult(e, null)
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
            val result = Bitmap.createBitmap(
                width,
                height,
                Bitmap.Config.ARGB_8888
            )
            nativeGenerateQRCode(text, format, width, height, options, result)
            return result
        }

        @JvmOverloads
        fun readQRCodeSync(
            image: Bitmap,
            options: String = "",
        ): String {
            return nativeQRCodeRead(image, options)
        }

        @JvmOverloads
        fun getJSONDocumentCorners(
            image: Bitmap,
            callback: FunctionCallback,
            shrunkImageHeight: Double = 500.0,
            imageRotation: Int = 0
        ) {
            thread(start = true) {
                try {
                    if (image.byteCount == 0) {
                        throw Exception("getJSONDocumentCorners: null data bitmap")
                    }
                    callback.onResult(
                        null,
                        nativeScanJSON(image, shrunkImageHeight.toInt(), imageRotation)
                    )
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }

//        @SuppressLint("UnsafeOptInUsageError")
//        @JvmOverloads
//        fun getJSONDocumentCornersAndImage(
//            imageProxy: ImageProxy,
//            processor: ImageAsyncProcessor,
//            callback: FunctionCallback,
//            shrunkImageHeight: Double = 500.0,
//            imageRotation: Int = 0
//        ) {
//            thread(start = true) {
//                try {
//                    val image = imageProxy.image!!
//                    val planes = image.planes
//                    val outBitmap =
//                        Bitmap.createBitmap(
//                            image.width,
//                            image.height,
//                            Bitmap.Config.ARGB_8888
//                        )
//
//                    val corners = if (planes.size> 1) nativeScanJSONFromProxy(
//                        image.width,
//                        image.height,
//                        planes[1].pixelStride,
//                        planes[0].buffer,
//                        planes[0].rowStride,
//                        planes[1].buffer,
//                        planes[1].rowStride,
//                        planes[2].buffer,
//                        planes[2].rowStride,
//                        shrunkImageHeight.toInt(),
//                        if (imageRotation != 0) imageRotation else imageProxy.imageInfo.rotationDegrees,
//                        outBitmap
//                    ) else nativeScanJSONFromProxyOnePlane(image.width,
//                        image.height,
//                        planes[0].buffer,
//                        planes[0].rowStride,
//                        shrunkImageHeight.toInt(),
//                        if (imageRotation != 0) imageRotation else imageProxy.imageInfo.rotationDegrees,
//                        outBitmap)
//                    processor.finished()
//                    callback.onResult(
//                        null,
//                        mapOf("corners" to corners, "image" to outBitmap)
//                    )
//                } catch (e: Exception) {
//                    callback.onResult(e, null)
//                }
//            }
//        }

        @JvmOverloads
        fun getColorPalette(
            image: Bitmap,
            callback: FunctionCallback,
            shrunkImageHeight: Double = 500.0,
            colorsFilterDistanceThreshold: Int = 0,
            colorPalette: Int = 0
        ) {
            thread(start = true) {
                try {
                    callback.onResult(
                        null,
                        nativeColorPalette(
                            image,
                            shrunkImageHeight.toInt(),
                            colorsFilterDistanceThreshold,
                            colorPalette
                        )
                    )
                } catch (e: Exception) {
                    callback.onResult(e, null)
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

        @JvmOverloads
        fun getDocumentCorners(
            photo: Bitmap,
            shrunkImageHeight: Double = 500.0,
            imageRotation: Int = 0,
            returnDefault: Boolean = true
        ): List<List<Point>>? {
            val cornerPoints: List<List<Point>>? =
                nativeScan(photo, shrunkImageHeight.toInt(), imageRotation)
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
            quads: List<List<Point>>,
            callback: FunctionCallback,
            transforms: String = ""
        ) {
            thread(start = true) {
                try {
                    val bitmaps = arrayListOf<Bitmap>()
                    quads.forEachIndexed { index, points ->
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
                    val jsonArray = JSONArray(quads)
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
                        bitmaps.add(cropBitmap)
                    }
                    callback.onResult(null, bitmaps.toArray())
                } catch (e: Exception) {
                    callback.onResult(e, null)
                }
            }
        }
    }

    var testBitmap: Bitmap? = null

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
            val image = imageProxy.image!!
            val planes = image.planes
            val chromaPixelStride = planes[1].pixelStride

            val result = nativeBufferScanJSON(
                image.width, image.height, chromaPixelStride, planes[0].buffer,
                planes[0].rowStride, planes[1].buffer,
                planes[1].rowStride, planes[2].buffer,
                planes[2].rowStride, previewResizeThreshold.toInt(), info.rotationDegrees
            );
            var pointsList: MutableList<List<Point>>? = pointsFromJSONArray(JSONArray(result))

            if (detectQRCode) {
                val qrcodeResult = nativeQRCodeReadBuffer(
                    image.width, image.height, info.rotationDegrees, planes[0].buffer,
                    planes[0].rowStride, detectQRCodeOptions
                )
//                Log.d("JS", "detectQRCode ${(System.nanoTime() - start) / 1000000}ms");
                val qrcode = JSONArray(qrcodeResult)
                if (qrcode.length() > 0) {
                    val qrcode = qrcode.getJSONObject(0)
                    if (pointsList == null) {
                        pointsList = mutableListOf<List<Point>>();
                    }
                    pointsList.add(pointFromJSONArray(qrcode.getJSONArray("position")));
                    onQRCode?.onQRCode(qrcode.getString("text"), qrcode.getString("format"))
                }
            }

            // pointsList is sorted by area
            autoScanHandler?.process(pointsList)
            if (pointsList != null) {
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
            } else {
                cropView.quads = null
            }
            cropView.invalidate()
            processor.finished()
        } catch (exception: Exception) {
            exception.printStackTrace()
        }
    }
}
