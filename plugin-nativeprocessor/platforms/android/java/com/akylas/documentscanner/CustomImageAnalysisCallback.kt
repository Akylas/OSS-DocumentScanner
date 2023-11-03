package com.akylas.documentscanner

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Point
import android.graphics.PointF
import android.media.Image
import com.akylas.documentscanner.models.Quad
import com.akylas.documentscanner.utils.ImageUtil
import com.nativescript.cameraview.ImageAnalysisCallback
import com.nativescript.cameraview.ImageAsyncProcessor
import java.io.File
import java.util.*
import org.json.JSONArray

class CustomImageAnalysisCallback
@JvmOverloads
constructor(context: Context, private val cropView: CropView? = null) : ImageAnalysisCallback {
    private var yuvToRgbConverter: YuvToRgbConverter

    init {
        yuvToRgbConverter = YuvToRgbConverter(context)
    }

    var previewResizeThreshold = 300.0

    companion object {
        private external fun nativeScan(
                srcBitmap: Bitmap,
                shrunkImageHeight: Int,
                imageRotation: Int
        ): Vector<Vector<Point>>

        private external fun nativeCrop(srcBitmap: Bitmap, points: Array<Point>, transforms:String, outBitmap: Bitmap)

        /**
         * @property cropperOffsetWhenCornersNotFound if we can't find document corners, we set
         * corners to image size with a slight margin
         */
        val cropperOffsetWhenCornersNotFound = 100.0

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
         * @return a list with document corners (top left, top right, bottom right, bottom left)
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
         * Pass in a photo of a document, and get back 4 corner points (top left, top right, bottom
         * right, bottom left). This tries to detect document corners, but falls back to photo
         * corners with slight margin in case we can't detect document corners.
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
            val cornerPoints: List<List<Point>>? =
                    findDocumentCorners(photo, shrunkImageHeight, imageRotation)
            // if cornerPoints is null then default the corners to the photo bounds with a margin
            var default =
                    if (returnDefault)
                            listOf(
                                    Point(
                                            cropperOffsetWhenCornersNotFound.toInt(),
                                            cropperOffsetWhenCornersNotFound.toInt()
                                    ),
                                    Point(
                                            (photo.width.toDouble() -
                                                            cropperOffsetWhenCornersNotFound)
                                                    .toInt(),
                                            cropperOffsetWhenCornersNotFound.toInt()
                                    ),
                                    Point(
                                            cropperOffsetWhenCornersNotFound.toInt(),
                                            (photo.height.toDouble() -
                                                            cropperOffsetWhenCornersNotFound
                                                                    .toInt())
                                                    .toInt()
                                    ),
                                    Point(
                                            (photo.width.toDouble() -
                                                            cropperOffsetWhenCornersNotFound)
                                                    .toInt(),
                                            (photo.height.toDouble() -
                                                            cropperOffsetWhenCornersNotFound)
                                                    .toInt()
                                    )
                            )
                    else null
            return if (cornerPoints != null) cornerPoints
            else (if (default != null) listOf(default) else null)
        }

        /**
         * take a photo with a document, and find the document's corners
         *
         * @param image a photo with a document
         * @return a list with document corners (top left, top right, bottom right, bottom left)
         */
        @JvmOverloads
        fun getJSONDocumentCorners(
                image: Bitmap,
                shrunkImageHeight: Double = 500.0,
                imageRotation: Int = 0
        ): String {
            val outPoints = findDocumentCorners(image, shrunkImageHeight, imageRotation)
            val quads =
                    outPoints?.map { points ->
                        points
                                .sortedBy { it.y }
                                .chunked(2)
                                .map { it.sortedBy { point -> point.x } }
                                .flatten()
                    }
            val result = ArrayList<ArrayList<List<Int>>>()
            quads?.forEach { quad ->
                val result2 = ArrayList<List<Int>>()
                quad.forEach { point -> result2.add(listOf(point.x, point.y)) }
                val count = result2.size
                var temp = result2[count - 1] // Save value before overwrite.
                result2[count - 1] = result2[count - 2] // First half of swap.
                result2[count - 2] = temp
                result.add(result2)
            }
            return result.toString()
        }

        fun quadsFromJSONString(str: String): List<Quad>? {
            val jsonArray = JSONArray(str)
            val listdata = ArrayList<Quad>()
            for (i in 0 until jsonArray.length()) {
                val subJsonArray = jsonArray.getJSONArray(i)
                listdata.add(
                        Quad(
                                PointF(
                                        subJsonArray.getJSONArray(0).getDouble(0).toFloat(),
                                        subJsonArray.getJSONArray(0).getDouble(1).toFloat()
                                ),
                                PointF(
                                        subJsonArray.getJSONArray(1).getDouble(0).toFloat(),
                                        subJsonArray.getJSONArray(1).getDouble(1).toFloat()
                                ),
                                PointF(
                                        subJsonArray.getJSONArray(2).getDouble(0).toFloat(),
                                        subJsonArray.getJSONArray(2).getDouble(1).toFloat()
                                ),
                                PointF(
                                        subJsonArray.getJSONArray(3).getDouble(0).toFloat(),
                                        subJsonArray.getJSONArray(3).getDouble(1).toFloat()
                                )
                        )
                )
            }
            return listdata
        }

        /**
         * take a photo with a document, crop everything out but document, and force it to display
         * as a rectangle
         *
         * @param document with original image data
         * @param colorFilter for this image
         * @return bitmap with cropped and warped document
         */
        @JvmOverloads
        fun cropDocument(originalPhotoPath: String, quads: String, transforms: String = ""): Array<out Any> {
            val file = File(originalPhotoPath)
            val bitmap = ImageUtil.getImageFromFile(file, 4000)
            val result = cropDocument(bitmap, quads)
            bitmap.recycle()

            return result
        }

        /**
         * take a photo with a document, crop everything out but document, and force it to display
         * as a rectangle
         *
         * @param document with original image data
         * @param colorFilter for this image
         * @return bitmap with cropped and warped document
         */
        @JvmOverloads
        fun cropDocument(bitmap: Bitmap, quads: String, transforms: String = ""): Array<out Any> {
            val bitmaps = arrayListOf<Bitmap>()
            quadsFromJSONString(quads)!!.forEachIndexed { index, quad ->
                // convert corners from image preview coordinates to original photo coordinates
                // (original image is probably bigger than the preview image)
                val corners = quad!!
                // convert output image matrix to bitmap
                val cropWidth =
                        ((corners.topLeftCorner.distance(corners.topRightCorner) +
                                        corners.bottomLeftCorner.distance(
                                                corners.bottomRightCorner
                                        )) / 2)
                                .toInt()
                val cropHeight =
                        ((corners.bottomLeftCorner.distance(corners.topLeftCorner) +
                                        corners.bottomRightCorner.distance(
                                                corners.topRightCorner
                                        )) / 2)
                                .toInt()

                val cropBitmap = Bitmap.createBitmap(cropWidth, cropHeight, Bitmap.Config.ARGB_8888)
                nativeCrop(bitmap, corners.cornersList, transforms, cropBitmap)
                bitmaps.add(cropBitmap)
            }
            return bitmaps.toArray()
        }
    }

    override fun process(
            image: Image,
            info: androidx.camera.core.ImageInfo,
            processor: ImageAsyncProcessor
    ) {
        try {
            if (cropView == null) {
                processor.finished()
                return
            }
            var previewBitmap =
                    Bitmap.createBitmap(image.width, image.height, Bitmap.Config.ARGB_8888)
            yuvToRgbConverter.yuvToRgb(image, previewBitmap)

            var pointsList: List<List<Point>>? =
                    getDocumentCorners(
                            previewBitmap,
                            previewResizeThreshold,
                            info.rotationDegrees,
                            false
                    )
            if (pointsList != null) {
                var photoHeight: Int =
                        if (info.rotationDegrees == 180 || info.rotationDegrees == 0) {
                            image.height
                        } else {
                            image.width
                        }
                val ratio = cropView!!.height.toFloat() / photoHeight.toFloat()
                val quads =
                        pointsList.map { points ->
                            points
                                    .sortedBy { it.y }
                                    .chunked(2)
                                    .map { it.sortedBy { point -> point.x } }
                                    .flatten()
                        }
                cropView!!.quads =
                        quads!!.map { points -> Quad(points) }.map { quad ->
                            quad.applyRatio(ratio)
                        }
            } else {
                cropView!!.quads = null
            }
            cropView!!.invalidate()
            previewBitmap.recycle()
            processor.finished()
        } catch (exception: Exception) {
            exception.printStackTrace()
        }
    }
}
