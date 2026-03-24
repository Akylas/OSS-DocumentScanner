import android.os.Environment
import android.os.StatFs

object AndroidSharedUtils {

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
}