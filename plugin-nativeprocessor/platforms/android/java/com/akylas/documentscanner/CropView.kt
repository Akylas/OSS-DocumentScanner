package com.akylas.documentscanner

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.animation.ValueAnimator
import android.app.Activity
import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Point
import android.util.AttributeSet
import android.view.View
import androidx.annotation.UiThread


class CropView
@JvmOverloads
constructor(context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0) : View(context, attrs, defStyleAttr) {

    var imageWidth: Int = 0
    var imageHeight: Int = 0

    /**
     * @property imagePreviewHeight this is needed because height doesn't update immediately
     * after we set the image
     */
    private var imagePreviewHeight = height

    /**
     * @property imagePreviewWidth this is needed because width doesn't update immediately
     * after we set the image
     */
    private var imagePreviewWidth = width
    /**
     * @property imagePreviewBounds image coordinates - if the image ratio is different than
     * the image container ratio then there's blank space either at the top and bottom of the
     * image or the left and right of the image
     */
//    val imagePreviewBounds: RectF
//        get() {
//            // image container width to height ratio
//            val imageViewRatio: Float = imagePreviewWidth.toFloat() / imagePreviewHeight.toFloat()
//
//            // image width to height ratio
//            val imageRatio = width.toFloat() / height.toFloat()
//
//            var left = 0f
//            var top = 0f
//            var right = imagePreviewWidth.toFloat()
//            var bottom = imagePreviewHeight.toFloat()
//
//            if (imageRatio > imageViewRatio) {
//                // if the image is really wide, there's blank space at the top and bottom
//                val offset = (imagePreviewHeight - (imagePreviewWidth / imageRatio)) / 2
//                top += offset
//                bottom -= offset
//            } else {
//                // if the image is really tall, there's blank space at the left and right
//                // it's also possible that the image ratio matches the image container ratio
//                // in which case there's no blank space
//                val offset = (imagePreviewWidth - (imagePreviewHeight * imageRatio)) / 2
//                left += offset
//                right -= offset
//            }
//
//            return RectF(left, top, right, bottom)
//        }
    /**
     * Initially the image preview height is 0. This calculates the height by using the photo
     * dimensions. It maintains the photo aspect ratio (we likely need to scale the photo down
     * to fit the preview container).
     *
     * @param photo the original photo with a rectangular document
     * @param screenWidth the device width
     */
    fun setImagePreviewBounds(photoWidth: Int, photoHeight: Int, screenWidth: Int, screenHeight: Int) {
        // image width to height aspect ratio
        val imageRatio = photoWidth.toFloat() / photoHeight.toFloat()

        imagePreviewHeight = if (photoHeight > photoWidth) {
            // if user takes the photo in portrait
            (screenWidth.toFloat() / imageRatio).toInt()
        } else {
            // if user takes the photo in landscape
            // if user takes the photo in landscape
            (screenWidth.toFloat() * imageRatio).toInt()
        }
        imagePreviewWidth = screenWidth
    }
    /**
     * @property quad the 4 document corners
     */

    private var mQuads: List<List<Point>>? = null
    public var scale: Float = 1.0f
    public var quads: List<List<Point>>?
        get() {return this.mQuads}
        set(value) {
            (context as Activity).runOnUiThread {
                setQuadsAnimated(value)
            }
            }
    private var animationQuads: ArrayList<List<Point>>? = null
    private var startAnimationQuads: List<List<Point>>? = null
    private var mAnimator: ValueAnimator? = null

    val linePaint = Paint(Paint.ANTI_ALIAS_FLAG)
    var fillPaint: Paint? = null
    var colors = listOf<Int>(0xFF007AFF.toInt())
    var strokeWidth = 2
    var animationDuration = 200L

    init {
        // set cropper style
        linePaint.style = Paint.Style.STROKE
        linePaint.strokeWidth = resources.displayMetrics.density * strokeWidth
        linePaint.strokeJoin = Paint.Join.ROUND
        linePaint.strokeCap = Paint.Cap.ROUND
        setWillNotDraw(false)
    }

    fun interpolatePoint(point1: Point, point2: Point, value: Float): Point {
        return Point(
            (point1.x + (value)*(point2.x - point1.x)).toInt(),
            (point1.y + (value)*(point2.y - point1.y)).toInt()
        )
    }

    @UiThread
    fun setQuadsAnimated(quads: List<List<Point>>?) {
    if (quads == null || this.mQuads == null || this.mQuads!!.size == 0 || this.mQuads!!.size != quads.size) {
        this.mQuads = quads
        invalidate()
        return;
    }
        if (mAnimator != null) {
            mAnimator!!.removeAllListeners()
            mAnimator!!.cancel()
        }
        startAnimationQuads = if (animationQuads != null)   animationQuads else  this.mQuads
        animationQuads = null
        this.mQuads = quads
        mAnimator = ValueAnimator.ofFloat(0.0f, 100.0f)
        mAnimator!!.setDuration(animationDuration)
        val endQuads = this.mQuads
        mAnimator!!.addUpdateListener(object: ValueAnimator.AnimatorUpdateListener {
            override fun onAnimationUpdate(animation: ValueAnimator) {
                animationQuads = ArrayList()
                endQuads!!.forEachIndexed { index, quad ->
                    val startAnimationQuad  = startAnimationQuads!!.get(index)
                    val value = animation.animatedFraction
                    if (value > 0 && value < 1) {
                        print("test")
                    }
                    val topLeftCorner = interpolatePoint(startAnimationQuad[0], quad[0],value)
                    animationQuads!!.add(listOf(
                        topLeftCorner,
                        interpolatePoint(startAnimationQuad[1], quad[1],value),
                        interpolatePoint(startAnimationQuad[2], quad[2],value),
                        interpolatePoint(startAnimationQuad[3], quad[3],value)
                    ))
                }
                invalidate()
            }
        })
        mAnimator!!.addListener(object : AnimatorListenerAdapter() {
            override fun onAnimationEnd(animation: Animator) {
                super.onAnimationEnd(animation)
                animationQuads = null
                startAnimationQuads = null
                invalidate()
            }
        })

        mAnimator!!.start()
    }

    /**
     * This gets called constantly, and we use it to update the cropper corners
     *
     * @param canvas the image preview canvas
     */
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val actualQuads = if (animationQuads != null)   animationQuads else  mQuads;
        if (actualQuads !== null) {
            val verticalOffset = ((canvas.height - imageHeight*scale) / 2).toFloat()
            val horizontalOffset = ((canvas.width - imageWidth*scale) / 2).toFloat()

            canvas.translate(horizontalOffset, verticalOffset)
            canvas.scale(scale, scale, (canvas.width/2).toFloat(), (canvas.height/2).toFloat())
            actualQuads!!.forEachIndexed { index, quad ->
                linePaint.color = colors[index.mod(colors.size)]

                if (fillPaint != null) {
                    val alpha = fillPaint!!.alpha
                    fillPaint!!.color = linePaint.color
                    fillPaint!!.alpha = alpha
                    // draw fill quad
                    canvas.drawQuadSimple(
                        quad!!,
                        fillPaint!!
                    )
                }
                // draw 4 corners and connecting lines
                canvas.drawQuadSimple(
                    quad!!,
                    linePaint
                )

            }
        }

    }
}
