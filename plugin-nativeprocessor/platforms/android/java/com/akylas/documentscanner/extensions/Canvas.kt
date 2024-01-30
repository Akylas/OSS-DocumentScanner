package com.akylas.documentscanner

import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Point
import android.graphics.Path
import android.graphics.RectF

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
/**
 * This draws a quad (used to draw cropper). It draws 4 circles and
 * 4 connecting lines
 *
 * @param quad 4 corners
 * @param paint quad style (color, thickness for example)
 */
fun Canvas.drawQuadSimpleProgress(
    points:  List<Point>,
    progress: Int,
    paint: Paint,
) {
    val path = Path()
//    val points = quad.cornersList
    path.moveTo(points[0].x.toFloat(), points[0].y.toFloat())
    for (i in 1 until points.size) {
        path.lineTo(points[i].x.toFloat(), points[i].y.toFloat())
    }
    path.close()
    if (progress in 1..100) {
        save()
        val bounds = RectF()
        var ratio = progress / 100.0f;
        path.computeBounds(bounds, false)
        bounds.set(bounds.left, bounds.bottom - ratio* (bounds.bottom - bounds.top ), bounds.right, bounds.bottom )
        clipRect(bounds)
        drawPath(path, paint)
        restore()
    } else {
        drawPath(path, paint)
    }

}