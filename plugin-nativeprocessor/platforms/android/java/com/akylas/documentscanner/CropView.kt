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
import androidx.camera.view.PreviewView
import com.nativescript.cameraview.CameraFlashMode

class CropView
@JvmOverloads
constructor(context: Context, attrs: AttributeSet? = null, defStyleAttr: Int = 0) : View(context, attrs, defStyleAttr) {
    private var autoScanProgress: MaxSizeHashMap<Long, Int> = MaxSizeHashMap(10)

    var imageWidth: Int = 0
    var imageHeight: Int = 0

    var scaleType: PreviewView.ScaleType = PreviewView.ScaleType.FIT_CENTER
        get() {
            return field
        }
        set(value) {
            field = value
        }

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

    private var mQuads: List<List<Point>>? = null
    var scale: Float = 1.0f
    var quads: List<List<Point>>?
        get() {return this.mQuads}
        set(value) {
            (context as Activity).runOnUiThread {
                setQuadsAnimated(value)
            }
        }
    private var animationQuads: ArrayList<List<Point>>? = null
    private var startAnimationQuads: List<List<Point>>? = null
    private var mAnimator: ValueAnimator? = null

    var linePaint = Paint(Paint.ANTI_ALIAS_FLAG)
    var fillPaint: Paint? = null
    var progressFillPaint = Paint(Paint.ANTI_ALIAS_FLAG)
    var colors = listOf(0xFF007AFF.toInt())
    var strokeWidth = 2
    var animationDuration = 200L
    var drawFill = true

    init {
        // set cropper style
        progressFillPaint.style = Paint.Style.FILL
        progressFillPaint.alpha = 100
        linePaint.style = Paint.Style.STROKE
        linePaint.strokeWidth = resources.displayMetrics.density * strokeWidth
        linePaint.strokeJoin = Paint.Join.ROUND
        linePaint.strokeCap = Paint.Cap.ROUND
        setWillNotDraw(false)
    }
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
//    /**
//     * Initially the image preview height is 0. This calculates the height by using the photo
//     * dimensions. It maintains the photo aspect ratio (we likely need to scale the photo down
//     * to fit the preview container).
//     *
//     * @param photo the original photo with a rectangular document
//     * @param screenWidth the device width
//     */
//    fun setImagePreviewBounds(photoWidth: Int, photoHeight: Int, screenWidth: Int, screenHeight: Int) {
//        // image width to height aspect ratio
//        val imageRatio = photoWidth.toFloat() / photoHeight.toFloat()
//
//        imagePreviewHeight = if (photoHeight > photoWidth) {
//            // if user takes the photo in portrait
//            (screenWidth.toFloat() / imageRatio).toInt()
//        } else {
//            // if user takes the photo in landscape
//            // if user takes the photo in landscape
//            (screenWidth.toFloat() * imageRatio).toInt()
//        }
//        imagePreviewWidth = screenWidth
//    }

    fun interpolatePoint(point1: Point, point2: Point, value: Float): Point {
        return Point(
            (point1.x + (value)*(point2.x - point1.x)).toInt(),
            (point1.y + (value)*(point2.y - point1.y)).toInt()
        )
    }

    @UiThread
    fun setQuadsAnimated(quads: List<List<Point>>?) {
        if (mAnimator != null) {
            mAnimator!!.removeAllListeners()
            mAnimator!!.cancel()
        }
        if (quads == null || this.mQuads == null || this.mQuads!!.isEmpty() || this.mQuads!!.size != quads.size) {
            this.mQuads = quads
            this.animationQuads = null
            this.startAnimationQuads = null
            invalidate()
            return
        }
        startAnimationQuads = if (animationQuads != null)   animationQuads else  this.mQuads
        animationQuads = null
        this.mQuads = quads
        mAnimator = ValueAnimator.ofFloat(0.0f, 100.0f)
        mAnimator!!.setDuration(animationDuration)
        val endQuads = this.mQuads
        mAnimator!!.addUpdateListener { animation ->
            animationQuads = ArrayList()
            endQuads!!.forEachIndexed { index, quad ->
                val startAnimationQuad = startAnimationQuads!![index]
                val value = animation.animatedFraction
                val topLeftCorner = interpolatePoint(startAnimationQuad[0], quad[0], value)
                animationQuads!!.add(
                    listOf(
                        topLeftCorner,
                        interpolatePoint(startAnimationQuad[1], quad[1], value),
                        interpolatePoint(startAnimationQuad[2], quad[2], value),
                        interpolatePoint(startAnimationQuad[3], quad[3], value)
                    )
                )
            }
            invalidate()
        }
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
        val actualQuads = if (animationQuads != null)   animationQuads else  mQuads
        if (actualQuads !== null) {
            val verticalOffset = ((height - imageHeight*scale) / 2)
            val horizontalOffset = ((width - imageWidth*scale) / 2)

            canvas.translate(horizontalOffset, verticalOffset)
            canvas.scale(scale, scale)
            actualQuads.forEachIndexed { index, quad ->
                val hash = if (mQuads != null && mQuads!!.size > index) AutoScanHandler.getHash(
                    mQuads!![index]
                ) else null
                val progress = if (hash != null) autoScanProgress[hash] else null

                linePaint.color = colors[index.mod(colors.size)]
                if (progress != null) {
                    val alpha = progressFillPaint.alpha
                    progressFillPaint.color = linePaint.color
                    progressFillPaint.alpha = alpha
                    canvas.drawQuadSimpleProgress(
                        quad,
                        progress,
                        progressFillPaint
                    )
                }
                else  {
                    if (drawFill && fillPaint != null){
                        val alpha = fillPaint!!.alpha
                        fillPaint!!.color = linePaint.color
                        fillPaint!!.alpha = alpha
                        // draw fill quad
                        canvas.drawQuadSimple(
                            quad,
                            fillPaint!!
                        )
                    }
                }
                // draw 4 corners and connecting lines
                canvas.drawQuadSimple(
                    quad,
                    linePaint
                )

            }
        }

    }

    fun updateProgress(hash: Long, i: Int) {
        if (i == 0 || i == 100) {
            autoScanProgress.remove(hash)
        } else {
            autoScanProgress[hash] = i
        }
        invalidate()
    }
    fun replaceProgressHash(oldValue: Long, newValue:Long) {
        if (oldValue == null || newValue == null) {
            return;
        }
        if(autoScanProgress.containsKey(oldValue) ) {
            autoScanProgress[newValue] = autoScanProgress[oldValue]!!
            // we don't remove as the MaxSizeHashMap will handle it
            // as AutoScanHandler process and this drawing are async
            // we might need to keep old values to ensure we find the progress
            // which is why we use MaxSizeHashMap
//            autoScanProgress.remove(oldValue)
        }
    }

}
