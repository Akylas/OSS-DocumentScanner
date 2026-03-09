package com.nativescript.zip

import android.content.Context
import android.net.Uri
import androidx.documentfile.provider.DocumentFile
import com.anggrayudi.storage.file.findFolder
import java.io.BufferedInputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.IOException
import java.io.InputStream
import java.io.OutputStream
import java.security.InvalidParameterException
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream
import java.util.zip.ZipOutputStream

class Zip {
    interface ZipCallback {

        enum class Mode {
            ZIP,
            UNZIP
        }

        // totalEntries: total number of entries in the archive (files + dirs)
        // totalBytes: total bytes across entries if known (-1 if unknown)
        fun onStart(worker: String, mode: Mode, totalEntries: Int, totalBytes: Long)

        fun onUnzipComplete(worker: String, extractedFolder: String)
        fun onZipComplete(worker: String, zipFile: String)
        fun onError(worker: String, e: Exception, mode: Mode)

        // entryIndex: current entry index (starting at 1)
        // totalEntries: total number of entries in the zip/archive
        // entryName: current entry name (file path)
        // entryBytesProcessed: bytes written/read for current entry
        // entrySize: entry size if known (-1 if unknown)
        // totalBytesProcessed: total bytes written/read so far across all entries
        // totalBytes: total archive byte size if known (-1 if unknown)
        fun onProgress(
            worker: String,
            mode: Mode,
            entryIndex: Int,
            totalEntries: Int,
            entryName: String,
            entryBytesProcessed: Long,
            entrySize: Long,
            totalBytesProcessed: Long,
            totalBytes: Long
        )
    }

    internal class WUnzipWorker(
        private val context: Context,
        private val zipFile: File,
        private val destinationFolder: File,
        private val workerIdentifier: String,
        private val callback: ZipCallback
    ) : Thread() {
        override fun run() {
            if (!destinationFolder.exists()) {
                destinationFolder.mkdirs()
            }
            val buffer = ByteArray(1024)

            // count total entries and total bytes first
            var totalEntries = 0
            var totalBytes = 0L
            var totalBytesKnown = true
            ZipInputStream(FileInputStream(zipFile)).use { zis ->
                var zipEntry = zis.nextEntry
                while (zipEntry != null) {
                    totalEntries++
                    if (zipEntry.size >= 0) {
                        totalBytes += zipEntry.size
                    } else {
                        totalBytesKnown = false
                    }
                    zis.closeEntry()
                    zipEntry = zis.nextEntry
                }
            }
            if (!totalBytesKnown) totalBytes = -1L

            val zipInputStream = ZipInputStream(FileInputStream(zipFile))
            try {
                callback.onStart(workerIdentifier, ZipCallback.Mode.UNZIP, totalEntries, totalBytes)

                var zipEntry: ZipEntry? = zipInputStream.nextEntry
                var entryIndex = 0
                var totalBytesProcessed = 0L
                while (zipEntry != null) {
                    entryIndex++
                    val newFile = File(destinationFolder, zipEntry.name)

                    // If it's a directory, create it
                    if (zipEntry.isDirectory) {
                        newFile.mkdirs()
                        // report directory progress: zero bytes for entry
                        callback.onProgress(
                            workerIdentifier,
                            ZipCallback.Mode.UNZIP,
                            entryIndex,
                            totalEntries,
                            zipEntry.name,
                            0L,
                            zipEntry.size,
                            totalBytesProcessed,
                            totalBytes
                        )
                    } else {
                        // Create parent directories if needed
                        newFile.parentFile?.mkdirs()

                        // Write file content
                        val fileOutputStream = FileOutputStream(newFile)
                        var len: Int
                        var bytesForEntry = 0L
                        while (zipInputStream.read(buffer).also { len = it } > 0) {
                            fileOutputStream.write(buffer, 0, len)
                            bytesForEntry += len.toLong()
                            totalBytesProcessed += len.toLong()
                            callback.onProgress(
                                workerIdentifier,
                                ZipCallback.Mode.UNZIP,
                                entryIndex,
                                totalEntries,
                                zipEntry.name,
                                bytesForEntry,
                                zipEntry.size,
                                totalBytesProcessed,
                                totalBytes
                            )
                        }
                        fileOutputStream.close()
                    }

                    zipInputStream.closeEntry()
                    zipEntry = zipInputStream.nextEntry
                }
                callback.onUnzipComplete(workerIdentifier, destinationFolder.path)
            } catch (e: IOException) {
                callback.onError(workerIdentifier, e, ZipCallback.Mode.UNZIP)
            } finally {
                zipInputStream.close()
            }
        }
    }

