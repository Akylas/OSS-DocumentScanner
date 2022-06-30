package com.akylas.cameraview

import android.media.Image
import androidx.camera.core.ImageInfo

interface ImageAnalysisCallback {
    fun process(image: Image, info: ImageInfo, processor: ImageAsyncProcessor)
}