package com.akylas.cameraview

enum class CameraFlashMode constructor(val value: Int) {
    OFF(0),
    ON(1),
    AUTO(2),
    RED_EYE(3),
    TORCH(4);

    companion object {
        fun from(value: Int): CameraFlashMode = CameraFlashMode.values().first { it.value == value }
    }
}