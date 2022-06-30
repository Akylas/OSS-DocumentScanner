package com.akylas.cameraview

enum class Quality constructor(val value: Int) {
    MAX_480P(0),
    MAX_720P(1),
    MAX_1080P(2),
    MAX_2160P(3),
    HIGHEST(4),
    LOWEST(5),
    QVGA(6);

    companion object {
        fun from(value: Int): Quality = values().first { it.value == value }
    }
}