    internal class WUnzipWorkerSAF(
        private val context: Context,
        private val zipFile: String,
        private val destinationFolder: String,
        private val workerIdentifier: String,
        private val callback: ZipCallback
    ) : Thread() {
        override fun run() {
            val outputIsSaf = destinationFolder.startsWith(CONTENT_PATH)
            var destinationFolderDocFile: DocumentFile? = null
            var destinationFolderFile: File? = null
            if (outputIsSaf) {
                destinationFolderDocFile = DocumentFile.fromTreeUri(context, Uri.parse(destinationFolder))
                if (destinationFolderDocFile == null) {
                    callback.onError(workerIdentifier, Exception("zip cannot unzip to destination: $destinationFolder"), ZipCallback.Mode.UNZIP)
                    return
                }
            } else {
                destinationFolderFile = File(destinationFolder)
                destinationFolderFile.mkdirs()
            }

            // count total entries and total bytes first
            var totalEntries = 0
            var totalBytes = 0L
            var totalBytesKnown = true
            try {
                val countInputStream: InputStream = if (zipFile.startsWith(CONTENT_PATH)) {
                    val documentFile = DocumentFile.fromSingleUri(context, Uri.parse(zipFile))
                    if (documentFile == null) {
                        callback.onError(workerIdentifier, Exception("zip not existing: $zipFile"), ZipCallback.Mode.UNZIP)
                        return
                    }
                    context.contentResolver.openInputStream(documentFile.uri)!!
                } else {
                    FileInputStream(File(zipFile))
                }

                ZipInputStream(countInputStream).use { zis ->
                    var ze = zis.nextEntry
                    while (ze != null) {
                        totalEntries++
                        if (ze.size >= 0) {
                            totalBytes += ze.size
                        } else {
                            totalBytesKnown = false
                        }
                        zis.closeEntry()
                        ze = zis.nextEntry
                    }
                }
            } catch (e: Exception) {
                // If counting fails, continue with totalEntries = 0 (unknown)
                totalEntries = 0
                totalBytes = -1
                totalBytesKnown = false
            }
            if (!totalBytesKnown) totalBytes = -1L

            var inputStream: InputStream? = null
            if (zipFile.startsWith(CONTENT_PATH)) {
                val documentFile = DocumentFile.fromSingleUri(context, Uri.parse(zipFile))
                if (documentFile == null) {
                    callback.onError(workerIdentifier, Exception("zip not existing: $zipFile"), ZipCallback.Mode.UNZIP)
                    return
                }
                inputStream = context.contentResolver.openInputStream(documentFile.uri)
            } else {
                inputStream = FileInputStream(File(zipFile))
            }
            inputStream!!.use { zipFileInputStream ->
                ZipInputStream(zipFileInputStream).use { zis ->
                    try {
                        val buffer = ByteArray(1024)
                        callback.onStart(workerIdentifier, ZipCallback.Mode.UNZIP, totalEntries, totalBytes)
                        var zipEntry = zis.nextEntry
                        var entryIndex = 0
                        var totalBytesProcessed = 0L
                        while (zipEntry != null) {
                            entryIndex++
                            if (zipEntry.isDirectory) {
                                val name = if (zipEntry.name.endsWith("/")) zipEntry.name.dropLast(1) else zipEntry.name
                                File(destinationFolderFile, name)?.mkdirs()

                                var destFolder = destinationFolderDocFile
                                name.split("/").forEach {
                                    destFolder = destFolder?.findFolder(it) ?: destFolder?.createDirectory(it)
                                }
                                // directory progress
                                callback.onProgress(
                                    workerIdentifier,
                                    ZipCallback.Mode.UNZIP,
                                    entryIndex,
                                    totalEntries,
                                    zipEntry.name,
                                    0L,
                                    zipEntry.size,
                                    totalBytesProcessed,
                                    totalBytes
                                )
                            } else {
                                if (destinationFolderFile != null) {
                                    // Create parent directories if needed
                                    val newFile = File(destinationFolder, zipEntry.name)
                                    newFile.parentFile?.mkdirs()
                                    // Write file content
                                    val fileOutputStream = FileOutputStream(newFile)
                                    var len: Int
                                    var bytesForEntry = 0L
                                    while (zis.read(buffer).also { len = it } > 0) {
                                        fileOutputStream.write(buffer, 0, len)
                                        bytesForEntry += len.toLong()
                                        totalBytesProcessed += len.toLong()
                                        callback.onProgress(
                                            workerIdentifier,
                                            ZipCallback.Mode.UNZIP,
                                            entryIndex,
                                            totalEntries,
                                            zipEntry.name,
                                            bytesForEntry,
                                            zipEntry.size,
                                            totalBytesProcessed,
                                            totalBytes
                                        )
                                    }
                                    fileOutputStream.close()
                                }
                                if (destinationFolderDocFile != null) {
                                    // Create a new file in the target folder
                                    val paths = zipEntry.name.split("/")
                                    val name = paths.last()
                                    var destFolder = destinationFolderDocFile
                                    paths.dropLast(1).forEach {
                                        destFolder = destFolder?.findFolder(it) ?: destFolder?.createDirectory(it)
                                    }
                                    val newFile = destFolder?.findFile(name) ?: destFolder?.createFile("*/*", name)

                                    newFile?.uri?.let { fileUri ->
                                        // Write the file content
                                        context.contentResolver.openOutputStream(fileUri)?.use { outputStream ->
                                            var len: Int
                                            var bytesForEntry = 0L
                                            while (zis.read(buffer).also { len = it } > 0) {
                                                outputStream.write(buffer, 0, len)
                                                bytesForEntry += len.toLong()
                                                totalBytesProcessed += len.toLong()
                                                callback.onProgress(
                                                    workerIdentifier,
                                                    ZipCallback.Mode.UNZIP,
                                                    entryIndex,
                                                    totalEntries,
                                                    zipEntry.name,
                                                    bytesForEntry,
                                                    zipEntry.size,
                                                    totalBytesProcessed,
                                                    totalBytes
                                                )
                                            }
                                        }
                                    }
                                }
                            }
                            zipEntry = zis.nextEntry
                        }
                        callback.onUnzipComplete(workerIdentifier, destinationFolder)
                    } catch (exception: Exception) {
                        callback.onError(workerIdentifier, exception, ZipCallback.Mode.UNZIP)
                    }
                }
            }
        }
    }

