package com.akylas.documentscanner;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.TypedArray;
import android.view.Window;
import androidx.appcompat.app.AppCompatActivity;
import com.google.android.material.color.DynamicColors;
import java.util.Locale;

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
    public static void applyDayNight(AppCompatActivity activity, boolean applyDynamicColors) {

        // we need to applyDayNight to update theme thus colors as we dont restart activity (configChanges:uiMode)
        // but then dynamic colors are lost so let s call DynamicColors.applyIfAvailable
        activity.getDelegate().applyDayNight();
        if (applyDynamicColors) {
            DynamicColors.applyIfAvailable(activity);
        }
    }
    public static void applyDynamicColors(AppCompatActivity activity) {
        DynamicColors.applyIfAvailable(activity);
    }

    public static void restartApp(Context ctx, AppCompatActivity activity) {
        PackageManager pm = ctx.getPackageManager();
        Intent intent = pm.getLaunchIntentForPackage(ctx.getPackageName());
        Intent mainIntent = Intent.makeRestartActivityTask(intent.getComponent());
        ctx.startActivity(mainIntent);
        Runtime.getRuntime().exit(0);
    }

    public static Locale getSystemLocale() {
        return androidx.core.os.ConfigurationCompat.getLocales(android.content.res.Resources.getSystem().getConfiguration()).get(0);
    }
    public static void prepareActivity(AppCompatActivity activity) {
        com.google.android.material.color.DynamicColors.applyIfAvailable(activity);
        androidx.core.splashscreen.SplashScreen.installSplashScreen(activity);
        prepareWindow(activity.getWindow());
    }
    public static void prepareWindow(Window window) {
        androidx.core.view.WindowCompat.setDecorFitsSystemWindows(window, false);
    }
}