package com.akylas.documentscanner.models

import android.graphics.Point
import android.graphics.PointF
import android.graphics.RectF
import androidx.core.graphics.toPoint
import com.akylas.documentscanner.distance
import com.akylas.documentscanner.move
import com.akylas.documentscanner.multiply
import com.akylas.documentscanner.toPointF
import java.util.Arrays

/**
 * This class is used to represent the cropper. It contains 4 corners.
 *
 * @param topLeftCorner the top left corner
 * @param topRightCorner the top right corner
 * @param bottomRightCorner the bottom right corner
 * @param bottomLeftCorner the bottom left corner
 * @constructor creates a quad from Android points
 */
class Quad(
        val topLeftCorner: PointF,
        val topRightCorner: PointF,
        val bottomRightCorner: PointF,
        val bottomLeftCorner: PointF
) {
    /** @constructor creates a quad from OpenCV points */
    constructor(
            topLeftCorner: Point,
            topRightCorner: Point,
            bottomRightCorner: Point,
            bottomLeftCorner: Point
    ) : this(
            topLeftCorner.toPointF(),
            topRightCorner.toPointF(),
            bottomRightCorner.toPointF(),
            bottomLeftCorner.toPointF()
    )

    /** @constructor creates a quad from OpenCV points */
    constructor(
            points: List<Point>
    ) : this(PointF(points[0]), PointF(points[1]), PointF(points[3]), PointF(points[2]))

    companion object {

        fun getQuadAndCornerClosestToPoint(
                quads: List<Quad>?,
                point: PointF
        ): Pair<Int, QuadCorner>? {
            if (quads == null) {
                return null
            }
            var minIndex: Int = -1
            var minDist: Float = Float.MAX_VALUE
            var minCorner: QuadCorner = QuadCorner.BOTTOM_LEFT
            quads.forEachIndexed { index, quad ->
                for (corner in quad.corners) {
                    var dist = corner.value.distance(point)
                    if (dist < minDist) {
                        minCorner = corner.key
                        minDist = dist
                        minIndex = index
                    }
                }
            }
            if (minIndex != -1) {
                return Pair(minIndex, minCorner)
            }
            return null
        }
    }

    /** @property corners lets us get the point coordinates for any corner */
    var corners: MutableMap<QuadCorner, PointF> =
            mutableMapOf(
                    QuadCorner.TOP_LEFT to topLeftCorner,
                    QuadCorner.TOP_RIGHT to topRightCorner,
                    QuadCorner.BOTTOM_RIGHT to bottomRightCorner,
                    QuadCorner.BOTTOM_LEFT to bottomLeftCorner
            )

    /** @property edges 4 lines that connect the 4 corners */
    val edges: Array<Line>
        get() =
                arrayOf(
                        Line(topLeftCorner, topRightCorner),
                        Line(topRightCorner, bottomRightCorner),
                        Line(bottomRightCorner, bottomLeftCorner),
                        Line(bottomLeftCorner, topLeftCorner)
                )

    /** @property cornersList */
    val cornersList: Array<Point>
        get() =
                arrayOf(
                        topLeftCorner.toPoint(),
                        topRightCorner.toPoint(),
                        bottomRightCorner.toPoint(),
                        bottomLeftCorner.toPoint()
                )

    override fun toString(): String {
        return Arrays.toString(this.cornersList)
    }
    /**
     * This finds the corner that's closest to a point. When a user touches to drag the cropper,
     * that point is used to determine which corner to move.
     *
     * @param point we want to find the corner closest to this point
     * @return the closest corner
     */
    fun getCornerClosestToPoint(point: PointF): QuadCorner {
        return corners.minByOrNull { corner -> corner.value.distance(point) }?.key!!
    }

    /**
     * This moves a corner by (dx, dy)
     *
     * @param corner the corner that needs to be moved
     * @param dx the corner moves dx horizontally
     * @param dy the corner moves dy vertically
     */
    fun moveCorner(corner: QuadCorner, dx: Float, dy: Float) {
        corners[corner]?.offset(dx, dy)
    }

    /**
     * This maps original image coordinates to preview image coordinates. The original image is
     * probably larger than the preview image.
     *
     * @param imagePreviewBounds offset the point by the top left of imagePreviewBounds
     * @param ratio multiply the point by ratio
     * @return the 4 corners after mapping coordinates
     */
    fun mapOriginalToPreviewImageCoordinates(imagePreviewBounds: RectF, ratio: Float): Quad {
        return Quad(
                topLeftCorner.multiply(ratio).move(imagePreviewBounds.left, imagePreviewBounds.top),
                topRightCorner
                        .multiply(ratio)
                        .move(imagePreviewBounds.left, imagePreviewBounds.top),
                bottomRightCorner
                        .multiply(ratio)
                        .move(imagePreviewBounds.left, imagePreviewBounds.top),
                bottomLeftCorner
                        .multiply(ratio)
                        .move(imagePreviewBounds.left, imagePreviewBounds.top)
        )
    }

    fun applyRatio(ratio: Float): Quad {
        return Quad(
                topLeftCorner.multiply(ratio),
                topRightCorner.multiply(ratio),
                bottomRightCorner.multiply(ratio),
                bottomLeftCorner.multiply(ratio)
        )
    }

    /**
     * This maps preview image coordinates to original image coordinates. The original image is
     * probably larger than the preview image.
     *
     * @param imagePreviewBounds reverse offset the point by the top left of imagePreviewBounds
     * @param ratio divide the point by ratio
     * @return the 4 corners after mapping coordinates
     */
    fun mapPreviewToOriginalImageCoordinates(imagePreviewBounds: RectF, ratio: Float): Quad {
        return Quad(
                topLeftCorner
                        .move(-imagePreviewBounds.left, -imagePreviewBounds.top)
                        .multiply(1 / ratio),
                topRightCorner
                        .move(-imagePreviewBounds.left, -imagePreviewBounds.top)
                        .multiply(1 / ratio),
                bottomRightCorner
                        .move(-imagePreviewBounds.left, -imagePreviewBounds.top)
                        .multiply(1 / ratio),
                bottomLeftCorner
                        .move(-imagePreviewBounds.left, -imagePreviewBounds.top)
                        .multiply(1 / ratio)
        )
    }
}
