package com.akylas.documentscanner.utils

import android.content.ContentUris
import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.net.Uri
import android.provider.MediaStore
import java.io.File

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
}
}