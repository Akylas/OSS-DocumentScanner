package com.akylas.documentscanner;

import androidx.appcompat.app.AppCompatActivity;
import androidx.preference.PreferenceFragmentCompat;
import androidx.preference.PreferenceManager;
import androidx.appcompat.app.AppCompatDelegate;
import android.os.Bundle;
import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.app.Application;
import android.os.Build;
import androidx.multidex.MultiDex;
import com.tns.RuntimeHelper;
import com.tns.ManualInstrumentation;
import android.util.Log;

public class NightModeApplication extends android.app.Application {

    private static NightModeApplication thiz;
    private static final String TAG = "NightModeApplication";

    public NightModeApplication() {
        thiz = this;
    }
    public static NightModeApplication getInstance() {
        return thiz;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        ManualInstrumentation.Frame frame = ManualInstrumentation.start("NativeScriptApplication.onCreate");
        try {
            super.onCreate();
            com.tns.Runtime runtime = RuntimeHelper.initRuntime(this);
            if (runtime != null) {
                runtime.run();
            }
        } finally {
            frame.close();
        }
        // final String mode = getSharedPreferences("prefs.db", 0).getString("theme", "dark");
        // switch (mode) {
        //     case "auto":
        //         AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM);
        //         break;
        //     case "light":
        //         AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        //         break;
        //     case "black":
        //     case "dark":
        //         AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        //         break;
        // }

    }

    public Context setupTheme(Context context) {

        Resources res = context.getResources();
        int mode = res.getConfiguration().uiMode;
        final String themeMode = context.getSharedPreferences("prefs.db", 0).getString("theme", "dark");
        switch (themeMode) {
            case "black":
            case "dark":
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
                mode = Configuration.UI_MODE_NIGHT_YES;
                break;
            case "light":
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
                mode = Configuration.UI_MODE_NIGHT_NO;
                break;
            default:
                AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_AUTO);
                break;
        }
    
        Configuration config = new Configuration(res.getConfiguration());
        config.uiMode = mode;
        if (Build.VERSION.SDK_INT >= 17) {
            context = context.createConfigurationContext(config);
        } else {
            res.updateConfiguration(config, res.getDisplayMetrics());
        }
        return context;
    }

    @Override
    protected void attachBaseContext(Context base) {
        Context context = setupTheme(base);
        super.attachBaseContext(context);
        if (Build.VERSION.SDK_INT < 21) {
            // As the new gradle plugin automatically uses multidex if necessary we need to call this for older android API versions
            MultiDex.install(this);
        }
    }
}