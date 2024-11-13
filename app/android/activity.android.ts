import { AndroidActivityCallbacks, Application, setActivityCallbacks } from '@nativescript/core';

const TAG = '[MainActivity]';
@NativeClass()
@JavaProxy('__PACKAGE__.MainActivity')
export class MainActivity extends androidx.appcompat.app.AppCompatActivity {
    public isNativeScriptActivity;

    private _callbacks: AndroidActivityCallbacks;

    public onCreate(savedInstanceState: android.os.Bundle): void {
        Application.android.init(this.getApplication());
        // Set the isNativeScriptActivity in onCreate (as done in the original NativeScript activity code)
        // The JS constructor might not be called because the activity is created from Android.
        this.isNativeScriptActivity = true;
        if (!this._callbacks) {
            setActivityCallbacks(this);
        }

        this._callbacks.onCreate(this, savedInstanceState, this.getIntent(), super.onCreate);

        // androidx.core.view.WindowCompat.setDecorFitsSystemWindows(this.getWindow(), false);

        // DynamicColors
        // com.google.android.material.color.DynamicColors.applyIfAvailable(this);
        try {
            // AppUtilsAndroid.prepareActivity(this);
        } catch (error) {
            console.error(error, error.stack);
        }
    }

    public onNewIntent(intent: android.content.Intent): void {
        DEV_LOG && console.log(TAG, 'onNewIntent', intent.getAction());
        this._callbacks.onNewIntent(this, intent, super.setIntent, super.onNewIntent);
    }

    public onSaveInstanceState(outState: android.os.Bundle): void {
        this._callbacks.onSaveInstanceState(this, outState, super.onSaveInstanceState);
    }

    public onStart(): void {
        DEV_LOG && console.log(TAG, 'onStart');
        this._callbacks.onStart(this, super.onStart);
        // com.google.android.material.color.DynamicColors.applyIfAvailable(this);
    }

    public onStop(): void {
        DEV_LOG && console.log(TAG, 'onStop');
        this._callbacks.onStop(this, super.onStop);
    }

    public onDestroy(): void {
        DEV_LOG && console.log(TAG, 'onDestroy');
        this._callbacks.onDestroy(this, super.onDestroy);
    }

    public onPostResume(): void {
        DEV_LOG && console.log(TAG, 'onPostResume', this.getIntent().getAction());
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
