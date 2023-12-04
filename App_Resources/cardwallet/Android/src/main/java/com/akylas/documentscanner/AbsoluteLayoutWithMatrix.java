package com.akylas.documentscanner;

import android.content.Context;
import android.view.View;
import android.view.animation.Transformation;
import android.graphics.Matrix;


public class AbsoluteLayoutWithMatrix extends org.nativescript.widgets.AbsoluteLayout {

    public AbsoluteLayoutWithMatrix(Context context) {
        super(context);
    }
    private Matrix childrenMatrix;
    @Override
    protected boolean getChildStaticTransformation(View child, Transformation t) {

        // apply transform to child view - child triggers this call by call to `invalidate()`
        t.getMatrix().set(childrenMatrix);
        return true;
    }

    void setChildrenMatrix(Matrix matrix) {
        childrenMatrix = matrix;
        invalidate();
    }
}