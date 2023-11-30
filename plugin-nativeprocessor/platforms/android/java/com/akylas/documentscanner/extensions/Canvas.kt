package com.akylas.documentscanner

import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Point
import android.graphics.Path

/**
 * This draws a quad (used to draw cropper). It draws 4 circles and
 * 4 connecting lines
 *
 * @param quad 4 corners
 * @param paint quad style (color, thickness for example)
 */
fun Canvas.drawQuadSimple(
    points:  List<Point>,
    paint: Paint,
) {
    val path = Path()
//    val points = quad.cornersList
    path.moveTo(points[0].x.toFloat(), points[0].y.toFloat())
    for (i in 1 until points.size) {
        path.lineTo(points[i].x.toFloat(), points[i].y.toFloat())
    }
    // path.lineTo(points[0].x.toFloat(), points[0].y.toFloat())
    path.close()
    drawPath(path, paint)
}