    // ZIP worker for regular file system paths
    internal class WZipWorker(
        private val context: Context,
        private val inputPaths: List<String>,
        private val destinationZip: File,
        private val workerIdentifier: String,
        private val keepParent: Boolean,
        private val callback: ZipCallback
    ) : Thread() {
        override fun run() {
            try {
                if (destinationZip.exists()) {
                    destinationZip.delete()
                } else {
                    destinationZip.parentFile?.mkdirs()
                }

                // Gather entries (file -> relative path), compute totals
                val entries = mutableListOf<Pair<File, String>>() // file + relative name
                var totalBytes = 0L
                var totalBytesKnown = true
                inputPaths.forEach { path ->
                    val f = File(path)
                    if (!f.exists()) {
                        throw InvalidParameterException("Input path does not exist: $path")
                    }
                    if (f.isDirectory) {
                        // Collect recursively. If keepParent is false pass empty basePath so
                        // collectFiles will emit entries rooted at the directory's children,
                        // preserving deep structure.
                        val base = if (keepParent) f.name else ""
                        collectFiles(f, base, entries) { file ->
                            val size = file.length()
                            if (file.isFile) {
                                totalBytes += size
                            }
                        }
                    } else {
                        entries.add(Pair(f, f.name))
                        val size = f.length()
                        if (size >= 0) {
                            totalBytes += size
                        } else {
                            totalBytesKnown = false
                        }
                    }
                }
                val totalEntries = entries.size
                if (!totalBytesKnown) totalBytes = -1L

                callback.onStart(workerIdentifier, ZipCallback.Mode.ZIP, totalEntries, totalBytes)
                val buffer = ByteArray(1024)
                var entryIndex = 0
                var totalBytesProcessed = 0L
                ZipOutputStream(FileOutputStream(destinationZip)).use { zos ->
                    for ((file, relativePath) in entries) {
                        entryIndex++
                        if (file.isDirectory) {
                            val dirEntry = ZipEntry(if (relativePath.endsWith("/")) relativePath else "$relativePath/")
                            zos.putNextEntry(dirEntry)
                            zos.closeEntry()
                            callback.onProgress(
                                workerIdentifier,
                                ZipCallback.Mode.ZIP,
                                entryIndex,
                                totalEntries,
                                relativePath,
                                0L,
                                0L,
                                totalBytesProcessed,
                                totalBytes
                            )
                        } else {
                            val zipEntry = ZipEntry(relativePath)
                            zos.putNextEntry(zipEntry)
                            var len: Int
                            var bytesForEntry = 0L
                            BufferedInputStream(FileInputStream(file)).use { bis ->
                                while (bis.read(buffer).also { len = it } > 0) {
                                    zos.write(buffer, 0, len)
                                    bytesForEntry += len.toLong()
                                    totalBytesProcessed += len.toLong()
                                    callback.onProgress(
                                        workerIdentifier,
                                        ZipCallback.Mode.ZIP,
                                        entryIndex,
                                        totalEntries,
                                        relativePath,
                                        bytesForEntry,
                                        file.length(),
                                        totalBytesProcessed,
                                        totalBytes
                                    )
                                }
                            }
                            zos.closeEntry()
                        }
                    }
                }
                callback.onZipComplete(workerIdentifier, destinationZip.path)
            } catch (e: Exception) {
                callback.onError(workerIdentifier, e, ZipCallback.Mode.ZIP)
            }
        }

        private fun collectFiles(file: File, basePath: String, entries: MutableList<Pair<File, String>>, onFile: ((File) -> Unit)? = null) {
             if (file.isDirectory) {
                 // only add directory entry if we have a non-empty basePath (prevents adding root when keepParent=false)
                 if (basePath.isNotEmpty()) {
                     entries.add(Pair(file, basePath))
                 }
                 val children = file.listFiles() ?: return
                 for (child in children) {
                     val childRel = if (basePath.isNotEmpty()) "$basePath/${child.name}" else child.name
                     collectFiles(child, childRel, entries, onFile)
                 }
             } else {
                 val path = if (basePath.isNotEmpty()) basePath else file.name
                 entries.add(Pair(file, path))
                 onFile?.invoke(file)
             }
         }
    }

