package com.akylas.documentscanner.models

import android.graphics.PointF

/**
 * represents a line connecting 2 Android points
 *
 * @param fromPoint the 1st point
 * @param toPoint the 2nd point
 * @constructor creates a line connecting 2 points
 */
class Line(fromPoint: PointF, toPoint: PointF) {
    val from: PointF = fromPoint
    val to: PointF = toPoint
}