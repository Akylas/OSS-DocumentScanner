package com.akylas.documentscanner

import android.graphics.Point
import android.graphics.PointF

fun PointF.toPoint(): Point {
    return Point(x.toInt(), y.toInt())
}
