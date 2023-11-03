package com.akylas.documentscanner.utils

import android.content.ContentResolver
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.Rect
import android.graphics.RectF
import android.media.ExifInterface
import android.net.Uri
import java.io.File
import kotlin.math.max
import kotlin.math.min


/**
 * This class contains helper functions for processing images
 *
 * @constructor creates image util
 */
class ImageUtil {
    companion object {

        private fun getExifRotation(filePath: String): Int {
            val orientation = ExifInterface(filePath).getAttributeInt(
                ExifInterface.TAG_ORIENTATION,
                ExifInterface.ORIENTATION_NORMAL
            )

            val rotation = when (orientation) {
                ExifInterface.ORIENTATION_ROTATE_90 -> 90
                ExifInterface.ORIENTATION_ROTATE_180 -> 180
                ExifInterface.ORIENTATION_ROTATE_270 -> 270
                else -> 0
            }
            return rotation
        }

        private fun readBitmapFromFile(file: File, rotation: Int, maxWidth: Int): Bitmap {
            val opts = BitmapFactory.Options()
            opts.inJustDecodeBounds = true
            opts.inMutable = rotation != 0
            file.inputStream()
                .use { BitmapFactory.decodeStream(it, null, opts) }
            val bitmapRect = Rect(0, 0, opts.outWidth, opts.outHeight)
            opts.inJustDecodeBounds = false
            val width =
                if (rotation == 90 || rotation == 270) bitmapRect.height() else bitmapRect.width()
            opts.inSampleSize = max(1, width / maxWidth)
            val bitmap = file.inputStream().use {
                BitmapFactory.decodeStream(it, null, opts)!!
            }
            return if (rotation != 0) {
                val rotated = Bitmap.createBitmap(
                    bitmap,
                    0,
                    0,
                    bitmap.width,
                    bitmap.height,
                    Matrix().apply { postRotate(1f * rotation) },
                    true
                )
                if (bitmap !== rotated) {
                    bitmap.recycle()
                }
                rotated
            } else bitmap
        }

        /**
         * get bitmap image from file path
         *
         * @param file image is saved here
         * @return image bitmap
         */
        fun getImageFromFile(file: File, maxWidth: Int): Bitmap {
            if (!file.exists()) {
                throw Exception("File doesn't exist - $file")
            }

            if (file.length() == 0L) {
                throw Exception("File is empty $file")
            }

            if (!file.canRead()) {
                throw Exception("You don't have permission to read $file")
            }
            val rotation = getExifRotation(file.absolutePath)
            return readBitmapFromFile(file, rotation, maxWidth = maxWidth)
        }


        /**
         * get bitmap image from file uri
         *
         * @param fileUriString image is saved here and starts with file:///
         * @return bitmap image
         */
        fun readBitmapFromFileUriString(
            fileUriString: String,
            contentResolver: ContentResolver
        ): Bitmap {
            return BitmapFactory.decodeStream(
                contentResolver.openInputStream(Uri.parse(fileUriString))
            )
        }
    }
}