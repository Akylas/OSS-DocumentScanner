package com.akylas.documentscanner

import android.content.Context
import android.content.Intent
import android.content.res.Resources
import android.view.Window
import androidx.appcompat.app.AppCompatActivity
import androidx.core.os.ConfigurationCompat
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import androidx.core.view.WindowCompat
import com.google.android.material.color.DynamicColors
import java.util.Locale

class Utils {
    companion object {
        fun getColorFromName(context: Context, name: String?): Int {
            val resID = context.resources.getIdentifier(name, "attr", context.packageName)
            val array = context.theme.obtainStyledAttributes(intArrayOf(resID))
            return array.getColor(0, 0xFF00FF)
        }

        fun getColorFromInt(context: Context, resId: Int): Int {
            val array = context.theme.obtainStyledAttributes(intArrayOf(resId))
            return array.getColor(0, 0xFF00FF)
        }

        fun getDimensionFromInt(context: Context, resId: Int): Float {
            val array = context.theme.obtainStyledAttributes(intArrayOf(resId))
            return array.getDimension(0, 0f)
        }

        fun applyDayNight(activity: AppCompatActivity, applyDynamicColors: Boolean) {

            // we need to applyDayNight to update theme thus colors as we dont restart activity (configChanges:uiMode)
            // but then dynamic colors are lost so let s call DynamicColors.applyIfAvailable
            activity.getDelegate().applyDayNight()
            if (applyDynamicColors) {
                DynamicColors.applyIfAvailable(activity)
            }
        }

        fun applyDynamicColors(activity: AppCompatActivity?) {
            DynamicColors.applyIfAvailable(activity!!)
        }

        fun restartApp(ctx: Context, activity: AppCompatActivity?) {
            val pm = ctx.packageManager
            val intent = pm.getLaunchIntentForPackage(ctx.packageName)
            val mainIntent = Intent.makeRestartActivityTask(intent!!.component)
            ctx.startActivity(mainIntent)
            Runtime.getRuntime().exit(0)
        }

        val systemLocale: Locale?
            get() = ConfigurationCompat.getLocales(Resources.getSystem().configuration)[0]

        fun prepareActivity(activity: AppCompatActivity) {
            DynamicColors.applyToActivityIfAvailable(activity)
            activity.installSplashScreen()
            prepareWindow(activity.window)
        }

        fun prepareWindow(window: Window?) {
            WindowCompat.setDecorFitsSystemWindows(window!!, false)
        }
    }
}