    // ZIP worker supporting SAF input and/or destination
    internal class WZipWorkerSAF(
        private val context: Context,
        private val inputPaths: List<String>,
        private val destinationZip: String,
        private val workerIdentifier: String,
        private val keepParent: Boolean,
        private val callback: ZipCallback
    ) : Thread() {

        data class ZipSource(
            val isUri: Boolean,
            val pathOrUri: String,
            val entryName: String,
            val isDirectory: Boolean,
            val entrySize: Long
        )

        override fun run() {
            try {
                // Build archive entries from multiple inputs (file system or SAF)
                val sources = mutableListOf<ZipSource>()
                var totalBytes = 0L
                var totalBytesKnown = true

                for (path in inputPaths) {
                    if (path.startsWith(CONTENT_PATH)) {
                        // SAF: might be a tree or a single file
                        val docSingle = DocumentFile.fromSingleUri(context, Uri.parse(path))
                        if (docSingle != null) {
                            if (docSingle.isDirectory) {
                                val base = if (keepParent) (docSingle.name ?: "root") else ""
                                collectSafFiles(docSingle, base, sources) { sz ->
                                    if (sz >= 0) totalBytes += sz else totalBytesKnown = false
                                }
                            } else {
                                val size = try {
                                    docSingle.length()
                                } catch (e: Exception) {
                                    -1L
                                }
                                if (size < 0) totalBytesKnown = false else totalBytes += size
                                sources.add(ZipSource(true, path, docSingle.name ?: "file", false, size))
                            }
                        } else {
                            val docTree = DocumentFile.fromTreeUri(context, Uri.parse(path))
                            if (docTree != null) {
                                val base = if (keepParent) (docTree.name ?: "root") else ""
                                collectSafFiles(docTree, base, sources) { sz ->
                                    if (sz >= 0) totalBytes += sz else totalBytesKnown = false
                                }
                            } else {
                                throw InvalidParameterException("Invalid SAF input path: $path")
                            }
                        }
                    } else {
                        val f = File(path)
                        if (!f.exists()) {
                            throw InvalidParameterException("Input path does not exist: $path")
                        }
                        if (f.isDirectory) {
                            if (keepParent) {
                                collectFiles(f, f.name, sources) { sz ->
                                    if (sz >= 0) totalBytes += sz else totalBytesKnown = false
                                }
                            } else {
                                f.listFiles()?.forEach { child ->
                                    collectFiles(child, child.name, sources) { sz ->
                                        if (sz >= 0) totalBytes += sz else totalBytesKnown = false
                                    }
                                }
                            }
                        } else {
                            val size = f.length()
                            if (size < 0) totalBytesKnown = false else totalBytes += size
                            sources.add(ZipSource(false, f.absolutePath, f.name, false, size))
                        }
                    }
                }

                val totalEntries = sources.size
                if (!totalBytesKnown) totalBytes = -1L
                callback.onStart(workerIdentifier, ZipCallback.Mode.ZIP, totalEntries, totalBytes)

                // Obtain dest OutputStream (SAF or file path)
                if (destinationZip.startsWith(CONTENT_PATH)) {
                    // Attempt to get doc as single file, or tree + create the file name
                    val destUri = Uri.parse(destinationZip)
                    var destDoc: DocumentFile? = DocumentFile.fromSingleUri(context, destUri)
                    if (destDoc == null) {
                        val treeDoc = DocumentFile.fromTreeUri(context, destUri)
                        if (treeDoc == null) {
                            throw InvalidParameterException("Invalid destination SAF path: $destinationZip")
                        }
                        // extract name from last path segment
                        val nameHint = destUri.lastPathSegment ?: "archive.zip"
                        destDoc = treeDoc.findFile(nameHint) ?: treeDoc.createFile("application/zip", nameHint)
                    }
                    val outputStream = context.contentResolver.openOutputStream(destDoc!!.uri)
                        ?: throw IOException("Cannot open output stream to destination: $destDoc")
                    outputStream.use { os ->
                        zipEntriesSAF(os, sources, totalEntries, totalBytes)
                    }
                    callback.onZipComplete(workerIdentifier, destinationZip)
                } else {
                    // normal file path
                    val destFile = File(destinationZip)
                    destFile.parentFile?.mkdirs()
                    val fos = FileOutputStream(destFile)
                    fos.use { os ->
                        zipEntriesSAF(os, sources, totalEntries, totalBytes)
                    }
                    callback.onZipComplete(workerIdentifier, destFile.path)
                }
            } catch (e: Exception) {
                callback.onError(workerIdentifier, e, ZipCallback.Mode.ZIP)
            }
        }

        private fun zipEntriesSAF(os: OutputStream, sources: List<ZipSource>, totalEntries: Int, totalBytes: Long) {
            val zos = ZipOutputStream(os)
            val buffer = ByteArray(1024)
            var entryIndex = 0
            var totalBytesProcessed = 0L

            for (source in sources) {
                entryIndex++
                if (source.isDirectory) {
                    val dirEntry = ZipEntry(if (source.entryName.endsWith("/")) source.entryName else "${source.entryName}/")
                    zos.putNextEntry(dirEntry)
                    zos.closeEntry()
                    callback.onProgress(
                        workerIdentifier,
                        ZipCallback.Mode.ZIP,
                        entryIndex,
                        totalEntries,
                        source.entryName,
                        0L,
                        0L,
                        totalBytesProcessed,
                        totalBytes
                    )
                } else {
                    val zipEntry = ZipEntry(source.entryName)
                    zos.putNextEntry(zipEntry)

                    var inStream: InputStream? = null
                    try {
                        inStream = if (source.isUri) {
                            val uri = Uri.parse(source.pathOrUri)
                            context.contentResolver.openInputStream(uri)
                        } else {
                            FileInputStream(File(source.pathOrUri))
                        }

                        inStream?.use { input ->
                            var len: Int
                            var bytesForEntry = 0L
                            BufferedInputStream(input).use { bis ->
                                while (bis.read(buffer).also { len = it } > 0) {
                                    zos.write(buffer, 0, len)
                                    bytesForEntry += len.toLong()
                                    totalBytesProcessed += len.toLong()
                                    callback.onProgress(
                                        workerIdentifier,
                                        ZipCallback.Mode.ZIP,
                                        entryIndex,
                                        totalEntries,
                                        source.entryName,
                                        bytesForEntry,
                                        source.entrySize,
                                        totalBytesProcessed,
                                        totalBytes
                                    )
                                }
                            }
                        }
                    } finally {
                        zos.closeEntry()
                    }
                }
            }
            zos.finish()
        }

        private fun collectFiles(file: File, basePath: String, result: MutableList<ZipSource>, onFile: ((Long) -> Unit)? = null) {
            if (file.isDirectory) {
                if (basePath.isNotEmpty()) {
                    result.add(ZipSource(false, file.absolutePath, basePath, true, 0L))
                }
                file.listFiles()?.forEach { f ->
                    val rel = if (basePath.isNotEmpty()) "$basePath/${f.name}" else f.name
                    collectFiles(f, rel, result, onFile)
                }
            } else {
                val path = if (basePath.isNotEmpty()) basePath else file.name
                result.add(ZipSource(false, file.absolutePath, path, false, file.length()))
                onFile?.invoke(file.length())
            }
        }

        private fun collectSafFiles(doc: DocumentFile, basePath: String, result: MutableList<ZipSource>, onFile: ((Long) -> Unit)? = null) {
            if (doc.isDirectory) {
                if (basePath.isNotEmpty()) {
                    result.add(ZipSource(true, doc.uri.toString(), basePath, true, 0L))
                }
                for (child in doc.listFiles()) {
                    val rel = if (basePath.isNotEmpty()) "$basePath/${child.name}" else (child.name ?: "file")
                    collectSafFiles(child, rel, result, onFile)
                }
            } else {
                val size = try {
                    doc.length()
                } catch (e: Exception) {
                    -1L
                }
                if (size < 0) onFile?.invoke(-1L) else onFile?.invoke(size)
                val path = if (basePath.isNotEmpty()) basePath else (doc.name ?: "file")
                result.add(ZipSource(true, doc.uri.toString(), path, false, size))
            }
        }
    }

