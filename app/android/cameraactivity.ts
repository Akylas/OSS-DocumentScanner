import { AndroidActivityBackPressedEventData, AndroidActivityRequestPermissionsEventData, AndroidActivityResultEventData, Application, Frame, GridLayout, Trace, View } from '@nativescript/core';
import { CSSUtils } from '@nativescript/core/css/system-classes';

const ROOT_VIEW_ID_EXTRA = 'com.tns.activity.rootViewId';
const activityRootViewsMap = new Map<number, WeakRef<View>>();
const INTENT_EXTRA = 'com.tns.activity';

declare module '@nativescript/core/ui/frame' {
    interface Frame {
        _getFragmentManager();
    }
}
export let moduleLoaded: boolean;

@NativeClass()
@JavaProxy('__PACKAGE__.CameraActivity')
export class CameraActivity extends androidx.appcompat.app.AppCompatActivity {
    isNativeScriptActivity: boolean;
    // private _callbacks: AndroidActivityCallbacks;
    constructor() {
        super();

        return global.__native(this);
    }

    private _rootView: View;

    public getRootView(): View {
        return this._rootView;
    }

    finish() {
        super.finish();
        this.overridePendingTransition(0, 0);
    }
    public onCreate(savedInstanceState: android.os.Bundle): void {
        // we still ensure the app is good.
        // wont do anything is already done
        Application.android.init(this.getApplication());

        // Set isNativeScriptActivity in onCreate.
        this.isNativeScriptActivity = false;

        const intent = this.getIntent();

        // If there is savedInstanceState this call will recreate all fragments that were previously in the navigation.
        // We take care of associating them with a Page from our backstack in the onAttachFragment callback.
        // If there is savedInstanceState and moduleLoaded is false we are restarted but process was killed.
        // For now we treat it like first run (e.g. we are not passing savedInstanceState so no fragments are being restored).
        // When we add support for Application save/load state - revise this logic.
        const isRestart = !!savedInstanceState && moduleLoaded;
        super.onCreate(isRestart ? savedInstanceState : null);

        // Try to get the rootViewId form the saved state in case the activity
        // was destroyed and we are now recreating it.
        if (savedInstanceState) {
            const rootViewId = savedInstanceState.getInt(ROOT_VIEW_ID_EXTRA, -1);
            if (rootViewId !== -1 && activityRootViewsMap.has(rootViewId)) {
                this._rootView = activityRootViewsMap.get(rootViewId).get();
            }
        }

        // if (intent && intent.getAction()) {
        //     Application.android.notify({
        //         eventName: AndroidApplication.activityNewIntentEvent,
        //         object: Application.android,
        //         activity,
        //         intent
        //     } as AndroidActivityNewIntentEventData);
        // }

        this.setActivityContent(this, savedInstanceState, true, intent);
        moduleLoaded = true;

        // DynamicColors
        com.google.android.material.color.DynamicColors.applyIfAvailable(this);
    }

    public onNewIntent(intent: android.content.Intent): void {
        super.setIntent(intent);
        super.onNewIntent(intent);
    }

    public onSaveInstanceState(outState: android.os.Bundle): void {
        super.onSaveInstanceState(outState);
        const rootView = this._rootView;
        if (rootView instanceof Frame) {
            outState.putInt(INTENT_EXTRA, rootView.android['frameId']);
            rootView._saveFragmentsState();
        }

        outState.putInt(ROOT_VIEW_ID_EXTRA, rootView._domId);
    }

    public onStart(): void {
        super.onStart();
        if (Trace.isEnabled()) {
            Trace.write('NativeScriptActivity.onStart();', Trace.categories.NativeLifecycle);
        }

        const rootView = this._rootView;
        if (rootView && !rootView.isLoaded) {
            rootView.callLoaded();
        }
        this.overridePendingTransition(0, 0);
    }

    public onStop(): void {
        super.onStop();
        if (Trace.isEnabled()) {
            Trace.write('NativeScriptActivity.onStop();', Trace.categories.NativeLifecycle);
        }

        const rootView = this._rootView;
        if (rootView && rootView.isLoaded) {
            rootView.callUnloaded();
        }
    }

    public onDestroy(): void {
        try {
            if (Trace.isEnabled()) {
                Trace.write('NativeScriptActivity.onDestroy();', Trace.categories.NativeLifecycle);
            }

            const rootView = this._rootView;
            if (rootView) {
                rootView._tearDownUI(true);
            }

            // const exitArgs = { eventName: Application.exitEvent, object: Application.android, android: activity };
            // Application.notify(exitArgs);
        } finally {
            super.onDestroy();
        }
    }

