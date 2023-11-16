import { AndroidActivityCallbacks, Application, Frame, Utils, setActivityCallbacks } from '@nativescript/core';

function getThemeColor(context, colorResId) {
    const ta = context.obtainStyledAttributes([Utils.android.resources.getId(':attr/' + colorResId)]);
    const color = ta.getColor(0, 0);
    ta.recycle();
    return color;
}
@NativeClass()
@JavaProxy('__PACKAGE__.MainActivity')
class MainActivity extends androidx.appcompat.app.AppCompatActivity {
    public isNativeScriptActivity;

    private _callbacks: AndroidActivityCallbacks;

    public onCreate(savedInstanceState: android.os.Bundle): void {
        // Handle the splash screen transition.
        //@ts-ignore
        androidx.core.splashscreen.SplashScreen.installSplashScreen(this);
        Application.android.init(this.getApplication());
        // Set the isNativeScriptActivity in onCreate (as done in the original NativeScript activity code)
        // The JS constructor might not be called because the activity is created from Android.
        this.isNativeScriptActivity = true;
        if (!this._callbacks) {
            setActivityCallbacks(this);
        }

        this._callbacks.onCreate(this, savedInstanceState, this.getIntent(), super.onCreate);

        // DynamicColors
        com.google.android.material.color.DynamicColors.applyIfAvailable(this);
        this.getWindow().setStatusBarColor(getThemeColor(this, 'colorPrimaryDark'));
    }

    public onNewIntent(intent: android.content.Intent): void {
        this._callbacks.onNewIntent(this, intent, super.setIntent, super.onNewIntent);
    }

    public onSaveInstanceState(outState: android.os.Bundle): void {
        this._callbacks.onSaveInstanceState(this, outState, super.onSaveInstanceState);
    }

    public onStart(): void {
        this._callbacks.onStart(this, super.onStart);
        com.google.android.material.color.DynamicColors.applyIfAvailable(this);
        Application.notify({ eventName: 'activity_started' });
    }

    public onStop(): void {
        this._callbacks.onStop(this, super.onStop);
    }

    public onDestroy(): void {
        this._callbacks.onDestroy(this, super.onDestroy);
    }

    public onPostResume(): void {
        this._callbacks.onPostResume(this, super.onPostResume);
    }

    public onBackPressed(): void {
        this._callbacks.onBackPressed(this, super.onBackPressed);
    }

    public onRequestPermissionsResult(requestCode: number, permissions: string[], grantResults: number[]): void {
        this._callbacks.onRequestPermissionsResult(this, requestCode, permissions, grantResults, undefined /*TODO: Enable if needed*/);
    }

    public onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent): void {
        this._callbacks.onActivityResult(this, requestCode, resultCode, data, super.onActivityResult);
    }
}
