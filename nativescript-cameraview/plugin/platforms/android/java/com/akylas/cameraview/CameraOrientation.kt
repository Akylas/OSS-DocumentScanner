package com.akylas.cameraview

enum class CameraOrientation constructor(val value: Int) {
    UNKNOWN(1000),
    PORTRAIT(1001),
    PORTRAIT_UPSIDE_DOWN(1002),
    LANDSCAPE_LEFT(1003),
    LANDSCAPE_RIGHT(1004);

    companion object {
        fun from(value: Int): CameraOrientation = values().first { it.value == value }
    }
}