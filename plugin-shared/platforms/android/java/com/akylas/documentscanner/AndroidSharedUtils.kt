package com.akylas.documentscanner

import android.os.Environment
import android.os.StatFs

import java.security.MessageDigest
import java.util.Base64

class AndroidSharedUtils {
    companion object {

        /**
         * Returns available storage space in bytes.
         *
         * @param useExternal If true, checks external storage; otherwise internal storage.
         */
        fun availableStorageSpaceInBytes(useExternal: Boolean = false): Long {
            return try {
                val path = if (useExternal) {
                    Environment.getExternalStorageDirectory()
                } else {
                    Environment.getDataDirectory()
                }

                val stat = StatFs(path.path)
                stat.availableBytes
            } catch (e: Exception) {
                e.printStackTrace()
                0L
            }
        }

        /**
         * Checks if available storage is greater than given size.
         *
         * @param sizeBytes Required free space in bytes
         * @param useExternal If true, checks external storage; otherwise internal storage
         */
        fun checkAvailableStorage(
            sizeBytes: Long,
            useExternal: Boolean = false
        ): Boolean {
            return availableStorageSpaceInBytes(useExternal) > sizeBytes
        }

        fun generateCodeChallenge(codeVerifier: String): String {
            // SHA-256 hash
            val digest = MessageDigest.getInstance("SHA-256")
                .digest(codeVerifier.toByteArray(Charsets.UTF_8))

            // Base64 URL-safe encoding (no padding)
            return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(digest)
        }
        }
}