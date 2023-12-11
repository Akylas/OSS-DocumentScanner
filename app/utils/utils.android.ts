import { Application, Utils } from '@nativescript/core';

export * from './utils.common';

export function restartApp() {
    const context = Utils.android.getApplicationContext();
    const mStartActivity = new android.content.Intent(context, Application.android.startActivity.getClass());
    const mPendingIntentId = 123456;
    const mPendingIntent = android.app.PendingIntent.getActivity(context, mPendingIntentId, mStartActivity, android.app.PendingIntent.FLAG_CANCEL_CURRENT);
    const mgr = context.getSystemService(android.content.Context.ALARM_SERVICE) as android.app.AlarmManager;
    mgr.set(android.app.AlarmManager.RTC, java.lang.System.currentTimeMillis() + 500, mPendingIntent);
    java.lang.System.exit(0);
}
