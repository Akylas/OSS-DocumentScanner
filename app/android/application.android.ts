// import { Utils } from '@nativescript/core';
// const CHANNEL_ID = 'channelId';

@NativeClass
@JavaProxy('__PACKAGE__.MainApplication')
export class MainApplication extends android.app.Application {
    public onCreate(): void {
        super.onCreate();
        // com.google.android.material.color.DynamicColors.applyToActivitiesIfAvailable(this);
    }

    // public attachBaseContext(baseContext: android.content.Context) {
    // super.attachBaseContext(baseContext);
    // not sure we need that part yet
    // if (Build.VERSION.SDK_INT < 21) {
    //     // As the new gradle plugin automatically uses multidex if necessary we need to call this for older android API versions
    //     MultiDex.install(this);
    // }
    // }
}
