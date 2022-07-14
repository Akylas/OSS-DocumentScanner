package com.nativescript.popover;

import android.annotation.TargetApi;
import android.content.Context;
import android.graphics.Rect;
import android.os.Build;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.PopupWindow;

import androidx.annotation.IntDef;
import androidx.annotation.NonNull;
import androidx.core.widget.PopupWindowCompat;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * @author kakajika
 * @since 2016/07/01
 * @contributor akylas
 * @since 2022/03/30
 */
public class RelativePopupWindow extends PopupWindow {

    @IntDef({
            VerticalPosition.CENTER,
            VerticalPosition.ABOVE,
            VerticalPosition.BELOW,
            VerticalPosition.ALIGN_TOP,
            VerticalPosition.ALIGN_BOTTOM,
    })
    @Retention(RetentionPolicy.SOURCE)
    public @interface VerticalPosition {
        int CENTER = 0;
        int ABOVE = 1;
        int BELOW = 2;
        int ALIGN_TOP = 3;
        int ALIGN_BOTTOM = 4;
    }

    @IntDef({
            HorizontalPosition.CENTER,
            HorizontalPosition.LEFT,
            HorizontalPosition.RIGHT,
            HorizontalPosition.ALIGN_LEFT,
            HorizontalPosition.ALIGN_RIGHT,
    })
    @Retention(RetentionPolicy.SOURCE)
    public @interface HorizontalPosition {
        int CENTER = 0;
        int LEFT = 1;
        int RIGHT = 2;
        int ALIGN_LEFT = 3;
        int ALIGN_RIGHT = 4;
    }

    public RelativePopupWindow(Context context) {
        super(context);
    }
    public RelativePopupWindow(View contentView, int width, int height, boolean focusable) {
        super(contentView, width, height, focusable);
    }

    /**
     * Show at relative position to anchor View with translation.
     * @param anchor Anchor View
     * @param vertPos Vertical Position Flag
     * @param horizPos Horizontal Position Flag
     * @param x Translation X
     * @param y Translation Y
     * @param fitInScreen Automatically fit in screen or not
     */
    public void showOnAnchor(
            @NonNull View anchor,
            @VerticalPosition int vertPos,
            @HorizontalPosition int horizPos,
            int x,
            int y,
            boolean fitInScreen
    ) {
        setClippingEnabled(fitInScreen);
        final View contentView = getContentView();
        final Rect windowRect = new Rect();
        contentView.getWindowVisibleDisplayFrame(windowRect);
        final int windowW = windowRect.width();
        final int windowH = windowRect.height();
        contentView.measure(
                makeDropDownMeasureSpec(getWidth(), windowW),
                makeDropDownMeasureSpec(getHeight(), windowH)
        );
        final int measuredW = contentView.getMeasuredWidth();
        final int measuredH = contentView.getMeasuredHeight();
        setHeight(measuredH);
        final int[] anchorLocation = new int[2];
        anchor.getLocationInWindow(anchorLocation);
        final int anchorBottom = anchorLocation[1] + anchor.getHeight();
        if (!fitInScreen) {
            x += anchorLocation[0];
            y += anchorBottom;
        }
        switch (vertPos) {
            case VerticalPosition.ABOVE:
                y -= measuredH + anchor.getHeight();
                break;
            case VerticalPosition.ALIGN_BOTTOM:
                y -= measuredH;
                break;
            case VerticalPosition.CENTER:
                y -= anchor.getHeight()/2 + measuredH/2;
                break;
            case VerticalPosition.ALIGN_TOP:
                y -= anchor.getHeight();
                break;
            case VerticalPosition.BELOW:
                // Default position.
                break;
        }
        switch (horizPos) {
            case HorizontalPosition.LEFT:
                x -= measuredW;
                break;
            case HorizontalPosition.ALIGN_RIGHT:
                x -= measuredW - anchor.getWidth();
                break;
            case HorizontalPosition.CENTER:
                x += anchor.getWidth()/2 - measuredW/2;
                break;
            case HorizontalPosition.ALIGN_LEFT:
                // Default position.
                break;
            case HorizontalPosition.RIGHT:
                x += anchor.getWidth();
                break;
        }
        if (fitInScreen) {
            if (y + anchorBottom < 0) {
                y = -anchorBottom;
            } else if (y + anchorBottom + measuredH > windowH) {
                y = windowH - anchorBottom - measuredH;
            }
            PopupWindowCompat.showAsDropDown(this, anchor, x, y, Gravity.NO_GRAVITY);
        } else {
            showAtLocation(anchor, Gravity.NO_GRAVITY, x, y);
        }
    }

    private static int makeDropDownMeasureSpec(int measureSpec, int maxSize) {
        return View.MeasureSpec.makeMeasureSpec(
                getDropDownMeasureSpecSize(measureSpec, maxSize),
                getDropDownMeasureSpecMode(measureSpec)
        );
    }

    private static int getDropDownMeasureSpecSize(int measureSpec, int maxSize) {
        switch (measureSpec) {
            case ViewGroup.LayoutParams.MATCH_PARENT:
                return maxSize;
            default:
                return View.MeasureSpec.getSize(measureSpec);
        }
    }

    private static int getDropDownMeasureSpecMode(int measureSpec) {
        switch (measureSpec) {
            case ViewGroup.LayoutParams.WRAP_CONTENT:
                return View.MeasureSpec.UNSPECIFIED;
            default:
                return View.MeasureSpec.EXACTLY;
        }
    }
}
