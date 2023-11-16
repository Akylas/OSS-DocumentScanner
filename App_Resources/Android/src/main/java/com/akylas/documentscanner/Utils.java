package com.akylas.documentscanner;

import android.content.Context;
import android.content.res.TypedArray;

public class Utils {
    static int getColorFromName(Context context, String name) {
        int resID = context.getResources().getIdentifier(name, "attr", context.getPackageName());
        TypedArray array = context.getTheme().obtainStyledAttributes(new int[]{resID}); 
        return  array.getColor(0, 0xFF00FF);
    }
    static int getColorFromInt(Context context, int resId) {
        TypedArray array = context.getTheme().obtainStyledAttributes(new int[]{resId}); 
        return  array.getColor(0, 0xFF00FF);
    }
    static float getDimensionFromInt(Context context, int resId) {
        TypedArray array = context.getTheme().obtainStyledAttributes(new int[]{resId}); 
        return  array.getDimension(0,0);
    }
}