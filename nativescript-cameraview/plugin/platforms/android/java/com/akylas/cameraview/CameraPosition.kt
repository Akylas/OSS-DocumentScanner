package com.akylas.cameraview

enum class CameraPosition constructor(val value: Int) {
    BACK(0),
    FRONT(1);

    companion object {
        fun from(value: Int): CameraPosition = values().first { it.value == value }
    }
}