    companion object {
        val CONTENT_PATH = "content://"

        /**
         * Method to extract the contents of the ZIP file
         * @param zipFile Zip file to extract
         * @param destinationFolder Where to extract
         * @param workerIdentifier Background thread identifier
         * @param callback Callback method
         */
        @JvmStatic
        fun unzip(
            context: Context,
            zipFile: String,
            destinationFolder: String,
            workerIdentifier: String,
            callback: ZipCallback
        ) {
            if (!zipFile.startsWith(CONTENT_PATH) && !destinationFolder.startsWith(CONTENT_PATH)) {
                WUnzipWorker(context, File(zipFile), File(destinationFolder), workerIdentifier, callback).run {
                    start()
                }
            } else {
                WUnzipWorkerSAF(context, zipFile, destinationFolder, workerIdentifier, callback).run {
                    start()
                }
            }
        }

        /**
         * Method to create a ZIP file from input files and folders.
         * inputPaths may contain normal file system paths or SAF content URIs (content://...)
         * destinationZip may be a file path, or a content:// URI to a file or tree uri
         */
        @JvmStatic
        fun zip(
            context: Context,
            inputPaths: List<String>,
            destinationZip: String,
            workerIdentifier: String,
            keepParent: Boolean = true,
            callback: ZipCallback
        ) {
            val anySafInput = inputPaths.any { it.startsWith(CONTENT_PATH) }
            val outputIsSaf = destinationZip.startsWith(CONTENT_PATH)
            if (!anySafInput && !outputIsSaf) {
                WZipWorker(context, inputPaths, File(destinationZip), workerIdentifier, keepParent, callback).run {
                    start()
                }
            } else {
                WZipWorkerSAF(context, inputPaths, destinationZip, workerIdentifier, keepParent, callback).run {
                    start()
                }
            }
        }
    }
}