    public onPostResume(): void {
        super.onPostResume();
        if (Trace.isEnabled()) {
            Trace.write('NativeScriptActivity.onPostResume();', Trace.categories.NativeLifecycle);
        }
    }

    public onBackPressed(): void {
        if (Trace.isEnabled()) {
            Trace.write('NativeScriptActivity.onBackPressed;', Trace.categories.NativeLifecycle);
        }

        const args = {
            eventName: 'activityBackPressed',
            object: Application.android,
            activity: this,
            cancel: false
        } as AndroidActivityBackPressedEventData;
        Application.android.notify(args);
        if (args.cancel) {
            return;
        }

        const view = this._rootView;
        let callSuper = false;
        if (view instanceof Frame) {
            callSuper = !view.goBack();
        } else {
            const viewArgs = {
                eventName: 'activityBackPressed',
                object: view,
                activity: this,
                cancel: false
            } as AndroidActivityBackPressedEventData;
            view.notify(viewArgs);

            if (!viewArgs.cancel && !view.onBackPressed()) {
                callSuper = true;
            }
        }

        if (callSuper) {
            super.onBackPressed();
        }
    }

    public onRequestPermissionsResult(requestCode: number, permissions: string[], grantResults: number[]): void {
        if (Trace.isEnabled()) {
            Trace.write('NativeScriptActivity.onRequestPermissionsResult;', Trace.categories.NativeLifecycle);
        }

        Application.android.notify({
            eventName: 'activityRequestPermissions',
            object: Application.android,
            activity: this,
            requestCode,
            permissions,
            grantResults
        } as AndroidActivityRequestPermissionsEventData);
    }

    public onActivityResult(requestCode: number, resultCode: number, data: android.content.Intent): void {
        super.onActivityResult(requestCode, resultCode, data);
        if (Trace.isEnabled()) {
            Trace.write(`NativeScriptActivity.onActivityResult(${requestCode}, ${resultCode}, ${data})`, Trace.categories.NativeLifecycle);
        }

        Application.android.notify({
            eventName: 'activityResult',
            object: Application.android,
            activity: this,
            requestCode,
            resultCode,
            intent: data
        } as AndroidActivityResultEventData);
    }

    public resetActivityContent(activity: androidx.appcompat.app.AppCompatActivity): void {
        if (this._rootView) {
            const manager = this._rootView._getFragmentManager();
            manager.executePendingTransactions();

            this._rootView._onRootViewReset();
        }
        // Delete previously cached root view in order to recreate it.
        this._rootView = null;
        this.setActivityContent(activity, null, false, null);
        this._rootView.callLoaded();
    }
    // Paths that go trough this method:
    // 1. Application initial start - there is no rootView in callbacks.
    // 2. Application revived after Activity is destroyed. this._rootView should have been restored by id in onCreate.
    // 3. Livesync if rootView has no custom _onLivesync. this._rootView should have been cleared upfront. Launch event should not fired
    // 4. _resetRootView method. this._rootView should have been cleared upfront. Launch event should not fired
    private async setActivityContent(activity: androidx.appcompat.app.AppCompatActivity, savedInstanceState: android.os.Bundle, fireLaunchEvent: boolean, intent: android.content.Intent) {
        let rootView = this._rootView;
        DEV_LOG && console.log('setActivityContent');
        if (!rootView) {
            rootView = new GridLayout();
            this._rootView = rootView;

            activityRootViewsMap.set(rootView._domId, new WeakRef(rootView));
            const rootViewCssClasses = CSSUtils.getSystemCssClasses();
            rootViewCssClasses.forEach((c) => this._rootView.cssClasses.add(c));
        }

        // setup view as styleScopeHost
        rootView._setupAsRootView(activity);

        activity.setContentView(rootView.nativeViewProtected, new org.nativescript.widgets.CommonLayoutParams());

        try {
            // const intent = activity.getIntent();
            // let outputUri;
            // if (intent.getExtras()?.containsKey('output')) {
            //     outputUri = intent.getExtras().get('output').toString();
            // }
            // //ensure theme is started
            // startThemeHelper();
            // const componentInstanceInfo = resolveComponentElement(Camera, { outputUri });
            // const view: View = componentInstanceInfo.element.nativeView;
            // (rootView as GridLayout).addChild(view);
        } catch (err) {
            console.error('error retreiving data', err, err.stack);
        } finally {
            activity.finish();
        }
    }
}
