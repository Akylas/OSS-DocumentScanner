package com.akylas.documentscanner;

import android.content.Context;
import android.util.AttributeSet;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.view.animation.ScaleAnimation;
import android.widget.ScrollView;
import org.deejdev.twowaynestedscrollview.TwoWayNestedScrollView;

public class DualScrollView extends TwoWayNestedScrollView {


    // step 1: add some instance
    private float mScale = 1f;
    private ScaleGestureDetector mScaleDetector;
    GestureDetector gestureDetector;


    public DualScrollView(Context context) {
        super(context);
        init();
    }

    public DualScrollView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {

        //step 2: create instance from GestureDetector(this step should be place into onCreate())
        gestureDetector = new GestureDetector(getContext(), new GestureListener());

        mScaleDetector = new ScaleGestureDetector(getContext(), new ScaleGestureDetector.SimpleOnScaleGestureListener()
        {
            @Override
            public boolean onScale(ScaleGestureDetector detector)
            {
                float scale = 1 - detector.getScaleFactor();

                float prevScale = mScale;
                mScale += scale;

                if (mScale < 0.1f) // Minimum scale condition:
                    mScale = 0.1f;

                if (mScale > 10f) // Maximum scale condition:
                    mScale = 10f;
                ScaleAnimation scaleAnimation = new ScaleAnimation(1f / prevScale, 1f / mScale, 1f / prevScale, 1f / mScale, detector.getFocusX(), detector.getFocusY());
                scaleAnimation.setDuration(0);
                scaleAnimation.setFillAfter(true);
                getChildAt(0).startAnimation(scaleAnimation);
                return true;
            }
        });
    }

    // step 3: override dispatchTouchEvent()
    @Override
    public boolean dispatchTouchEvent(MotionEvent event) {
        super.dispatchTouchEvent(event);
        mScaleDetector.onTouchEvent(event);
        gestureDetector.onTouchEvent(event);
        return gestureDetector.onTouchEvent(event);
    }

//step 4: add private class GestureListener

    private class GestureListener extends GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onDown(MotionEvent e) {
            return true;
        }
        // event when double tap occurs
        @Override
        public boolean onDoubleTap(MotionEvent e) {
            // double tap fired.
            return true;
        }
    }
}