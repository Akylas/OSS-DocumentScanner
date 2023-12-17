package com.akylas.documentscanner;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.TypedArray;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.color.DynamicColors;

public class Utils {
    public static int getColorFromName(Context context, String name) {
        int resID = context.getResources().getIdentifier(name, "attr", context.getPackageName());
        TypedArray array = context.getTheme().obtainStyledAttributes(new int[]{resID}); 
        return  array.getColor(0, 0xFF00FF);
    }
    public static int getColorFromInt(Context context, int resId) {
        TypedArray array = context.getTheme().obtainStyledAttributes(new int[]{resId}); 
        return  array.getColor(0, 0xFF00FF);
    }
    public static float getDimensionFromInt(Context context, int resId) {
        TypedArray array = context.getTheme().obtainStyledAttributes(new int[]{resId}); 
        return  array.getDimension(0,0);
    }
    public static void applyDayNight(AppCompatActivity activity) {

        // we need to applyDayNight to update theme thus colors as we dont restart activity (configChanges:uiMode)
        // but then dynamic colors are lost so let s call DynamicColors.applyIfAvailable
        activity.getDelegate().applyDayNight();
        DynamicColors.applyIfAvailable(activity);
    }

    public static void restartApp(Context ctx, AppCompatActivity activity) {
        PackageManager pm = ctx.getPackageManager();
        Intent intent = pm.getLaunchIntentForPackage(ctx.getPackageName());
        Intent mainIntent = Intent.makeRestartActivityTask(intent.getComponent());
        ctx.startActivity(mainIntent);
        Runtime.getRuntime().exit(0);
    }

}