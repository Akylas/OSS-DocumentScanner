package com.akylas.documentscanner.utils

import androidx.documentfile.provider.DocumentFile

import android.content.ContentUris
import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.net.Uri
import android.provider.MediaStore
import java.io.File
import java.io.FileInputStream
import java.io.IOException


class FileUtils {
    companion object {
        fun getUriFromFile(context: Context, filePath: String): Uri? {
            val cursor: Cursor? = context.contentResolver.query(
                MediaStore.Files.getContentUri("external"),
                arrayOf(MediaStore.Files.FileColumns._ID),
                MediaStore.Files.FileColumns.DATA + "=? ",
                arrayOf(filePath), null
            )

            return if (cursor != null && cursor.moveToFirst()) {
                val id: Int = cursor.getInt(cursor.getColumnIndexOrThrow(MediaStore.Files.FileColumns._ID))
                cursor.close()
                ContentUris.withAppendedId(MediaStore.Files.getContentUri("external"), id.toLong())
            } else {
                val file = File(filePath)
                if (file.exists()) {
                    val values = ContentValues().apply {
                        put(MediaStore.Files.FileColumns.DATA, filePath)
                    }
                    context.contentResolver.insert(MediaStore.Files.getContentUri("external"), values)
                } else {
                    null
                }
            }
        }

        @Throws(IOException::class)
        fun copyFileToDocumentFile(context: Context, sourceFilePath: String, mimeType: String, destFolderPath: String): String {

            val destFolder = DocumentFile.fromTreeUri(context, Uri.parse(destFolderPath));
            val src = File(sourceFilePath)
            if (!src.exists() || !src.isFile) throw IOException("Source file does not exist: $sourceFilePath")
            val fileName = src.name

            // If a file with same name exists, try to reuse it, otherwise create a new one
            val outDoc = destFolder!!.findFile(fileName) ?: destFolder!!.createFile(mimeType, fileName)
            ?: throw IOException("Could not create file $fileName in destination folder")

            val outStream = context.contentResolver.openOutputStream(outDoc.uri)
                ?: throw IOException("Could not open output stream for ${outDoc.uri}")

            FileInputStream(src).use { input ->
                outStream.use { output ->
                    val buffer = ByteArray(8 * 1024)
                    var read: Int
                    while (input.read(buffer).also { read = it } >= 0) {
                        output.write(buffer, 0, read)
                    }
                    output.flush()
                }
            }

            return outDoc.uri.toString()
        }
}
}