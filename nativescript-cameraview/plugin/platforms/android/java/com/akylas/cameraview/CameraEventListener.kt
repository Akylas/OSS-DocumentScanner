/*
 * Created By Osei Fortune on 2/16/18 8:43 PM
 * Copyright (c) 2018
 * Last modified 2/16/18 7:16 PM
 *
 */

package com.akylas.cameraview

import java.io.File
import java.lang.Exception

interface CameraEventListener {
    fun onReady()
    fun onCameraOpen()
    fun onCameraClose()
    fun onCameraPhoto(file: File?)
    fun onCameraVideo(file: File?)
    fun onCameraAnalysis(analysis: ImageAnalysis)
    fun onCameraError(message: String, ex: Exception)
    fun onCameraVideoStart()
}
