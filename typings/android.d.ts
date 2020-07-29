declare module com {
	export module otaliastudios {
		export module cameraview {
			export class BitmapCallback extends java.lang.Object {
				public static class: java.lang.Class<com.otaliastudios.cameraview.BitmapCallback>;
				/**
				 * Constructs a new instance of the com.otaliastudios.cameraview.BitmapCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					onBitmapReady(param0: globalAndroid.graphics.Bitmap): void;
				});
				public constructor();
				public onBitmapReady(param0: globalAndroid.graphics.Bitmap): void;
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export class BuildConfig extends java.lang.Object {
				public static class: java.lang.Class<com.otaliastudios.cameraview.BuildConfig>;
				public static DEBUG: boolean;
				public static LIBRARY_PACKAGE_NAME: string;
				public static BUILD_TYPE: string;
				public static VERSION_CODE: number;
				public static VERSION_NAME: string;
				public constructor();
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export class CameraException extends java.lang.RuntimeException {
				public static class: java.lang.Class<com.otaliastudios.cameraview.CameraException>;
				public static REASON_UNKNOWN: number;
				public static REASON_FAILED_TO_CONNECT: number;
				public static REASON_FAILED_TO_START_PREVIEW: number;
				public static REASON_DISCONNECTED: number;
				public static REASON_PICTURE_FAILED: number;
				public static REASON_VIDEO_FAILED: number;
				public static REASON_NO_CAMERA: number;
				public getReason(): number;
				public constructor(param0: number);
				public constructor(param0: string, param1: java.lang.Throwable);
				public constructor(param0: java.lang.Throwable);
				public isUnrecoverable(): boolean;
				public constructor(param0: string);
				public constructor();
				public constructor(param0: string, param1: java.lang.Throwable, param2: boolean, param3: boolean);
				public constructor(param0: java.lang.Throwable, param1: number);
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export abstract class CameraListener extends java.lang.Object {
				public static class: java.lang.Class<com.otaliastudios.cameraview.CameraListener>;
				public onZoomChanged(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>): void;
				public onCameraError(param0: com.otaliastudios.cameraview.CameraException): void;
				public onExposureCorrectionChanged(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>): void;
				public onOrientationChanged(param0: number): void;
				public onVideoTaken(param0: com.otaliastudios.cameraview.VideoResult): void;
				public onVideoRecordingEnd(): void;
				public onCameraClosed(): void;
				public constructor();
				public onPictureTaken(param0: com.otaliastudios.cameraview.PictureResult): void;
				public onCameraOpened(param0: com.otaliastudios.cameraview.CameraOptions): void;
				public onVideoRecordingStart(): void;
				public onAutoFocusEnd(param0: boolean, param1: globalAndroid.graphics.PointF): void;
				public onAutoFocusStart(param0: globalAndroid.graphics.PointF): void;
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export class CameraLogger extends java.lang.Object {
				public static class: java.lang.Class<com.otaliastudios.cameraview.CameraLogger>;
				public static LEVEL_VERBOSE: number;
				public static LEVEL_INFO: number;
				public static LEVEL_WARNING: number;
				public static LEVEL_ERROR: number;
				public static registerLogger(param0: com.otaliastudios.cameraview.CameraLogger.Logger): void;
				public static unregisterLogger(param0: com.otaliastudios.cameraview.CameraLogger.Logger): void;
				public w(param0: native.Array<any>): string;
				public static setLogLevel(param0: number): void;
				public e(param0: native.Array<any>): string;
				public v(param0: native.Array<any>): string;
				public static create(param0: string): com.otaliastudios.cameraview.CameraLogger;
				public i(param0: native.Array<any>): string;
			}
			export module CameraLogger {
				export class LogLevel extends java.lang.Object implements java.lang.annotation.Annotation {
					public static class: java.lang.Class<com.otaliastudios.cameraview.CameraLogger.LogLevel>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.CameraLogger$LogLevel interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						equals(param0: any): boolean;
						hashCode(): number;
						toString(): string;
						annotationType(): java.lang.Class<any>;
					});
					public constructor();
					public equals(param0: any): boolean;
					public toString(): string;
					public annotationType(): java.lang.Class<any>;
					public hashCode(): number;
				}
				export class Logger extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.CameraLogger.Logger>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.CameraLogger$Logger interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						log(param0: number, param1: string, param2: string, param3: java.lang.Throwable): void;
					});
					public constructor();
					public log(param0: number, param1: string, param2: string, param3: java.lang.Throwable): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export abstract class CameraOptions extends java.lang.Object {
				public static class: java.lang.Class<com.otaliastudios.cameraview.CameraOptions>;
				public supportedWhiteBalance: java.util.Set<com.otaliastudios.cameraview.controls.WhiteBalance>;
				public supportedFacing: java.util.Set<com.otaliastudios.cameraview.controls.Facing>;
				public supportedFlash: java.util.Set<com.otaliastudios.cameraview.controls.Flash>;
				public supportedHdr: java.util.Set<com.otaliastudios.cameraview.controls.Hdr>;
				public supportedPictureSizes: java.util.Set<com.otaliastudios.cameraview.size.Size>;
				public supportedVideoSizes: java.util.Set<com.otaliastudios.cameraview.size.Size>;
				public supportedPictureAspectRatio: java.util.Set<com.otaliastudios.cameraview.size.AspectRatio>;
				public supportedVideoAspectRatio: java.util.Set<com.otaliastudios.cameraview.size.AspectRatio>;
				public supportedPictureFormats: java.util.Set<com.otaliastudios.cameraview.controls.PictureFormat>;
				public supportedFrameProcessingFormats: java.util.Set<java.lang.Integer>;
				public zoomSupported: boolean;
				public exposureCorrectionSupported: boolean;
				public exposureCorrectionMinValue: number;
				public exposureCorrectionMaxValue: number;
				public autoFocusSupported: boolean;
				public previewFrameRateMinValue: number;
				public previewFrameRateMaxValue: number;
				public isExposureCorrectionSupported(): boolean;
				public getExposureCorrectionMinValue(): number;
				public getSupportedPictureAspectRatios(): java.util.Collection<com.otaliastudios.cameraview.size.AspectRatio>;
				public getExposureCorrectionMaxValue(): number;
				public getSupportedPictureFormats(): java.util.Collection<com.otaliastudios.cameraview.controls.PictureFormat>;
				public getSupportedPictureSizes(): java.util.Collection<com.otaliastudios.cameraview.size.Size>;
				public supports(param0: com.otaliastudios.cameraview.gesture.GestureAction): boolean;
				public getSupportedHdr(): java.util.Collection<com.otaliastudios.cameraview.controls.Hdr>;
				public supports(param0: com.otaliastudios.cameraview.controls.Control): boolean;
				public getSupportedFrameProcessingFormats(): java.util.Collection<java.lang.Integer>;
				public constructor();
				public getSupportedVideoAspectRatios(): java.util.Collection<com.otaliastudios.cameraview.size.AspectRatio>;
				public getSupportedFacing(): java.util.Collection<com.otaliastudios.cameraview.controls.Facing>;
				public getSupportedVideoSizes(): java.util.Collection<com.otaliastudios.cameraview.size.Size>;
				public getSupportedWhiteBalance(): java.util.Collection<com.otaliastudios.cameraview.controls.WhiteBalance>;
				public isZoomSupported(): boolean;
				public getSupportedControls(param0: java.lang.Class<any>): java.util.Collection<any>;
				public getSupportedFlash(): java.util.Collection<com.otaliastudios.cameraview.controls.Flash>;
				public getPreviewFrameRateMinValue(): number;
				public getPreviewFrameRateMaxValue(): number;
				public isAutoFocusSupported(): boolean;
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export class CameraUtils extends java.lang.Object {
				public static class: java.lang.Class<com.otaliastudios.cameraview.CameraUtils>;
				public static decodeBitmap(param0: native.Array<number>): globalAndroid.graphics.Bitmap;
				public static decodeBitmap(param0: native.Array<number>, param1: number, param2: number): globalAndroid.graphics.Bitmap;
				public static hasCameras(param0: globalAndroid.content.Context): boolean;
				public static writeToFile(param0: native.Array<number>, param1: java.io.File): java.io.File;
				public static writeToFile(param0: native.Array<number>, param1: java.io.File, param2: com.otaliastudios.cameraview.FileCallback): void;
				public static decodeBitmap(param0: native.Array<number>, param1: com.otaliastudios.cameraview.BitmapCallback): void;
				public static decodeBitmap(param0: native.Array<number>, param1: number, param2: number, param3: com.otaliastudios.cameraview.BitmapCallback): void;
				public static hasCameraFacing(param0: globalAndroid.content.Context, param1: com.otaliastudios.cameraview.controls.Facing): boolean;
				public static decodeBitmap(param0: native.Array<number>, param1: number, param2: number, param3: globalAndroid.graphics.BitmapFactory.Options): globalAndroid.graphics.Bitmap;
				public constructor();
				public static decodeBitmap(param0: native.Array<number>, param1: number, param2: number, param3: globalAndroid.graphics.BitmapFactory.Options, param4: com.otaliastudios.cameraview.BitmapCallback): void;
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export class CameraView extends globalAndroid.widget.FrameLayout {
				public static class: java.lang.Class<com.otaliastudios.cameraview.CameraView>;
				public static PERMISSION_REQUEST_CODE: number;
				public takeVideo(param0: java.io.FileDescriptor): void;
				public childDrawableStateChanged(param0: globalAndroid.view.View): void;
				public getFrameProcessingFormat(): number;
				public setRequestPermissions(param0: boolean): void;
				public clearChildFocus(param0: globalAndroid.view.View): void;
				public setFilter(param0: com.otaliastudios.cameraview.filter.Filter): void;
				public setGridColor(param0: number): void;
				public updateViewLayout(param0: globalAndroid.view.View, param1: globalAndroid.view.ViewGroup.LayoutParams): void;
				public setMode(param0: com.otaliastudios.cameraview.controls.Mode): void;
				public setFrameProcessingMaxHeight(param0: number): void;
				public getFrameProcessingMaxHeight(): number;
				public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number, param3: number);
				public getPreviewFrameRateExact(): boolean;
				public isLayoutRequested(): boolean;
				public sendAccessibilityEvent(param0: number): void;
				public setFlash(param0: com.otaliastudios.cameraview.controls.Flash): void;
				public onStartNestedScroll(param0: globalAndroid.view.View, param1: globalAndroid.view.View, param2: number): boolean;
				public onKeyUp(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
				public onInterceptTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
				public getPreviewFrameRate(): number;
				public getFrameProcessingMaxWidth(): number;
				public getTextDirection(): number;
				public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable): void;
				public getAudioCodec(): com.otaliastudios.cameraview.controls.AudioCodec;
				public getMode(): com.otaliastudios.cameraview.controls.Mode;
				public getPictureSnapshotMetering(): boolean;
				public getChildVisibleRect(param0: globalAndroid.view.View, param1: globalAndroid.graphics.Rect, param2: globalAndroid.graphics.Point): boolean;
				public instantiatePreview(param0: com.otaliastudios.cameraview.controls.Preview, param1: globalAndroid.content.Context, param2: globalAndroid.view.ViewGroup): com.otaliastudios.cameraview.preview.CameraPreview<any,any>;
				public getEngine(): com.otaliastudios.cameraview.controls.Engine;
				public setVideoMaxDuration(param0: number): void;
				public getFrameProcessingPoolSize(): number;
				public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet);
				public setVideoSize(param0: com.otaliastudios.cameraview.size.SizeSelector): void;
				public setPictureSnapshotMetering(param0: boolean): void;
				public getVideoBitRate(): number;
				public getParentForAccessibility(): globalAndroid.view.ViewParent;
				public addCameraListener(param0: com.otaliastudios.cameraview.CameraListener): void;
				public onNestedPrePerformAccessibilityAction(param0: globalAndroid.view.View, param1: number, param2: globalAndroid.os.Bundle): boolean;
				/** @deprecated */
				public invalidateChildInParent(param0: native.Array<number>, param1: globalAndroid.graphics.Rect): globalAndroid.view.ViewParent;
				public requestChildRectangleOnScreen(param0: globalAndroid.view.View, param1: globalAndroid.graphics.Rect, param2: boolean): boolean;
				public getVideoCodec(): com.otaliastudios.cameraview.controls.VideoCodec;
				public isTextDirectionResolved(): boolean;
				public getPictureSize(): com.otaliastudios.cameraview.size.Size;
				public showContextMenuForChild(param0: globalAndroid.view.View, param1: number, param2: number): boolean;
				public getVideoSize(): com.otaliastudios.cameraview.size.Size;
				public checkPermissions(param0: com.otaliastudios.cameraview.controls.Audio): boolean;
				public set(param0: com.otaliastudios.cameraview.controls.Control): void;
				public isLayoutDirectionResolved(): boolean;
				public notifySubtreeAccessibilityStateChanged(param0: globalAndroid.view.View, param1: globalAndroid.view.View, param2: number): void;
				public isTakingVideo(): boolean;
				public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number);
				public getFrameProcessingExecutors(): number;
				public setPictureFormat(param0: com.otaliastudios.cameraview.controls.PictureFormat): void;
				public setPictureSize(param0: com.otaliastudios.cameraview.size.SizeSelector): void;
				public childHasTransientStateChanged(param0: globalAndroid.view.View, param1: boolean): void;
				public getAudioBitRate(): number;
				public setSnapshotMaxHeight(param0: number): void;
				public destroy(): void;
				public setLifecycleOwner(param0: androidx.lifecycle.LifecycleOwner): void;
				public setUseDeviceOrientation(param0: boolean): void;
				public focusSearch(param0: number): globalAndroid.view.View;
				public showContextMenuForChild(param0: globalAndroid.view.View): boolean;
				/** @deprecated */
				public requestFitSystemWindows(): void;
				public bringChildToFront(param0: globalAndroid.view.View): void;
				public getVideoMaxDuration(): number;
				public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
				public open(): void;
				public setAudioBitRate(param0: number): void;
				public getLocation(): globalAndroid.location.Location;
				public generateLayoutParams(param0: globalAndroid.view.ViewGroup.LayoutParams): globalAndroid.view.ViewGroup.LayoutParams;
				public addFrameProcessor(param0: com.otaliastudios.cameraview.frame.FrameProcessor): void;
				public setZoom(param0: number): void;
				public onNestedScroll(param0: globalAndroid.view.View, param1: number, param2: number, param3: number, param4: number): void;
				public clearCameraListeners(): void;
				public getFacing(): com.otaliastudios.cameraview.controls.Facing;
				public getAudio(): com.otaliastudios.cameraview.controls.Audio;
				public removeFrameProcessor(param0: com.otaliastudios.cameraview.frame.FrameProcessor): void;
				public startAutoFocus(param0: number, param1: number): void;
				public clearGesture(param0: com.otaliastudios.cameraview.gesture.Gesture): void;
				public getVideoMaxSize(): number;
				public startActionModeForChild(param0: globalAndroid.view.View, param1: globalAndroid.view.ActionMode.Callback, param2: number): globalAndroid.view.ActionMode;
				public instantiateCameraEngine(param0: com.otaliastudios.cameraview.controls.Engine, param1: com.otaliastudios.cameraview.engine.CameraEngine.Callback): com.otaliastudios.cameraview.engine.CameraEngine;
				public takePictureSnapshot(): void;
				public takePicture(): void;
				public setVideoMaxSize(param0: number): void;
				public onStopNestedScroll(param0: globalAndroid.view.View): void;
				public setHdr(param0: com.otaliastudios.cameraview.controls.Hdr): void;
				public onAttachedToWindow(): void;
				public setExperimental(param0: boolean): void;
				public setLocation(param0: globalAndroid.location.Location): void;
				public getParent(): globalAndroid.view.ViewParent;
				public setFrameProcessingPoolSize(param0: number): void;
				public clearFrameProcessors(): void;
				public requestDisallowInterceptTouchEvent(param0: boolean): void;
				public getPlaySounds(): boolean;
				/** @deprecated */
				public invalidateChild(param0: globalAndroid.view.View, param1: globalAndroid.graphics.Rect): void;
				public removeCameraListener(param0: com.otaliastudios.cameraview.CameraListener): void;
				public requestChildFocus(param0: globalAndroid.view.View, param1: globalAndroid.view.View): void;
				public onKeyDown(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
				public setFrameProcessingFormat(param0: number): void;
				public get(param0: java.lang.Class<any>): com.otaliastudios.cameraview.controls.Control;
				public takeVideo(param0: java.io.File, param1: number): void;
				public generateLayoutParams(param0: globalAndroid.util.AttributeSet): globalAndroid.widget.FrameLayout.LayoutParams;
				public setEngine(param0: com.otaliastudios.cameraview.controls.Engine): void;
				public getPictureFormat(): com.otaliastudios.cameraview.controls.PictureFormat;
				public addView(param0: globalAndroid.view.View, param1: globalAndroid.view.ViewGroup.LayoutParams): void;
				public getCameraOptions(): com.otaliastudios.cameraview.CameraOptions;
				public createContextMenu(param0: globalAndroid.view.ContextMenu): void;
				public focusSearch(param0: globalAndroid.view.View, param1: number): globalAndroid.view.View;
				public requestFitSystemWindows(): void;
				public onKeyMultiple(param0: number, param1: number, param2: globalAndroid.view.KeyEvent): boolean;
				public getGrid(): com.otaliastudios.cameraview.controls.Grid;
				public requestTransparentRegion(param0: globalAndroid.view.View): void;
				public getFlash(): com.otaliastudios.cameraview.controls.Flash;
				public startActionModeForChild(param0: globalAndroid.view.View, param1: globalAndroid.view.ActionMode.Callback): globalAndroid.view.ActionMode;
				public getPictureMetering(): boolean;
				public onNestedFling(param0: globalAndroid.view.View, param1: number, param2: number, param3: boolean): boolean;
				public close(): void;
				public setWhiteBalance(param0: com.otaliastudios.cameraview.controls.WhiteBalance): void;
				public getTextAlignment(): number;
				public getAutoFocusResetDelay(): number;
				public onTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
				public getWhiteBalance(): com.otaliastudios.cameraview.controls.WhiteBalance;
				public setPictureMetering(param0: boolean): void;
				public addView(param0: globalAndroid.view.View, param1: number): void;
				public onDescendantInvalidated(param0: globalAndroid.view.View, param1: globalAndroid.view.View): void;
				public getFilter(): com.otaliastudios.cameraview.filter.Filter;
				public isOpened(): boolean;
				public setAudioCodec(param0: com.otaliastudios.cameraview.controls.AudioCodec): void;
				public mapGesture(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: com.otaliastudios.cameraview.gesture.GestureAction): boolean;
				public onDetachedFromWindow(): void;
				public setLocation(param0: number, param1: number): void;
				public takeVideo(param0: java.io.File): void;
				public onNestedPreFling(param0: globalAndroid.view.View, param1: number, param2: number): boolean;
				public setPreview(param0: com.otaliastudios.cameraview.controls.Preview): void;
				public onNestedPreScroll(param0: globalAndroid.view.View, param1: number, param2: number, param3: native.Array<number>): void;
				public setFacing(param0: com.otaliastudios.cameraview.controls.Facing): void;
				public setSnapshotMaxWidth(param0: number): void;
				public addView(param0: globalAndroid.view.View, param1: number, param2: number): void;
				public recomputeViewAttributes(param0: globalAndroid.view.View): void;
				public generateLayoutParams(param0: globalAndroid.util.AttributeSet): globalAndroid.view.ViewGroup.LayoutParams;
				public isTextAlignmentResolved(): boolean;
				public onNestedScrollAccepted(param0: globalAndroid.view.View, param1: globalAndroid.view.View, param2: number): void;
				public getSnapshotSize(): com.otaliastudios.cameraview.size.Size;
				public setFrameProcessingMaxWidth(param0: number): void;
				public getLayoutDirection(): number;
				public getPreview(): com.otaliastudios.cameraview.controls.Preview;
				public getZoom(): number;
				public removeView(param0: globalAndroid.view.View): void;
				public startAutoFocus(param0: globalAndroid.graphics.RectF): void;
				public canResolveTextDirection(): boolean;
				public setPlaySounds(param0: boolean): void;
				public canResolveTextAlignment(): boolean;
				public getUseDeviceOrientation(): boolean;
				public setPreviewStreamSize(param0: com.otaliastudios.cameraview.size.SizeSelector): void;
				public stopVideo(): void;
				public getGestureAction(param0: com.otaliastudios.cameraview.gesture.Gesture): com.otaliastudios.cameraview.gesture.GestureAction;
				public setGrid(param0: com.otaliastudios.cameraview.controls.Grid): void;
				public setAutoFocusMarker(param0: com.otaliastudios.cameraview.markers.AutoFocusMarker): void;
				public setPreviewFrameRateExact(param0: boolean): void;
				public setAutoFocusResetDelay(param0: number): void;
				public requestLayout(): void;
				public onKeyLongPress(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
				public constructor(param0: globalAndroid.content.Context);
				public toggleFacing(): com.otaliastudios.cameraview.controls.Facing;
				public setAudio(param0: com.otaliastudios.cameraview.controls.Audio): void;
				public getSnapshotMaxHeight(): number;
				public takeVideo(param0: java.io.FileDescriptor, param1: number): void;
				public keyboardNavigationClusterSearch(param0: globalAndroid.view.View, param1: number): globalAndroid.view.View;
				public getGridColor(): number;
				public requestSendAccessibilityEvent(param0: globalAndroid.view.View, param1: globalAndroid.view.accessibility.AccessibilityEvent): boolean;
				public setPreviewFrameRate(param0: number): void;
				public setFrameProcessingExecutors(param0: number): void;
				public setExposureCorrection(param0: number): void;
				public takeVideoSnapshot(param0: java.io.File): void;
				public focusableViewAvailable(param0: globalAndroid.view.View): void;
				public setVideoCodec(param0: com.otaliastudios.cameraview.controls.VideoCodec): void;
				public setVideoBitRate(param0: number): void;
				public addView(param0: globalAndroid.view.View): void;
				public canResolveLayoutDirection(): boolean;
				public getExposureCorrection(): number;
				public invalidateDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
				public sendAccessibilityEventUnchecked(param0: globalAndroid.view.accessibility.AccessibilityEvent): void;
				public isTakingPicture(): boolean;
				public onMeasure(param0: number, param1: number): void;
				public scheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable, param2: number): void;
				public addView(param0: globalAndroid.view.View, param1: number, param2: globalAndroid.view.ViewGroup.LayoutParams): void;
				public getHdr(): com.otaliastudios.cameraview.controls.Hdr;
				public takeVideoSnapshot(param0: java.io.File, param1: number): void;
				public getSnapshotMaxWidth(): number;
			}
			export module CameraView {
				export class CameraCallbacks extends java.lang.Object implements com.otaliastudios.cameraview.engine.CameraEngine.Callback, com.otaliastudios.cameraview.internal.OrientationHelper.Callback, com.otaliastudios.cameraview.gesture.GestureFinder.Controller {
					public static class: java.lang.Class<com.otaliastudios.cameraview.CameraView.CameraCallbacks>;
					public onDeviceOrientationChanged(param0: number): void;
					public getHeight(): number;
					public getWidth(): number;
					public dispatchOnExposureCorrectionChanged(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>): void;
					public dispatchOnVideoTaken(param0: com.otaliastudios.cameraview.VideoResult.Stub): void;
					public onDisplayOffsetChanged(param0: number, param1: boolean): void;
					public dispatchOnCameraOpened(param0: com.otaliastudios.cameraview.CameraOptions): void;
					public dispatchOnPictureTaken(param0: com.otaliastudios.cameraview.PictureResult.Stub): void;
					public dispatchOnCameraClosed(): void;
					public dispatchOnFocusStart(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: globalAndroid.graphics.PointF): void;
					public dispatchOnZoomChanged(param0: number, param1: native.Array<globalAndroid.graphics.PointF>): void;
					public dispatchFrame(param0: com.otaliastudios.cameraview.frame.Frame): void;
					public dispatchOnVideoRecordingEnd(): void;
					public getContext(): globalAndroid.content.Context;
					public dispatchOnFocusEnd(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: boolean, param2: globalAndroid.graphics.PointF): void;
					public onCameraPreviewStreamSizeChanged(): void;
					public onShutter(param0: boolean): void;
					public dispatchError(param0: com.otaliastudios.cameraview.CameraException): void;
					public dispatchOnVideoRecordingStart(): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export class FileCallback extends java.lang.Object {
				public static class: java.lang.Class<com.otaliastudios.cameraview.FileCallback>;
				/**
				 * Constructs a new instance of the com.otaliastudios.cameraview.FileCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
				 */
				public constructor(implementation: {
					onFileReady(param0: java.io.File): void;
				});
				public constructor();
				public onFileReady(param0: java.io.File): void;
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export class PictureResult extends java.lang.Object {
				public static class: java.lang.Class<com.otaliastudios.cameraview.PictureResult>;
				public getData(): native.Array<number>;
				public getLocation(): globalAndroid.location.Location;
				public isSnapshot(): boolean;
				public getRotation(): number;
				public getSize(): com.otaliastudios.cameraview.size.Size;
				public toBitmap(param0: com.otaliastudios.cameraview.BitmapCallback): void;
				public toFile(param0: java.io.File, param1: com.otaliastudios.cameraview.FileCallback): void;
				public getFacing(): com.otaliastudios.cameraview.controls.Facing;
				public getFormat(): com.otaliastudios.cameraview.controls.PictureFormat;
				public toBitmap(param0: number, param1: number, param2: com.otaliastudios.cameraview.BitmapCallback): void;
			}
			export module PictureResult {
				export class Stub extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.PictureResult.Stub>;
					public isSnapshot: boolean;
					public location: globalAndroid.location.Location;
					public rotation: number;
					public size: com.otaliastudios.cameraview.size.Size;
					public facing: com.otaliastudios.cameraview.controls.Facing;
					public data: native.Array<number>;
					public format: com.otaliastudios.cameraview.controls.PictureFormat;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export class VideoResult extends java.lang.Object {
				public static class: java.lang.Class<com.otaliastudios.cameraview.VideoResult>;
				public static REASON_USER: number;
				public static REASON_MAX_SIZE_REACHED: number;
				public static REASON_MAX_DURATION_REACHED: number;
				public getMaxDuration(): number;
				public getLocation(): globalAndroid.location.Location;
				public getVideoBitRate(): number;
				public getFacing(): com.otaliastudios.cameraview.controls.Facing;
				public getAudio(): com.otaliastudios.cameraview.controls.Audio;
				public getAudioBitRate(): number;
				public getTerminationReason(): number;
				public getVideoCodec(): com.otaliastudios.cameraview.controls.VideoCodec;
				public getFileDescriptor(): java.io.FileDescriptor;
				public isSnapshot(): boolean;
				public getRotation(): number;
				public getSize(): com.otaliastudios.cameraview.size.Size;
				public getVideoFrameRate(): number;
				public getFile(): java.io.File;
				public getMaxSize(): number;
				public getAudioCodec(): com.otaliastudios.cameraview.controls.AudioCodec;
			}
			export module VideoResult {
				export class Stub extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.VideoResult.Stub>;
					public isSnapshot: boolean;
					public location: globalAndroid.location.Location;
					public rotation: number;
					public size: com.otaliastudios.cameraview.size.Size;
					public file: java.io.File;
					public fileDescriptor: java.io.FileDescriptor;
					public facing: com.otaliastudios.cameraview.controls.Facing;
					public videoCodec: com.otaliastudios.cameraview.controls.VideoCodec;
					public audioCodec: com.otaliastudios.cameraview.controls.AudioCodec;
					public audio: com.otaliastudios.cameraview.controls.Audio;
					public maxSize: number;
					public maxDuration: number;
					public endReason: number;
					public videoBitRate: number;
					public videoFrameRate: number;
					public audioBitRate: number;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class Audio extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.Audio>;
					public static OFF: com.otaliastudios.cameraview.controls.Audio;
					public static ON: com.otaliastudios.cameraview.controls.Audio;
					public static MONO: com.otaliastudios.cameraview.controls.Audio;
					public static STEREO: com.otaliastudios.cameraview.controls.Audio;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.Audio>;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.Audio;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class AudioCodec extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.AudioCodec>;
					public static DEVICE_DEFAULT: com.otaliastudios.cameraview.controls.AudioCodec;
					public static AAC: com.otaliastudios.cameraview.controls.AudioCodec;
					public static HE_AAC: com.otaliastudios.cameraview.controls.AudioCodec;
					public static AAC_ELD: com.otaliastudios.cameraview.controls.AudioCodec;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.AudioCodec;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.AudioCodec>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class Control extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.Control>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.controls.Control interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
					});
					public constructor();
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class ControlParser extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.ControlParser>;
					public getAudio(): com.otaliastudios.cameraview.controls.Audio;
					public getGrid(): com.otaliastudios.cameraview.controls.Grid;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.content.res.TypedArray);
					public getPreview(): com.otaliastudios.cameraview.controls.Preview;
					public getFacing(): com.otaliastudios.cameraview.controls.Facing;
					public getEngine(): com.otaliastudios.cameraview.controls.Engine;
					public getFlash(): com.otaliastudios.cameraview.controls.Flash;
					public getWhiteBalance(): com.otaliastudios.cameraview.controls.WhiteBalance;
					public getMode(): com.otaliastudios.cameraview.controls.Mode;
					public getHdr(): com.otaliastudios.cameraview.controls.Hdr;
					public getAudioCodec(): com.otaliastudios.cameraview.controls.AudioCodec;
					public getVideoCodec(): com.otaliastudios.cameraview.controls.VideoCodec;
					public getPictureFormat(): com.otaliastudios.cameraview.controls.PictureFormat;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class Engine extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.Engine>;
					public static CAMERA1: com.otaliastudios.cameraview.controls.Engine;
					public static CAMERA2: com.otaliastudios.cameraview.controls.Engine;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.Engine;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.Engine>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class Facing extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.Facing>;
					public static BACK: com.otaliastudios.cameraview.controls.Facing;
					public static FRONT: com.otaliastudios.cameraview.controls.Facing;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.Facing>;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.Facing;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class Flash extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.Flash>;
					public static OFF: com.otaliastudios.cameraview.controls.Flash;
					public static ON: com.otaliastudios.cameraview.controls.Flash;
					public static AUTO: com.otaliastudios.cameraview.controls.Flash;
					public static TORCH: com.otaliastudios.cameraview.controls.Flash;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.Flash;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.Flash>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class Grid extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.Grid>;
					public static OFF: com.otaliastudios.cameraview.controls.Grid;
					public static DRAW_3X3: com.otaliastudios.cameraview.controls.Grid;
					public static DRAW_4X4: com.otaliastudios.cameraview.controls.Grid;
					public static DRAW_PHI: com.otaliastudios.cameraview.controls.Grid;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.Grid>;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.Grid;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class Hdr extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.Hdr>;
					public static OFF: com.otaliastudios.cameraview.controls.Hdr;
					public static ON: com.otaliastudios.cameraview.controls.Hdr;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.Hdr>;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.Hdr;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class Mode extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.Mode>;
					public static PICTURE: com.otaliastudios.cameraview.controls.Mode;
					public static VIDEO: com.otaliastudios.cameraview.controls.Mode;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.Mode;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.Mode>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class PictureFormat extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.PictureFormat>;
					public static JPEG: com.otaliastudios.cameraview.controls.PictureFormat;
					public static DNG: com.otaliastudios.cameraview.controls.PictureFormat;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.PictureFormat;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.PictureFormat>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class Preview extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.Preview>;
					public static SURFACE: com.otaliastudios.cameraview.controls.Preview;
					public static TEXTURE: com.otaliastudios.cameraview.controls.Preview;
					public static GL_SURFACE: com.otaliastudios.cameraview.controls.Preview;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.Preview;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.Preview>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class VideoCodec extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.VideoCodec>;
					public static DEVICE_DEFAULT: com.otaliastudios.cameraview.controls.VideoCodec;
					public static H_263: com.otaliastudios.cameraview.controls.VideoCodec;
					public static H_264: com.otaliastudios.cameraview.controls.VideoCodec;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.VideoCodec>;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.VideoCodec;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module controls {
				export class WhiteBalance extends com.otaliastudios.cameraview.controls.Control {
					public static class: java.lang.Class<com.otaliastudios.cameraview.controls.WhiteBalance>;
					public static AUTO: com.otaliastudios.cameraview.controls.WhiteBalance;
					public static INCANDESCENT: com.otaliastudios.cameraview.controls.WhiteBalance;
					public static FLUORESCENT: com.otaliastudios.cameraview.controls.WhiteBalance;
					public static DAYLIGHT: com.otaliastudios.cameraview.controls.WhiteBalance;
					public static CLOUDY: com.otaliastudios.cameraview.controls.WhiteBalance;
					public static valueOf(param0: string): com.otaliastudios.cameraview.controls.WhiteBalance;
					public static values(): native.Array<com.otaliastudios.cameraview.controls.WhiteBalance>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export class Camera1Engine extends com.otaliastudios.cameraview.engine.CameraBaseEngine implements globalAndroid.hardware.Camera.PreviewCallback, globalAndroid.hardware.Camera.ErrorCallback, com.otaliastudios.cameraview.frame.ByteBufferFrameManager.BufferCallback {
					public static class: java.lang.Class<com.otaliastudios.cameraview.engine.Camera1Engine>;
					public onStopPreview(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public onSurfaceChanged(): void;
					public onStartPreview(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public setFlash(param0: com.otaliastudios.cameraview.controls.Flash): void;
					public onSurfaceDestroyed(): void;
					public onSurfaceAvailable(): void;
					public onVideoResult(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.lang.Exception): void;
					public onTakeVideo(param0: com.otaliastudios.cameraview.VideoResult.Stub): void;
					public onVideoRecordingStart(): void;
					public onPreviewFrame(param0: native.Array<number>, param1: globalAndroid.hardware.Camera): void;
					public setWhiteBalance(param0: com.otaliastudios.cameraview.controls.WhiteBalance): void;
					public instantiateFrameManager(param0: number): com.otaliastudios.cameraview.frame.FrameManager<any>;
					public onStopEngine(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public onError(param0: number, param1: globalAndroid.hardware.Camera): void;
					public getFrameManager(): com.otaliastudios.cameraview.frame.FrameManager<any>;
					public onTakePictureSnapshot(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.size.AspectRatio, param2: boolean): void;
					public setZoom(param0: number, param1: native.Array<globalAndroid.graphics.PointF>, param2: boolean): void;
					public setExposureCorrection(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>, param3: boolean): void;
					public getFrameProcessingAvailableSizes(): java.util.List<com.otaliastudios.cameraview.size.Size>;
					public onStartEngine(): com.google.android.gms.tasks.Task<com.otaliastudios.cameraview.CameraOptions>;
					public getPreviewStreamAvailableSizes(): java.util.List<com.otaliastudios.cameraview.size.Size>;
					public onStartBind(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public startAutoFocus(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: com.otaliastudios.cameraview.metering.MeteringRegions, param2: globalAndroid.graphics.PointF): void;
					public onTakeVideoSnapshot(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: com.otaliastudios.cameraview.size.AspectRatio): void;
					public setLocation(param0: globalAndroid.location.Location): void;
					public setHdr(param0: com.otaliastudios.cameraview.controls.Hdr): void;
					public onPictureResult(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: java.lang.Exception): void;
					public collectCameraInfo(param0: com.otaliastudios.cameraview.controls.Facing): boolean;
					public setPlaySounds(param0: boolean): void;
					public onBufferAvailable(param0: native.Array<number>): void;
					public onVideoRecordingEnd(): void;
					public setHasFrameProcessors(param0: boolean): void;
					public onPictureShutter(param0: boolean): void;
					public onPreviewStreamSizeChanged(): void;
					public setPictureFormat(param0: com.otaliastudios.cameraview.controls.PictureFormat): void;
					public constructor(param0: com.otaliastudios.cameraview.engine.CameraEngine.Callback);
					public getFrameManager(): com.otaliastudios.cameraview.frame.ByteBufferFrameManager;
					public onStopBind(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public setPreviewFrameRate(param0: number): void;
					public onTakePicture(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: boolean): void;
					public setFrameProcessingFormat(param0: number): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export class Camera2Engine extends com.otaliastudios.cameraview.engine.CameraBaseEngine implements globalAndroid.media.ImageReader.OnImageAvailableListener, com.otaliastudios.cameraview.engine.action.ActionHolder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.engine.Camera2Engine>;
					public onStopPreview(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public onSurfaceChanged(): void;
					public onStartPreview(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public applyRepeatingRequestBuilder(): void;
					public onSurfaceAvailable(): void;
					public onTakeVideo(param0: com.otaliastudios.cameraview.VideoResult.Stub): void;
					public onVideoRecordingStart(): void;
					public applyBuilder(param0: com.otaliastudios.cameraview.engine.action.Action): void;
					public applyDefaultFocus(param0: globalAndroid.hardware.camera2.CaptureRequest.Builder): void;
					public onStopEngine(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public getLastResult(param0: com.otaliastudios.cameraview.engine.action.Action): globalAndroid.hardware.camera2.TotalCaptureResult;
					public getBuilder(param0: com.otaliastudios.cameraview.engine.action.Action): globalAndroid.hardware.camera2.CaptureRequest.Builder;
					public onTakePictureSnapshot(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.size.AspectRatio, param2: boolean): void;
					public setZoom(param0: number, param1: native.Array<globalAndroid.graphics.PointF>, param2: boolean): void;
					public setExposureCorrection(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>, param3: boolean): void;
					public getFrameProcessingAvailableSizes(): java.util.List<com.otaliastudios.cameraview.size.Size>;
					public applyExposureCorrection(param0: globalAndroid.hardware.camera2.CaptureRequest.Builder, param1: number): boolean;
					public applyBuilder(param0: com.otaliastudios.cameraview.engine.action.Action, param1: globalAndroid.hardware.camera2.CaptureRequest.Builder): void;
					public getPreviewStreamAvailableSizes(): java.util.List<com.otaliastudios.cameraview.size.Size>;
					public setLocation(param0: globalAndroid.location.Location): void;
					public setHdr(param0: com.otaliastudios.cameraview.controls.Hdr): void;
					public onPictureResult(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: java.lang.Exception): void;
					public setPlaySounds(param0: boolean): void;
					public addAction(param0: com.otaliastudios.cameraview.engine.action.Action): void;
					public onImageAvailable(param0: globalAndroid.media.ImageReader): void;
					public applyFlash(param0: globalAndroid.hardware.camera2.CaptureRequest.Builder, param1: com.otaliastudios.cameraview.controls.Flash): boolean;
					public onTakePicture(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: boolean): void;
					public setFrameProcessingFormat(param0: number): void;
					public setFlash(param0: com.otaliastudios.cameraview.controls.Flash): void;
					public onSurfaceDestroyed(): void;
					public removeAction(param0: com.otaliastudios.cameraview.engine.action.Action): void;
					public onVideoResult(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.lang.Exception): void;
					public setWhiteBalance(param0: com.otaliastudios.cameraview.controls.WhiteBalance): void;
					public applyWhiteBalance(param0: globalAndroid.hardware.camera2.CaptureRequest.Builder, param1: com.otaliastudios.cameraview.controls.WhiteBalance): boolean;
					public instantiateFrameManager(param0: number): com.otaliastudios.cameraview.frame.FrameManager<any>;
					public applyPreviewFrameRate(param0: globalAndroid.hardware.camera2.CaptureRequest.Builder, param1: number): boolean;
					public onStartEngine(): com.google.android.gms.tasks.Task<com.otaliastudios.cameraview.CameraOptions>;
					public applyLocation(param0: globalAndroid.hardware.camera2.CaptureRequest.Builder, param1: globalAndroid.location.Location): boolean;
					public onStartBind(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public startAutoFocus(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: com.otaliastudios.cameraview.metering.MeteringRegions, param2: globalAndroid.graphics.PointF): void;
					public onTakeVideoSnapshot(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: com.otaliastudios.cameraview.size.AspectRatio): void;
					public applyZoom(param0: globalAndroid.hardware.camera2.CaptureRequest.Builder, param1: number): boolean;
					public collectCameraInfo(param0: com.otaliastudios.cameraview.controls.Facing): boolean;
					public onVideoRecordingEnd(): void;
					public setHasFrameProcessors(param0: boolean): void;
					public onPictureShutter(param0: boolean): void;
					public getCharacteristics(param0: com.otaliastudios.cameraview.engine.action.Action): globalAndroid.hardware.camera2.CameraCharacteristics;
					public applyHdr(param0: globalAndroid.hardware.camera2.CaptureRequest.Builder, param1: com.otaliastudios.cameraview.controls.Hdr): boolean;
					public applyFocusForMetering(param0: globalAndroid.hardware.camera2.CaptureRequest.Builder): void;
					public onPreviewStreamSizeChanged(): void;
					public setPictureFormat(param0: com.otaliastudios.cameraview.controls.PictureFormat): void;
					public constructor(param0: com.otaliastudios.cameraview.engine.CameraEngine.Callback);
					public onStopBind(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public setPreviewFrameRate(param0: number): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export abstract class CameraBaseEngine extends com.otaliastudios.cameraview.engine.CameraEngine {
					public static class: java.lang.Class<com.otaliastudios.cameraview.engine.CameraBaseEngine>;
					public mPreview: com.otaliastudios.cameraview.preview.CameraPreview<any,any>;
					public mCameraOptions: com.otaliastudios.cameraview.CameraOptions;
					public mPictureRecorder: com.otaliastudios.cameraview.picture.PictureRecorder;
					public mVideoRecorder: com.otaliastudios.cameraview.video.VideoRecorder;
					public mCaptureSize: com.otaliastudios.cameraview.size.Size;
					public mPreviewStreamSize: com.otaliastudios.cameraview.size.Size;
					public mFrameProcessingSize: com.otaliastudios.cameraview.size.Size;
					public mFrameProcessingFormat: number;
					public mHasFrameProcessors: boolean;
					public mFlash: com.otaliastudios.cameraview.controls.Flash;
					public mWhiteBalance: com.otaliastudios.cameraview.controls.WhiteBalance;
					public mVideoCodec: com.otaliastudios.cameraview.controls.VideoCodec;
					public mAudioCodec: com.otaliastudios.cameraview.controls.AudioCodec;
					public mHdr: com.otaliastudios.cameraview.controls.Hdr;
					public mPictureFormat: com.otaliastudios.cameraview.controls.PictureFormat;
					public mLocation: globalAndroid.location.Location;
					public mZoomValue: number;
					public mExposureCorrectionValue: number;
					public mPlaySounds: boolean;
					public mPictureMetering: boolean;
					public mPictureSnapshotMetering: boolean;
					public mPreviewFrameRate: number;
					public getOverlay(): com.otaliastudios.cameraview.overlay.Overlay;
					public setAutoFocusResetDelay(param0: number): void;
					public setOverlay(param0: com.otaliastudios.cameraview.overlay.Overlay): void;
					public getFrameProcessingFormat(): number;
					public getPreviewFrameRate(): number;
					public computeCaptureSize(): com.otaliastudios.cameraview.size.Size;
					public getAutoFocusResetDelay(): number;
					public onSurfaceChanged(): void;
					public getVideoMaxSize(): number;
					public getZoomValue(): number;
					public onSurfaceAvailable(): void;
					public onVideoRecordingStart(): void;
					public onTakeVideo(param0: com.otaliastudios.cameraview.VideoResult.Stub): void;
					public setFacing(param0: com.otaliastudios.cameraview.controls.Facing): void;
					public setMode(param0: com.otaliastudios.cameraview.controls.Mode): void;
					public setSnapshotMaxHeight(param0: number): void;
					public setVideoSizeSelector(param0: com.otaliastudios.cameraview.size.SizeSelector): void;
					public getAudioBitRate(): number;
					public getVideoBitRate(): number;
					public getSnapshotMaxWidth(): number;
					public getFlash(): com.otaliastudios.cameraview.controls.Flash;
					public getFrameManager(): com.otaliastudios.cameraview.frame.FrameManager<any>;
					public getMode(): com.otaliastudios.cameraview.controls.Mode;
					public setPreviewFrameRateExact(param0: boolean): void;
					public onTakePictureSnapshot(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.size.AspectRatio, param2: boolean): void;
					public getFrameProcessingMaxHeight(): number;
					public setPictureMetering(param0: boolean): void;
					public getFrameProcessingAvailableSizes(): java.util.List<com.otaliastudios.cameraview.size.Size>;
					public shouldResetAutoFocus(): boolean;
					public setPictureSnapshotMetering(param0: boolean): void;
					public getPreviewStreamAvailableSizes(): java.util.List<com.otaliastudios.cameraview.size.Size>;
					public getLocation(): globalAndroid.location.Location;
					public setAudioBitRate(param0: number): void;
					public setSnapshotMaxWidth(param0: number): void;
					public getAudio(): com.otaliastudios.cameraview.controls.Audio;
					public isTakingVideo(): boolean;
					public takePictureSnapshot(param0: com.otaliastudios.cameraview.PictureResult.Stub): void;
					public getPreview(): com.otaliastudios.cameraview.preview.CameraPreview<any,any>;
					public setPreview(param0: com.otaliastudios.cameraview.preview.CameraPreview<any,any>): void;
					public onPictureResult(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: java.lang.Exception): void;
					public getPictureSize(param0: com.otaliastudios.cameraview.engine.offset.Reference): com.otaliastudios.cameraview.size.Size;
					public setFrameProcessingPoolSize(param0: number): void;
					public getPictureSnapshotMetering(): boolean;
					public takePicture(param0: com.otaliastudios.cameraview.PictureResult.Stub): void;
					public computePreviewStreamSize(): com.otaliastudios.cameraview.size.Size;
					public getUncroppedSnapshotSize(param0: com.otaliastudios.cameraview.engine.offset.Reference): com.otaliastudios.cameraview.size.Size;
					public isTakingPicture(): boolean;
					public getHdr(): com.otaliastudios.cameraview.controls.Hdr;
					public getPictureSizeSelector(): com.otaliastudios.cameraview.size.SizeSelector;
					public onTakePicture(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: boolean): void;
					public getExposureCorrectionValue(): number;
					public getPictureFormat(): com.otaliastudios.cameraview.controls.PictureFormat;
					public setVideoMaxDuration(param0: number): void;
					public setVideoBitRate(param0: number): void;
					public getVideoMaxDuration(): number;
					public setVideoCodec(param0: com.otaliastudios.cameraview.controls.VideoCodec): void;
					public onSurfaceDestroyed(): void;
					public getPreviewFrameRateExact(): boolean;
					public setAudioCodec(param0: com.otaliastudios.cameraview.controls.AudioCodec): void;
					public getPreviewStreamSize(param0: com.otaliastudios.cameraview.engine.offset.Reference): com.otaliastudios.cameraview.size.Size;
					public setPictureSizeSelector(param0: com.otaliastudios.cameraview.size.SizeSelector): void;
					public onVideoResult(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.lang.Exception): void;
					public getFacing(): com.otaliastudios.cameraview.controls.Facing;
					public stopVideo(): void;
					public instantiateFrameManager(param0: number): com.otaliastudios.cameraview.frame.FrameManager<any>;
					public getFrameProcessingPoolSize(): number;
					public getAngles(): com.otaliastudios.cameraview.engine.offset.Angles;
					public setPreviewStreamSizeSelector(param0: com.otaliastudios.cameraview.size.SizeSelector): void;
					public getVideoSizeSelector(): com.otaliastudios.cameraview.size.SizeSelector;
					public getWhiteBalance(): com.otaliastudios.cameraview.controls.WhiteBalance;
					public getCameraOptions(): com.otaliastudios.cameraview.CameraOptions;
					public setFrameProcessingMaxWidth(param0: number): void;
					public onStopVideo(): void;
					public getVideoCodec(): com.otaliastudios.cameraview.controls.VideoCodec;
					public getPreviewStreamSizeSelector(): com.otaliastudios.cameraview.size.SizeSelector;
					public onTakeVideoSnapshot(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: com.otaliastudios.cameraview.size.AspectRatio): void;
					public getFrameProcessingMaxWidth(): number;
					public getPictureMetering(): boolean;
					public takeVideoSnapshot(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.io.File): void;
					public setVideoMaxSize(param0: number): void;
					public takeVideo(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.io.File, param2: java.io.FileDescriptor): void;
					public onVideoRecordingEnd(): void;
					public computeCaptureSize(param0: com.otaliastudios.cameraview.controls.Mode): com.otaliastudios.cameraview.size.Size;
					public onPictureShutter(param0: boolean): void;
					public setFrameProcessingMaxHeight(param0: number): void;
					public hasFrameProcessors(): boolean;
					public computeFrameProcessingSize(): com.otaliastudios.cameraview.size.Size;
					public onPreviewStreamSizeChanged(): void;
					public constructor(param0: com.otaliastudios.cameraview.engine.CameraEngine.Callback);
					public setAudio(param0: com.otaliastudios.cameraview.controls.Audio): void;
					public getSnapshotMaxHeight(): number;
					public getAudioCodec(): com.otaliastudios.cameraview.controls.AudioCodec;
					public getVideoSize(param0: com.otaliastudios.cameraview.engine.offset.Reference): com.otaliastudios.cameraview.size.Size;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export abstract class CameraEngine extends java.lang.Object implements com.otaliastudios.cameraview.preview.CameraPreview.SurfaceCallback, com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener, com.otaliastudios.cameraview.video.VideoRecorder.VideoResultListener {
					public static class: java.lang.Class<com.otaliastudios.cameraview.engine.CameraEngine>;
					public static TAG: string;
					public static LOG: com.otaliastudios.cameraview.CameraLogger;
					public getOverlay(): com.otaliastudios.cameraview.overlay.Overlay;
					public getFrameProcessingFormat(): number;
					public onStartPreview(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public destroy(param0: boolean): void;
					public onVideoRecordingStart(): void;
					public setSnapshotMaxHeight(param0: number): void;
					public getFlash(): com.otaliastudios.cameraview.controls.Flash;
					public setPreviewFrameRateExact(param0: boolean): void;
					public setExposureCorrection(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>, param3: boolean): void;
					public getFrameProcessingMaxHeight(): number;
					public setPictureMetering(param0: boolean): void;
					public getLocation(): globalAndroid.location.Location;
					public setAudioBitRate(param0: number): void;
					public setSnapshotMaxWidth(param0: number): void;
					public getPreview(): com.otaliastudios.cameraview.preview.CameraPreview<any,any>;
					public setPreview(param0: com.otaliastudios.cameraview.preview.CameraPreview<any,any>): void;
					public setFrameProcessingPoolSize(param0: number): void;
					public getPictureSnapshotMetering(): boolean;
					public getUncroppedSnapshotSize(param0: com.otaliastudios.cameraview.engine.offset.Reference): com.otaliastudios.cameraview.size.Size;
					public isTakingPicture(): boolean;
					public restartPreview(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public setFrameProcessingFormat(param0: number): void;
					public getExposureCorrectionValue(): number;
					public getPictureFormat(): com.otaliastudios.cameraview.controls.PictureFormat;
					public getOrchestrator(): com.otaliastudios.cameraview.engine.orchestrator.CameraStateOrchestrator;
					public getVideoMaxDuration(): number;
					public setVideoCodec(param0: com.otaliastudios.cameraview.controls.VideoCodec): void;
					public onSurfaceDestroyed(): void;
					public stop(param0: boolean): com.google.android.gms.tasks.Task<java.lang.Void>;
					public getPreviewFrameRateExact(): boolean;
					public setWhiteBalance(param0: com.otaliastudios.cameraview.controls.WhiteBalance): void;
					public getVideoSizeSelector(): com.otaliastudios.cameraview.size.SizeSelector;
					public getWhiteBalance(): com.otaliastudios.cameraview.controls.WhiteBalance;
					public getCameraOptions(): com.otaliastudios.cameraview.CameraOptions;
					public setFrameProcessingMaxWidth(param0: number): void;
					public getPreviewStreamSizeSelector(): com.otaliastudios.cameraview.size.SizeSelector;
					public getCallback(): com.otaliastudios.cameraview.engine.CameraEngine.Callback;
					public takeVideoSnapshot(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.io.File): void;
					public setVideoMaxSize(param0: number): void;
					public setHasFrameProcessors(param0: boolean): void;
					public setFrameProcessingMaxHeight(param0: number): void;
					public constructor(param0: com.otaliastudios.cameraview.engine.CameraEngine.Callback);
					public setAudio(param0: com.otaliastudios.cameraview.controls.Audio): void;
					public setPreviewFrameRate(param0: number): void;
					public getVideoSize(param0: com.otaliastudios.cameraview.engine.offset.Reference): com.otaliastudios.cameraview.size.Size;
					public setAutoFocusResetDelay(param0: number): void;
					public setOverlay(param0: com.otaliastudios.cameraview.overlay.Overlay): void;
					public getPreviewFrameRate(): number;
					public onStopPreview(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public getAutoFocusResetDelay(): number;
					public onSurfaceChanged(): void;
					public getVideoMaxSize(): number;
					public getZoomValue(): number;
					public onSurfaceAvailable(): void;
					public setFacing(param0: com.otaliastudios.cameraview.controls.Facing): void;
					public setMode(param0: com.otaliastudios.cameraview.controls.Mode): void;
					public setVideoSizeSelector(param0: com.otaliastudios.cameraview.size.SizeSelector): void;
					public getTargetState(): com.otaliastudios.cameraview.engine.orchestrator.CameraState;
					public onStopEngine(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public getAudioBitRate(): number;
					public getVideoBitRate(): number;
					public getSnapshotMaxWidth(): number;
					public getFrameManager(): com.otaliastudios.cameraview.frame.FrameManager<any>;
					public getMode(): com.otaliastudios.cameraview.controls.Mode;
					public setZoom(param0: number, param1: native.Array<globalAndroid.graphics.PointF>, param2: boolean): void;
					public setPictureSnapshotMetering(param0: boolean): void;
					public getAudio(): com.otaliastudios.cameraview.controls.Audio;
					public isTakingVideo(): boolean;
					public setLocation(param0: globalAndroid.location.Location): void;
					public takePictureSnapshot(param0: com.otaliastudios.cameraview.PictureResult.Stub): void;
					public setHdr(param0: com.otaliastudios.cameraview.controls.Hdr): void;
					public getPictureSize(param0: com.otaliastudios.cameraview.engine.offset.Reference): com.otaliastudios.cameraview.size.Size;
					public onPictureResult(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: java.lang.Exception): void;
					public setPlaySounds(param0: boolean): void;
					public restart(): void;
					public takePicture(param0: com.otaliastudios.cameraview.PictureResult.Stub): void;
					public getHdr(): com.otaliastudios.cameraview.controls.Hdr;
					public getPictureSizeSelector(): com.otaliastudios.cameraview.size.SizeSelector;
					public restartBind(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public setVideoMaxDuration(param0: number): void;
					public setVideoBitRate(param0: number): void;
					public setFlash(param0: com.otaliastudios.cameraview.controls.Flash): void;
					public getPreviewStreamSize(param0: com.otaliastudios.cameraview.engine.offset.Reference): com.otaliastudios.cameraview.size.Size;
					public setAudioCodec(param0: com.otaliastudios.cameraview.controls.AudioCodec): void;
					public setPictureSizeSelector(param0: com.otaliastudios.cameraview.size.SizeSelector): void;
					public onVideoResult(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.lang.Exception): void;
					public getFacing(): com.otaliastudios.cameraview.controls.Facing;
					public stopVideo(): void;
					public getFrameProcessingPoolSize(): number;
					public getAngles(): com.otaliastudios.cameraview.engine.offset.Angles;
					public setPreviewStreamSizeSelector(param0: com.otaliastudios.cameraview.size.SizeSelector): void;
					public onStartEngine(): com.google.android.gms.tasks.Task<com.otaliastudios.cameraview.CameraOptions>;
					public onStartBind(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public getVideoCodec(): com.otaliastudios.cameraview.controls.VideoCodec;
					public startAutoFocus(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: com.otaliastudios.cameraview.metering.MeteringRegions, param2: globalAndroid.graphics.PointF): void;
					public getFrameProcessingMaxWidth(): number;
					public getPictureMetering(): boolean;
					public collectCameraInfo(param0: com.otaliastudios.cameraview.controls.Facing): boolean;
					public takeVideo(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.io.File, param2: java.io.FileDescriptor): void;
					public onVideoRecordingEnd(): void;
					public onPictureShutter(param0: boolean): void;
					public hasFrameProcessors(): boolean;
					public getState(): com.otaliastudios.cameraview.engine.orchestrator.CameraState;
					public isChangingState(): boolean;
					public start(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public setPictureFormat(param0: com.otaliastudios.cameraview.controls.PictureFormat): void;
					public onStopBind(): com.google.android.gms.tasks.Task<java.lang.Void>;
					public getSnapshotMaxHeight(): number;
					public getAudioCodec(): com.otaliastudios.cameraview.controls.AudioCodec;
				}
				export module CameraEngine {
					export class Callback extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.CameraEngine.Callback>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.engine.CameraEngine$Callback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getContext(): globalAndroid.content.Context;
							dispatchOnCameraOpened(param0: com.otaliastudios.cameraview.CameraOptions): void;
							dispatchOnCameraClosed(): void;
							onCameraPreviewStreamSizeChanged(): void;
							onShutter(param0: boolean): void;
							dispatchOnVideoTaken(param0: com.otaliastudios.cameraview.VideoResult.Stub): void;
							dispatchOnPictureTaken(param0: com.otaliastudios.cameraview.PictureResult.Stub): void;
							dispatchOnFocusStart(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: globalAndroid.graphics.PointF): void;
							dispatchOnFocusEnd(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: boolean, param2: globalAndroid.graphics.PointF): void;
							dispatchOnZoomChanged(param0: number, param1: native.Array<globalAndroid.graphics.PointF>): void;
							dispatchOnExposureCorrectionChanged(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>): void;
							dispatchFrame(param0: com.otaliastudios.cameraview.frame.Frame): void;
							dispatchError(param0: com.otaliastudios.cameraview.CameraException): void;
							dispatchOnVideoRecordingStart(): void;
							dispatchOnVideoRecordingEnd(): void;
						});
						public constructor();
						public onShutter(param0: boolean): void;
						public dispatchOnCameraOpened(param0: com.otaliastudios.cameraview.CameraOptions): void;
						public dispatchOnFocusStart(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: globalAndroid.graphics.PointF): void;
						public getContext(): globalAndroid.content.Context;
						public dispatchOnFocusEnd(param0: com.otaliastudios.cameraview.gesture.Gesture, param1: boolean, param2: globalAndroid.graphics.PointF): void;
						public dispatchOnCameraClosed(): void;
						public dispatchOnVideoTaken(param0: com.otaliastudios.cameraview.VideoResult.Stub): void;
						public dispatchOnVideoRecordingStart(): void;
						public onCameraPreviewStreamSizeChanged(): void;
						public dispatchOnZoomChanged(param0: number, param1: native.Array<globalAndroid.graphics.PointF>): void;
						public dispatchOnExposureCorrectionChanged(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>): void;
						public dispatchError(param0: com.otaliastudios.cameraview.CameraException): void;
						public dispatchOnPictureTaken(param0: com.otaliastudios.cameraview.PictureResult.Stub): void;
						public dispatchFrame(param0: com.otaliastudios.cameraview.frame.Frame): void;
						public dispatchOnVideoRecordingEnd(): void;
					}
					export class CrashExceptionHandler extends java.lang.Object implements java.lang.Thread.UncaughtExceptionHandler {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.CameraEngine.CrashExceptionHandler>;
						public uncaughtException(param0: java.lang.Thread, param1: java.lang.Throwable): void;
					}
					export class NoOpExceptionHandler extends java.lang.Object implements java.lang.Thread.UncaughtExceptionHandler {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.CameraEngine.NoOpExceptionHandler>;
						public uncaughtException(param0: java.lang.Thread, param1: java.lang.Throwable): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export class EngineThread extends java.lang.Object implements java.lang.annotation.Annotation {
					public static class: java.lang.Class<com.otaliastudios.cameraview.engine.EngineThread>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.engine.EngineThread interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						equals(param0: any): boolean;
						hashCode(): number;
						toString(): string;
						annotationType(): java.lang.Class<any>;
					});
					public constructor();
					public equals(param0: any): boolean;
					public toString(): string;
					public annotationType(): java.lang.Class<any>;
					public hashCode(): number;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export class Action extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.Action>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.engine.action.Action interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getState(): number;
							start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
							abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
							addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
							removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
							onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
							onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
							onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						});
						public constructor();
						public static STATE_COMPLETED: number;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export class ActionCallback extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.ActionCallback>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.engine.action.ActionCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onActionStateChanged(param0: com.otaliastudios.cameraview.engine.action.Action, param1: number): void;
						});
						public constructor();
						public onActionStateChanged(param0: com.otaliastudios.cameraview.engine.action.Action, param1: number): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export class ActionHolder extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.ActionHolder>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.engine.action.ActionHolder interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							addAction(param0: com.otaliastudios.cameraview.engine.action.Action): void;
							removeAction(param0: com.otaliastudios.cameraview.engine.action.Action): void;
							getCharacteristics(param0: com.otaliastudios.cameraview.engine.action.Action): globalAndroid.hardware.camera2.CameraCharacteristics;
							getLastResult(param0: com.otaliastudios.cameraview.engine.action.Action): globalAndroid.hardware.camera2.TotalCaptureResult;
							getBuilder(param0: com.otaliastudios.cameraview.engine.action.Action): globalAndroid.hardware.camera2.CaptureRequest.Builder;
							applyBuilder(param0: com.otaliastudios.cameraview.engine.action.Action): void;
							applyBuilder(param0: com.otaliastudios.cameraview.engine.action.Action, param1: globalAndroid.hardware.camera2.CaptureRequest.Builder): void;
						});
						public constructor();
						public applyBuilder(param0: com.otaliastudios.cameraview.engine.action.Action, param1: globalAndroid.hardware.camera2.CaptureRequest.Builder): void;
						public getBuilder(param0: com.otaliastudios.cameraview.engine.action.Action): globalAndroid.hardware.camera2.CaptureRequest.Builder;
						public getCharacteristics(param0: com.otaliastudios.cameraview.engine.action.Action): globalAndroid.hardware.camera2.CameraCharacteristics;
						public applyBuilder(param0: com.otaliastudios.cameraview.engine.action.Action): void;
						public getLastResult(param0: com.otaliastudios.cameraview.engine.action.Action): globalAndroid.hardware.camera2.TotalCaptureResult;
						public addAction(param0: com.otaliastudios.cameraview.engine.action.Action): void;
						public removeAction(param0: com.otaliastudios.cameraview.engine.action.Action): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export abstract class ActionWrapper extends com.otaliastudios.cameraview.engine.action.BaseAction {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.ActionWrapper>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public constructor();
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getAction(): com.otaliastudios.cameraview.engine.action.BaseAction;
						public onAbort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export class Actions extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.Actions>;
						public constructor();
						public static sequence(param0: native.Array<com.otaliastudios.cameraview.engine.action.BaseAction>): com.otaliastudios.cameraview.engine.action.BaseAction;
						public static timeout(param0: number, param1: com.otaliastudios.cameraview.engine.action.BaseAction): com.otaliastudios.cameraview.engine.action.BaseAction;
						public static together(param0: native.Array<com.otaliastudios.cameraview.engine.action.BaseAction>): com.otaliastudios.cameraview.engine.action.BaseAction;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export abstract class BaseAction extends java.lang.Object implements com.otaliastudios.cameraview.engine.action.Action {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.BaseAction>;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public constructor();
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onAbort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public getHolder(): com.otaliastudios.cameraview.engine.action.ActionHolder;
						public isCompleted(): boolean;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public setState(param0: number): void;
						public onCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public readCharacteristic(param0: globalAndroid.hardware.camera2.CameraCharacteristics.Key, param1: any): any;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public getState(): number;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export abstract class CompletionCallback extends java.lang.Object implements com.otaliastudios.cameraview.engine.action.ActionCallback {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.CompletionCallback>;
						public onActionStateChanged(param0: com.otaliastudios.cameraview.engine.action.Action, param1: number): void;
						public constructor();
						public onActionCompleted(param0: com.otaliastudios.cameraview.engine.action.Action): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export class LogAction extends com.otaliastudios.cameraview.engine.action.BaseAction {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.LogAction>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public onCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public constructor();
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export class SequenceAction extends com.otaliastudios.cameraview.engine.action.BaseAction {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.SequenceAction>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onAbort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export class TimeoutAction extends com.otaliastudios.cameraview.engine.action.ActionWrapper {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.TimeoutAction>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public getAction(): com.otaliastudios.cameraview.engine.action.BaseAction;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module action {
					export class TogetherAction extends com.otaliastudios.cameraview.engine.action.BaseAction {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.action.TogetherAction>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onAbort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module lock {
					export abstract class BaseLock extends com.otaliastudios.cameraview.engine.action.BaseAction {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.lock.BaseLock>;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public constructor();
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public checkIsSupported(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public checkShouldSkip(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module lock {
					export class ExposureLock extends com.otaliastudios.cameraview.engine.lock.BaseLock {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.lock.ExposureLock>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public constructor();
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public checkIsSupported(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public checkShouldSkip(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module lock {
					export class FocusLock extends com.otaliastudios.cameraview.engine.lock.BaseLock {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.lock.FocusLock>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public constructor();
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public checkIsSupported(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public checkShouldSkip(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module lock {
					export class LockAction extends com.otaliastudios.cameraview.engine.action.ActionWrapper {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.lock.LockAction>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public constructor();
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public getAction(): com.otaliastudios.cameraview.engine.action.BaseAction;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module lock {
					export class WhiteBalanceLock extends com.otaliastudios.cameraview.engine.lock.BaseLock {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.lock.WhiteBalanceLock>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public constructor();
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public checkIsSupported(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public checkShouldSkip(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module mappers {
					export class Camera1Mapper extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.mappers.Camera1Mapper>;
						public mapHdr(param0: com.otaliastudios.cameraview.controls.Hdr): string;
						public mapFlash(param0: com.otaliastudios.cameraview.controls.Flash): string;
						public mapWhiteBalance(param0: com.otaliastudios.cameraview.controls.WhiteBalance): string;
						public unmapHdr(param0: string): com.otaliastudios.cameraview.controls.Hdr;
						public mapFacing(param0: com.otaliastudios.cameraview.controls.Facing): number;
						public static get(): com.otaliastudios.cameraview.engine.mappers.Camera1Mapper;
						public unmapFacing(param0: number): com.otaliastudios.cameraview.controls.Facing;
						public unmapWhiteBalance(param0: string): com.otaliastudios.cameraview.controls.WhiteBalance;
						public unmapFlash(param0: string): com.otaliastudios.cameraview.controls.Flash;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module mappers {
					export class Camera2Mapper extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.mappers.Camera2Mapper>;
						public unmapFlash(param0: number): java.util.Set<com.otaliastudios.cameraview.controls.Flash>;
						public mapFlash(param0: com.otaliastudios.cameraview.controls.Flash): java.util.List<globalAndroid.util.Pair<java.lang.Integer,java.lang.Integer>>;
						public mapFacing(param0: com.otaliastudios.cameraview.controls.Facing): number;
						public unmapFacing(param0: number): com.otaliastudios.cameraview.controls.Facing;
						public static get(): com.otaliastudios.cameraview.engine.mappers.Camera2Mapper;
						public mapWhiteBalance(param0: com.otaliastudios.cameraview.controls.WhiteBalance): number;
						public unmapWhiteBalance(param0: number): com.otaliastudios.cameraview.controls.WhiteBalance;
						public unmapHdr(param0: number): com.otaliastudios.cameraview.controls.Hdr;
						public mapHdr(param0: com.otaliastudios.cameraview.controls.Hdr): number;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export abstract class BaseMeter extends com.otaliastudios.cameraview.engine.action.BaseAction {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.BaseMeter>;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public constructor();
						public setSuccessful(param0: boolean): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public checkIsSupported(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public constructor(param0: java.util.List<globalAndroid.hardware.camera2.params.MeteringRectangle>, param1: boolean);
						public checkShouldSkip(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: java.util.List<globalAndroid.hardware.camera2.params.MeteringRectangle>): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public isSuccessful(): boolean;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export abstract class BaseReset extends com.otaliastudios.cameraview.engine.action.BaseAction {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.BaseReset>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public constructor();
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public constructor(param0: boolean);
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.params.MeteringRectangle): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export class ExposureMeter extends com.otaliastudios.cameraview.engine.meter.BaseMeter {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.ExposureMeter>;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public constructor();
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public checkIsSupported(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public constructor(param0: java.util.List<globalAndroid.hardware.camera2.params.MeteringRectangle>, param1: boolean);
						public checkShouldSkip(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: java.util.List<globalAndroid.hardware.camera2.params.MeteringRectangle>): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export class ExposureReset extends com.otaliastudios.cameraview.engine.meter.BaseReset {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.ExposureReset>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public constructor();
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public constructor(param0: boolean);
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.params.MeteringRectangle): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export class FocusMeter extends com.otaliastudios.cameraview.engine.meter.BaseMeter {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.FocusMeter>;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public constructor();
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public checkIsSupported(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public constructor(param0: java.util.List<globalAndroid.hardware.camera2.params.MeteringRectangle>, param1: boolean);
						public checkShouldSkip(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: java.util.List<globalAndroid.hardware.camera2.params.MeteringRectangle>): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export class FocusReset extends com.otaliastudios.cameraview.engine.meter.BaseReset {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.FocusReset>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public constructor();
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public constructor(param0: boolean);
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.params.MeteringRectangle): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export class MeterAction extends com.otaliastudios.cameraview.engine.action.ActionWrapper {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.MeterAction>;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public constructor();
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public constructor(param0: com.otaliastudios.cameraview.engine.CameraEngine, param1: com.otaliastudios.cameraview.metering.MeteringRegions, param2: boolean);
						public getAction(): com.otaliastudios.cameraview.engine.action.BaseAction;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public isSuccessful(): boolean;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export class MeterResetAction extends com.otaliastudios.cameraview.engine.action.ActionWrapper {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.MeterResetAction>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public constructor();
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public getAction(): com.otaliastudios.cameraview.engine.action.BaseAction;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export class WhiteBalanceMeter extends com.otaliastudios.cameraview.engine.meter.BaseMeter {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.WhiteBalanceMeter>;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public constructor();
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public checkIsSupported(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public constructor(param0: java.util.List<globalAndroid.hardware.camera2.params.MeteringRectangle>, param1: boolean);
						public checkShouldSkip(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): boolean;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: java.util.List<globalAndroid.hardware.camera2.params.MeteringRectangle>): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module meter {
					export class WhiteBalanceReset extends com.otaliastudios.cameraview.engine.meter.BaseReset {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.meter.WhiteBalanceReset>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public constructor();
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public constructor(param0: boolean);
						public onStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.params.MeteringRectangle): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module metering {
					export class Camera1MeteringTransform extends com.otaliastudios.cameraview.metering.MeteringTransform<globalAndroid.hardware.Camera.Area> {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.metering.Camera1MeteringTransform>;
						public static TAG: string;
						public static LOG: com.otaliastudios.cameraview.CameraLogger;
						public transformMeteringRegion(param0: globalAndroid.graphics.RectF, param1: number): any;
						public transformMeteringPoint(param0: globalAndroid.graphics.PointF): globalAndroid.graphics.PointF;
						public constructor(param0: com.otaliastudios.cameraview.engine.offset.Angles, param1: com.otaliastudios.cameraview.size.Size);
						public transformMeteringRegion(param0: globalAndroid.graphics.RectF, param1: number): globalAndroid.hardware.Camera.Area;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module metering {
					export class Camera2MeteringTransform extends com.otaliastudios.cameraview.metering.MeteringTransform<globalAndroid.hardware.camera2.params.MeteringRectangle> {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.metering.Camera2MeteringTransform>;
						public static TAG: string;
						public static LOG: com.otaliastudios.cameraview.CameraLogger;
						public transformMeteringRegion(param0: globalAndroid.graphics.RectF, param1: number): any;
						public transformMeteringPoint(param0: globalAndroid.graphics.PointF): globalAndroid.graphics.PointF;
						public constructor(param0: com.otaliastudios.cameraview.engine.offset.Angles, param1: com.otaliastudios.cameraview.size.Size, param2: com.otaliastudios.cameraview.size.Size, param3: boolean, param4: globalAndroid.hardware.camera2.CameraCharacteristics, param5: globalAndroid.hardware.camera2.CaptureRequest.Builder);
						public transformMeteringRegion(param0: globalAndroid.graphics.RectF, param1: number): globalAndroid.hardware.camera2.params.MeteringRectangle;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module offset {
					export class Angles extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.offset.Angles>;
						public setDeviceOrientation(param0: number): void;
						public offset(param0: com.otaliastudios.cameraview.engine.offset.Reference, param1: com.otaliastudios.cameraview.engine.offset.Reference, param2: com.otaliastudios.cameraview.engine.offset.Axis): number;
						public constructor();
						public setSensorOffset(param0: com.otaliastudios.cameraview.controls.Facing, param1: number): void;
						public flip(param0: com.otaliastudios.cameraview.engine.offset.Reference, param1: com.otaliastudios.cameraview.engine.offset.Reference): boolean;
						public setDisplayOffset(param0: number): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module offset {
					export class Axis {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.offset.Axis>;
						public static ABSOLUTE: com.otaliastudios.cameraview.engine.offset.Axis;
						public static RELATIVE_TO_SENSOR: com.otaliastudios.cameraview.engine.offset.Axis;
						public static values(): native.Array<com.otaliastudios.cameraview.engine.offset.Axis>;
						public static valueOf(param0: string): com.otaliastudios.cameraview.engine.offset.Axis;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module offset {
					export class Reference {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.offset.Reference>;
						public static BASE: com.otaliastudios.cameraview.engine.offset.Reference;
						public static SENSOR: com.otaliastudios.cameraview.engine.offset.Reference;
						public static VIEW: com.otaliastudios.cameraview.engine.offset.Reference;
						public static OUTPUT: com.otaliastudios.cameraview.engine.offset.Reference;
						public static valueOf(param0: string): com.otaliastudios.cameraview.engine.offset.Reference;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static values(): native.Array<com.otaliastudios.cameraview.engine.offset.Reference>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module options {
					export class Camera1Options extends com.otaliastudios.cameraview.CameraOptions {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.options.Camera1Options>;
						public constructor();
						public constructor(param0: globalAndroid.hardware.Camera.Parameters, param1: number, param2: boolean);
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module options {
					export class Camera2Options extends com.otaliastudios.cameraview.CameraOptions {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.options.Camera2Options>;
						public constructor();
						public constructor(param0: globalAndroid.hardware.camera2.CameraManager, param1: string, param2: boolean, param3: number);
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module orchestrator {
					export class CameraOrchestrator extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.orchestrator.CameraOrchestrator>;
						public static TAG: string;
						public static LOG: com.otaliastudios.cameraview.CameraLogger;
						public mCallback: com.otaliastudios.cameraview.engine.orchestrator.CameraOrchestrator.Callback;
						public mJobs: java.util.ArrayDeque<com.otaliastudios.cameraview.engine.orchestrator.CameraOrchestrator.Token>;
						public mLock: any;
						public scheduleDelayed(param0: string, param1: number, param2: java.lang.Runnable): void;
						public remove(param0: string): void;
						public schedule(param0: string, param1: boolean, param2: java.util.concurrent.Callable): com.google.android.gms.tasks.Task;
						public schedule(param0: string, param1: boolean, param2: java.lang.Runnable): com.google.android.gms.tasks.Task<java.lang.Void>;
						public constructor(param0: com.otaliastudios.cameraview.engine.orchestrator.CameraOrchestrator.Callback);
						public reset(): void;
					}
					export module CameraOrchestrator {
						export class Callback extends java.lang.Object {
							public static class: java.lang.Class<com.otaliastudios.cameraview.engine.orchestrator.CameraOrchestrator.Callback>;
							/**
							 * Constructs a new instance of the com.otaliastudios.cameraview.engine.orchestrator.CameraOrchestrator$Callback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								getJobWorker(param0: string): com.otaliastudios.cameraview.internal.WorkerHandler;
								handleJobException(param0: string, param1: java.lang.Exception): void;
							});
							public constructor();
							public handleJobException(param0: string, param1: java.lang.Exception): void;
							public getJobWorker(param0: string): com.otaliastudios.cameraview.internal.WorkerHandler;
						}
						export class Token extends java.lang.Object {
							public static class: java.lang.Class<com.otaliastudios.cameraview.engine.orchestrator.CameraOrchestrator.Token>;
							public name: string;
							public task: com.google.android.gms.tasks.Task<any>;
							public equals(param0: any): boolean;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module orchestrator {
					export class CameraState {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.orchestrator.CameraState>;
						public static OFF: com.otaliastudios.cameraview.engine.orchestrator.CameraState;
						public static ENGINE: com.otaliastudios.cameraview.engine.orchestrator.CameraState;
						public static BIND: com.otaliastudios.cameraview.engine.orchestrator.CameraState;
						public static PREVIEW: com.otaliastudios.cameraview.engine.orchestrator.CameraState;
						public static values(): native.Array<com.otaliastudios.cameraview.engine.orchestrator.CameraState>;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public isAtLeast(param0: com.otaliastudios.cameraview.engine.orchestrator.CameraState): boolean;
						public static valueOf(param0: string): com.otaliastudios.cameraview.engine.orchestrator.CameraState;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module engine {
				export module orchestrator {
					export class CameraStateOrchestrator extends com.otaliastudios.cameraview.engine.orchestrator.CameraOrchestrator {
						public static class: java.lang.Class<com.otaliastudios.cameraview.engine.orchestrator.CameraStateOrchestrator>;
						public hasPendingStateChange(): boolean;
						public scheduleStateChange(param0: com.otaliastudios.cameraview.engine.orchestrator.CameraState, param1: com.otaliastudios.cameraview.engine.orchestrator.CameraState, param2: boolean, param3: java.util.concurrent.Callable): com.google.android.gms.tasks.Task;
						public scheduleStateful(param0: string, param1: com.otaliastudios.cameraview.engine.orchestrator.CameraState, param2: java.lang.Runnable): com.google.android.gms.tasks.Task<java.lang.Void>;
						public scheduleStatefulDelayed(param0: string, param1: com.otaliastudios.cameraview.engine.orchestrator.CameraState, param2: number, param3: java.lang.Runnable): void;
						public constructor(param0: com.otaliastudios.cameraview.engine.orchestrator.CameraOrchestrator.Callback);
						public getTargetState(): com.otaliastudios.cameraview.engine.orchestrator.CameraState;
						public getCurrentState(): com.otaliastudios.cameraview.engine.orchestrator.CameraState;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filter {
				export abstract class BaseFilter extends java.lang.Object implements com.otaliastudios.cameraview.filter.Filter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filter.BaseFilter>;
					public static DEFAULT_VERTEX_POSITION_NAME: string;
					public static DEFAULT_VERTEX_TEXTURE_COORDINATE_NAME: string;
					public static DEFAULT_VERTEX_MVP_MATRIX_NAME: string;
					public static DEFAULT_VERTEX_TRANSFORM_MATRIX_NAME: string;
					public static DEFAULT_FRAGMENT_TEXTURE_COORDINATE_NAME: string;
					public vertexPositionName: string;
					public vertexTextureCoordinateName: string;
					public vertexModelViewProjectionMatrixName: string;
					public vertexTransformMatrixName: string;
					public fragmentTextureCoordinateName: string;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getVertexShader(): string;
					public getFragmentShader(): string;
					public createDefaultFragmentShader(): string;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public createDefaultVertexShader(): string;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public onPostDraw(param0: number): void;
					public onDraw(param0: number): void;
					public onCopy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filter {
				export class Filter extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filter.Filter>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.filter.Filter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						getVertexShader(): string;
						getFragmentShader(): string;
						onCreate(param0: number): void;
						onDestroy(): void;
						draw(param0: number, param1: native.Array<number>): void;
						setSize(param0: number, param1: number): void;
						copy(): com.otaliastudios.cameraview.filter.Filter;
					});
					public constructor();
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getVertexShader(): string;
					public getFragmentShader(): string;
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filter {
				export class FilterParser extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filter.FilterParser>;
					public getFilter(): com.otaliastudios.cameraview.filter.Filter;
					public constructor(param0: globalAndroid.content.res.TypedArray);
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filter {
				export class Filters {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filter.Filters>;
					public static NONE: com.otaliastudios.cameraview.filter.Filters;
					public static AUTO_FIX: com.otaliastudios.cameraview.filter.Filters;
					public static BLACK_AND_WHITE: com.otaliastudios.cameraview.filter.Filters;
					public static BRIGHTNESS: com.otaliastudios.cameraview.filter.Filters;
					public static CONTRAST: com.otaliastudios.cameraview.filter.Filters;
					public static CROSS_PROCESS: com.otaliastudios.cameraview.filter.Filters;
					public static DOCUMENTARY: com.otaliastudios.cameraview.filter.Filters;
					public static DUOTONE: com.otaliastudios.cameraview.filter.Filters;
					public static FILL_LIGHT: com.otaliastudios.cameraview.filter.Filters;
					public static GAMMA: com.otaliastudios.cameraview.filter.Filters;
					public static GRAIN: com.otaliastudios.cameraview.filter.Filters;
					public static GRAYSCALE: com.otaliastudios.cameraview.filter.Filters;
					public static HUE: com.otaliastudios.cameraview.filter.Filters;
					public static INVERT_COLORS: com.otaliastudios.cameraview.filter.Filters;
					public static LOMOISH: com.otaliastudios.cameraview.filter.Filters;
					public static POSTERIZE: com.otaliastudios.cameraview.filter.Filters;
					public static SATURATION: com.otaliastudios.cameraview.filter.Filters;
					public static SEPIA: com.otaliastudios.cameraview.filter.Filters;
					public static SHARPNESS: com.otaliastudios.cameraview.filter.Filters;
					public static TEMPERATURE: com.otaliastudios.cameraview.filter.Filters;
					public static TINT: com.otaliastudios.cameraview.filter.Filters;
					public static VIGNETTE: com.otaliastudios.cameraview.filter.Filters;
					public newInstance(): com.otaliastudios.cameraview.filter.Filter;
					public static valueOf(param0: string): com.otaliastudios.cameraview.filter.Filters;
					public static values(): native.Array<com.otaliastudios.cameraview.filter.Filters>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filter {
				export class MultiFilter extends java.lang.Object implements com.otaliastudios.cameraview.filter.Filter, com.otaliastudios.cameraview.filter.OneParameterFilter, com.otaliastudios.cameraview.filter.TwoParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filter.MultiFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getVertexShader(): string;
					public getFragmentShader(): string;
					public onCreate(param0: number): void;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public setParameter2(param0: number): void;
					public getParameter2(): number;
					public constructor(param0: java.util.Collection<com.otaliastudios.cameraview.filter.Filter>);
					public constructor(param0: native.Array<com.otaliastudios.cameraview.filter.Filter>);
					public addFilter(param0: com.otaliastudios.cameraview.filter.Filter): void;
					public setSize(param0: number, param1: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
				export module MultiFilter {
					export class State extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.filter.MultiFilter.State>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filter {
				export class NoFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filter.NoFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filter {
				export class OneParameterFilter extends java.lang.Object implements com.otaliastudios.cameraview.filter.Filter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filter.OneParameterFilter>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.filter.OneParameterFilter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						setParameter1(param0: number): void;
						getParameter1(): number;
						getVertexShader(): string;
						getFragmentShader(): string;
						onCreate(param0: number): void;
						onDestroy(): void;
						draw(param0: number, param1: native.Array<number>): void;
						setSize(param0: number, param1: number): void;
						copy(): com.otaliastudios.cameraview.filter.Filter;
					});
					public constructor();
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getVertexShader(): string;
					public getFragmentShader(): string;
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filter {
				export class SimpleFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filter.SimpleFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public constructor(param0: string);
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public onCopy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filter {
				export class TwoParameterFilter extends java.lang.Object implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filter.TwoParameterFilter>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.filter.TwoParameterFilter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						setParameter2(param0: number): void;
						getParameter2(): number;
						setParameter1(param0: number): void;
						getParameter1(): number;
						getVertexShader(): string;
						getFragmentShader(): string;
						onCreate(param0: number): void;
						onDestroy(): void;
						draw(param0: number, param1: native.Array<number>): void;
						setSize(param0: number, param1: number): void;
						copy(): com.otaliastudios.cameraview.filter.Filter;
					});
					public constructor();
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getParameter2(): number;
					public getVertexShader(): string;
					public getFragmentShader(): string;
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
					public setParameter2(param0: number): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class AutoFixFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.AutoFixFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public setScale(param0: number): void;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public getScale(): number;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class BlackAndWhiteFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.BlackAndWhiteFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class BrightnessFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.BrightnessFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public setBrightness(param0: number): void;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public getBrightness(): number;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class ContrastFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.ContrastFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public getContrast(): number;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public setContrast(param0: number): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class CrossProcessFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.CrossProcessFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class DocumentaryFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.DocumentaryFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class DuotoneFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.TwoParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.DuotoneFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public setFirstColor(param0: number): void;
					public setSecondColor(param0: number): void;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public getSecondColor(): number;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public setParameter2(param0: number): void;
					public getParameter2(): number;
					public constructor();
					public setColors(param0: number, param1: number): void;
					public setSize(param0: number, param1: number): void;
					public getFirstColor(): number;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class FillLightFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.FillLightFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public getStrength(): number;
					public setStrength(param0: number): void;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class GammaFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.GammaFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getGamma(): number;
					public setGamma(param0: number): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class GrainFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.GrainFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public getStrength(): number;
					public setStrength(param0: number): void;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class GrayscaleFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.GrayscaleFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class HueFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.HueFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public getHue(): number;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public constructor();
					public setHue(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class InvertColorsFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.InvertColorsFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class LomoishFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.LomoishFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class PosterizeFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.PosterizeFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class SaturationFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.SaturationFilter>;
					public setSaturation(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public constructor();
					public getSaturation(): number;
					public setSize(param0: number, param1: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class SepiaFilter extends com.otaliastudios.cameraview.filter.BaseFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.SepiaFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public constructor();
					public onCreate(param0: number): void;
					public setSize(param0: number, param1: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class SharpnessFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.SharpnessFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public setSharpness(param0: number): void;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public getSharpness(): number;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class TemperatureFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.TemperatureFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public constructor();
					public getTemperature(): number;
					public setSize(param0: number, param1: number): void;
					public setTemperature(param0: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class TintFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.OneParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.TintFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public getTint(): number;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public setTint(param0: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module filters {
				export class VignetteFilter extends com.otaliastudios.cameraview.filter.BaseFilter implements com.otaliastudios.cameraview.filter.TwoParameterFilter {
					public static class: java.lang.Class<com.otaliastudios.cameraview.filters.VignetteFilter>;
					public copy(): com.otaliastudios.cameraview.filter.Filter;
					public onPreDraw(param0: number, param1: native.Array<number>): void;
					public setVignetteShade(param0: number): void;
					public getFragmentShader(): string;
					public getVertexShader(): string;
					public getVignetteShade(): number;
					public onCreate(param0: number): void;
					public copy(): com.otaliastudios.cameraview.filter.BaseFilter;
					public onDestroy(): void;
					public setVignetteScale(param0: number): void;
					public getParameter1(): number;
					public setParameter1(param0: number): void;
					public setParameter2(param0: number): void;
					public getParameter2(): number;
					public getVignetteScale(): number;
					public constructor();
					public setSize(param0: number, param1: number): void;
					public draw(param0: number, param1: native.Array<number>): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module frame {
				export class ByteBufferFrameManager extends com.otaliastudios.cameraview.frame.FrameManager<native.Array<number>> {
					public static class: java.lang.Class<com.otaliastudios.cameraview.frame.ByteBufferFrameManager>;
					public onCloneFrameData(param0: native.Array<number>): native.Array<number>;
					public setUp(param0: number, param1: com.otaliastudios.cameraview.size.Size, param2: com.otaliastudios.cameraview.engine.offset.Angles): void;
					public getBuffer(): native.Array<number>;
					public constructor(param0: number, param1: java.lang.Class<any>);
					public constructor(param0: number, param1: com.otaliastudios.cameraview.frame.ByteBufferFrameManager.BufferCallback);
					public onFrameDataReleased(param0: any, param1: boolean): void;
					public onCloneFrameData(param0: any): any;
					public release(): void;
					public onBufferUnused(param0: native.Array<number>): void;
					public onFrameDataReleased(param0: native.Array<number>, param1: boolean): void;
				}
				export module ByteBufferFrameManager {
					export class BufferCallback extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.frame.ByteBufferFrameManager.BufferCallback>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.frame.ByteBufferFrameManager$BufferCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onBufferAvailable(param0: native.Array<number>): void;
						});
						public constructor();
						public onBufferAvailable(param0: native.Array<number>): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module frame {
				export class Frame extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.frame.Frame>;
					public equals(param0: any): boolean;
					/** @deprecated */
					public getRotation(): number;
					public getFormat(): number;
					public getRotationToView(): number;
					public getData(): any;
					public getTime(): number;
					public getRotationToUser(): number;
					public freeze(): com.otaliastudios.cameraview.frame.Frame;
					public getDataClass(): java.lang.Class<any>;
					public release(): void;
					public getSize(): com.otaliastudios.cameraview.size.Size;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module frame {
				export abstract class FrameManager<T>  extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.frame.FrameManager<any>>;
					public static LOG: com.otaliastudios.cameraview.CameraLogger;
					public constructor(param0: number, param1: java.lang.Class<T>);
					public isSetUp(): boolean;
					public onCloneFrameData(param0: T): T;
					public onFrameDataReleased(param0: T, param1: boolean): void;
					public setUp(param0: number, param1: com.otaliastudios.cameraview.size.Size, param2: com.otaliastudios.cameraview.engine.offset.Angles): void;
					public getFrame(param0: T, param1: number): com.otaliastudios.cameraview.frame.Frame;
					public getPoolSize(): number;
					public getFrameBytes(): number;
					public release(): void;
					public getFrameDataClass(): java.lang.Class<T>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module frame {
				export class FrameProcessor extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.frame.FrameProcessor>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.frame.FrameProcessor interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						process(param0: com.otaliastudios.cameraview.frame.Frame): void;
					});
					public constructor();
					public process(param0: com.otaliastudios.cameraview.frame.Frame): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module frame {
				export class ImageFrameManager extends com.otaliastudios.cameraview.frame.FrameManager<globalAndroid.media.Image> {
					public static class: java.lang.Class<com.otaliastudios.cameraview.frame.ImageFrameManager>;
					public onCloneFrameData(param0: globalAndroid.media.Image): globalAndroid.media.Image;
					public constructor(param0: number, param1: java.lang.Class<any>);
					public onFrameDataReleased(param0: any, param1: boolean): void;
					public onFrameDataReleased(param0: globalAndroid.media.Image, param1: boolean): void;
					public onCloneFrameData(param0: any): any;
					public constructor(param0: number);
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module gesture {
				export class Gesture {
					public static class: java.lang.Class<com.otaliastudios.cameraview.gesture.Gesture>;
					public static PINCH: com.otaliastudios.cameraview.gesture.Gesture;
					public static TAP: com.otaliastudios.cameraview.gesture.Gesture;
					public static LONG_TAP: com.otaliastudios.cameraview.gesture.Gesture;
					public static SCROLL_HORIZONTAL: com.otaliastudios.cameraview.gesture.Gesture;
					public static SCROLL_VERTICAL: com.otaliastudios.cameraview.gesture.Gesture;
					public static valueOf(param0: string): com.otaliastudios.cameraview.gesture.Gesture;
					public static values(): native.Array<com.otaliastudios.cameraview.gesture.Gesture>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
					public isAssignableTo(param0: com.otaliastudios.cameraview.gesture.GestureAction): boolean;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module gesture {
				export class GestureAction {
					public static class: java.lang.Class<com.otaliastudios.cameraview.gesture.GestureAction>;
					public static NONE: com.otaliastudios.cameraview.gesture.GestureAction;
					public static AUTO_FOCUS: com.otaliastudios.cameraview.gesture.GestureAction;
					public static TAKE_PICTURE: com.otaliastudios.cameraview.gesture.GestureAction;
					public static ZOOM: com.otaliastudios.cameraview.gesture.GestureAction;
					public static EXPOSURE_CORRECTION: com.otaliastudios.cameraview.gesture.GestureAction;
					public static FILTER_CONTROL_1: com.otaliastudios.cameraview.gesture.GestureAction;
					public static FILTER_CONTROL_2: com.otaliastudios.cameraview.gesture.GestureAction;
					public static valueOf(param0: string): com.otaliastudios.cameraview.gesture.GestureAction;
					public static values(): native.Array<com.otaliastudios.cameraview.gesture.GestureAction>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module gesture {
				export abstract class GestureFinder extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.gesture.GestureFinder>;
					public isActive(): boolean;
					public getController(): com.otaliastudios.cameraview.gesture.GestureFinder.Controller;
					public handleTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
					public getPoint(param0: number): globalAndroid.graphics.PointF;
					public computeValue(param0: number, param1: number, param2: number): number;
					public onTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
					public getGesture(): com.otaliastudios.cameraview.gesture.Gesture;
					public setActive(param0: boolean): void;
					public getValue(param0: number, param1: number, param2: number): number;
					public setGesture(param0: com.otaliastudios.cameraview.gesture.Gesture): void;
					public getPoints(): native.Array<globalAndroid.graphics.PointF>;
				}
				export module GestureFinder {
					export class Controller extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.gesture.GestureFinder.Controller>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.gesture.GestureFinder$Controller interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							getContext(): globalAndroid.content.Context;
							getWidth(): number;
							getHeight(): number;
						});
						public constructor();
						public getWidth(): number;
						public getContext(): globalAndroid.content.Context;
						public getHeight(): number;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module gesture {
				export class GestureParser extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.gesture.GestureParser>;
					public getHorizontalScrollAction(): com.otaliastudios.cameraview.gesture.GestureAction;
					public constructor(param0: globalAndroid.content.res.TypedArray);
					public getLongTapAction(): com.otaliastudios.cameraview.gesture.GestureAction;
					public getTapAction(): com.otaliastudios.cameraview.gesture.GestureAction;
					public getPinchAction(): com.otaliastudios.cameraview.gesture.GestureAction;
					public getVerticalScrollAction(): com.otaliastudios.cameraview.gesture.GestureAction;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module gesture {
				export class GestureType {
					public static class: java.lang.Class<com.otaliastudios.cameraview.gesture.GestureType>;
					public static ONE_SHOT: com.otaliastudios.cameraview.gesture.GestureType;
					public static CONTINUOUS: com.otaliastudios.cameraview.gesture.GestureType;
					public static valueOf(param0: string): com.otaliastudios.cameraview.gesture.GestureType;
					public static values(): native.Array<com.otaliastudios.cameraview.gesture.GestureType>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module gesture {
				export class PinchGestureFinder extends com.otaliastudios.cameraview.gesture.GestureFinder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.gesture.PinchGestureFinder>;
					public handleTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
					public constructor(param0: com.otaliastudios.cameraview.gesture.GestureFinder.Controller);
					public getFactor(): number;
					public getValue(param0: number, param1: number, param2: number): number;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module gesture {
				export class ScrollGestureFinder extends com.otaliastudios.cameraview.gesture.GestureFinder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.gesture.ScrollGestureFinder>;
					public handleTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
					public constructor(param0: com.otaliastudios.cameraview.gesture.GestureFinder.Controller);
					public getFactor(): number;
					public getValue(param0: number, param1: number, param2: number): number;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module gesture {
				export class TapGestureFinder extends com.otaliastudios.cameraview.gesture.GestureFinder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.gesture.TapGestureFinder>;
					public handleTouchEvent(param0: globalAndroid.view.MotionEvent): boolean;
					public constructor(param0: com.otaliastudios.cameraview.gesture.GestureFinder.Controller);
					public getValue(param0: number, param1: number, param2: number): number;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class CamcorderProfiles extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.CamcorderProfiles>;
					public static get(param0: string, param1: com.otaliastudios.cameraview.size.Size): globalAndroid.media.CamcorderProfile;
					public constructor();
					public static get(param0: number, param1: com.otaliastudios.cameraview.size.Size): globalAndroid.media.CamcorderProfile;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class CropHelper extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.CropHelper>;
					public constructor();
					public static computeCrop(param0: com.otaliastudios.cameraview.size.Size, param1: com.otaliastudios.cameraview.size.AspectRatio): globalAndroid.graphics.Rect;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class DeviceEncoders extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.DeviceEncoders>;
					public static MODE_RESPECT_ORDER: number;
					public static MODE_PREFER_HARDWARE: number;
					public getSupportedVideoFrameRate(param0: com.otaliastudios.cameraview.size.Size, param1: number): number;
					public getSupportedAudioBitRate(param0: number): number;
					public getAudioEncoder(): string;
					public constructor(param0: number, param1: string, param2: string, param3: number, param4: number);
					public tryConfigureVideo(param0: string, param1: com.otaliastudios.cameraview.size.Size, param2: number, param3: number): void;
					public getVideoEncoder(): string;
					public getSupportedVideoSize(param0: com.otaliastudios.cameraview.size.Size): com.otaliastudios.cameraview.size.Size;
					public getSupportedVideoBitRate(param0: number): number;
					public tryConfigureAudio(param0: string, param1: number, param2: number, param3: number): void;
				}
				export module DeviceEncoders {
					export class AudioException extends java.lang.RuntimeException {
						public static class: java.lang.Class<com.otaliastudios.cameraview.internal.DeviceEncoders.AudioException>;
					}
					export class VideoException extends java.lang.RuntimeException {
						public static class: java.lang.Class<com.otaliastudios.cameraview.internal.DeviceEncoders.VideoException>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class ExifHelper extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.ExifHelper>;
					public static getOrientation(param0: number): number;
					public constructor();
					public static getExifOrientation(param0: number): number;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class GlTextureDrawer extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.GlTextureDrawer>;
					public setFilter(param0: com.otaliastudios.cameraview.filter.Filter): void;
					public constructor();
					public getTexture(): com.otaliastudios.opengl.texture.GlTexture;
					public setTextureTransform(param0: native.Array<number>): void;
					public constructor(param0: com.otaliastudios.opengl.texture.GlTexture);
					public getTextureTransform(): native.Array<number>;
					public draw(param0: number): void;
					public release(): void;
					public constructor(param0: number);
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class GridLinesLayout extends globalAndroid.view.View {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.GridLinesLayout>;
					public static DEFAULT_COLOR: number;
					public onKeyDown(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
					public onDraw(param0: globalAndroid.graphics.Canvas): void;
					public getGridMode(): com.otaliastudios.cameraview.controls.Grid;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number);
					public sendAccessibilityEventUnchecked(param0: globalAndroid.view.accessibility.AccessibilityEvent): void;
					public onKeyMultiple(param0: number, param1: number, param2: globalAndroid.view.KeyEvent): boolean;
					public constructor(param0: globalAndroid.content.Context);
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet);
					public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable): void;
					public onKeyLongPress(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
					public onKeyUp(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
					public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number, param3: number);
					public onLayout(param0: boolean, param1: number, param2: number, param3: number, param4: number): void;
					public invalidateDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
					public scheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable, param2: number): void;
					public getGridColor(): number;
					public sendAccessibilityEvent(param0: number): void;
					public setGridColor(param0: number): void;
					public setGridMode(param0: com.otaliastudios.cameraview.controls.Grid): void;
				}
				export module GridLinesLayout {
					export class DrawCallback extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.internal.GridLinesLayout.DrawCallback>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.internal.GridLinesLayout$DrawCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onDraw(param0: number): void;
						});
						public constructor();
						public onDraw(param0: number): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class Issue514Workaround extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.Issue514Workaround>;
					public end(): void;
					public constructor(param0: number);
					public beforeOverlayUpdateTexImage(): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class OrientationHelper extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.OrientationHelper>;
					public disable(): void;
					public getLastDeviceOrientation(): number;
					public constructor(param0: globalAndroid.content.Context, param1: com.otaliastudios.cameraview.internal.OrientationHelper.Callback);
					public enable(): void;
					public getLastDisplayOffset(): number;
				}
				export module OrientationHelper {
					export class Callback extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.internal.OrientationHelper.Callback>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.internal.OrientationHelper$Callback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onDeviceOrientationChanged(param0: number): void;
							onDisplayOffsetChanged(param0: number, param1: boolean): void;
						});
						public constructor();
						public onDeviceOrientationChanged(param0: number): void;
						public onDisplayOffsetChanged(param0: number, param1: boolean): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class Pool<T>  extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.Pool<any>>;
					public toString(): string;
					public constructor(param0: number, param1: com.otaliastudios.cameraview.internal.Pool.Factory<T>);
					public isEmpty(): boolean;
					public activeCount(): number;
					public clear(): void;
					public count(): number;
					public recycle(param0: T): void;
					public recycledCount(): number;
					public get(): T;
				}
				export module Pool {
					export class Factory<T>  extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.internal.Pool.Factory<any>>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.internal.Pool$Factory interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							create(): T;
						});
						public constructor();
						public create(): T;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class RotationHelper extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.RotationHelper>;
					public static rotate(param0: native.Array<number>, param1: com.otaliastudios.cameraview.size.Size, param2: number): native.Array<number>;
					public constructor();
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module internal {
				export class WorkerHandler extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.internal.WorkerHandler>;
					public run(param0: java.lang.Runnable): void;
					public getExecutor(): java.util.concurrent.Executor;
					public remove(param0: java.lang.Runnable): void;
					public static destroyAll(): void;
					public post(param0: number, param1: java.lang.Runnable): void;
					public getThread(): globalAndroid.os.HandlerThread;
					public static get(): com.otaliastudios.cameraview.internal.WorkerHandler;
					public getLooper(): globalAndroid.os.Looper;
					public post(param0: java.lang.Runnable): void;
					public run(param0: java.util.concurrent.Callable): com.google.android.gms.tasks.Task;
					public destroy(): void;
					public static execute(param0: java.lang.Runnable): void;
					public post(param0: java.util.concurrent.Callable): com.google.android.gms.tasks.Task;
					public static get(param0: string): com.otaliastudios.cameraview.internal.WorkerHandler;
					public getHandler(): globalAndroid.os.Handler;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module markers {
				export class AutoFocusMarker extends java.lang.Object implements com.otaliastudios.cameraview.markers.Marker {
					public static class: java.lang.Class<com.otaliastudios.cameraview.markers.AutoFocusMarker>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.markers.AutoFocusMarker interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onAutoFocusStart(param0: com.otaliastudios.cameraview.markers.AutoFocusTrigger, param1: globalAndroid.graphics.PointF): void;
						onAutoFocusEnd(param0: com.otaliastudios.cameraview.markers.AutoFocusTrigger, param1: boolean, param2: globalAndroid.graphics.PointF): void;
						onAttach(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): globalAndroid.view.View;
					});
					public constructor();
					public onAutoFocusStart(param0: com.otaliastudios.cameraview.markers.AutoFocusTrigger, param1: globalAndroid.graphics.PointF): void;
					public onAttach(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): globalAndroid.view.View;
					public onAutoFocusEnd(param0: com.otaliastudios.cameraview.markers.AutoFocusTrigger, param1: boolean, param2: globalAndroid.graphics.PointF): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module markers {
				export class AutoFocusTrigger {
					public static class: java.lang.Class<com.otaliastudios.cameraview.markers.AutoFocusTrigger>;
					public static GESTURE: com.otaliastudios.cameraview.markers.AutoFocusTrigger;
					public static METHOD: com.otaliastudios.cameraview.markers.AutoFocusTrigger;
					public static valueOf(param0: string): com.otaliastudios.cameraview.markers.AutoFocusTrigger;
					public static values(): native.Array<com.otaliastudios.cameraview.markers.AutoFocusTrigger>;
					public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module markers {
				export class DefaultAutoFocusMarker extends java.lang.Object implements com.otaliastudios.cameraview.markers.AutoFocusMarker {
					public static class: java.lang.Class<com.otaliastudios.cameraview.markers.DefaultAutoFocusMarker>;
					public onAutoFocusStart(param0: com.otaliastudios.cameraview.markers.AutoFocusTrigger, param1: globalAndroid.graphics.PointF): void;
					public onAttach(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): globalAndroid.view.View;
					public constructor();
					public onAutoFocusEnd(param0: com.otaliastudios.cameraview.markers.AutoFocusTrigger, param1: boolean, param2: globalAndroid.graphics.PointF): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module markers {
				export class Marker extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.markers.Marker>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.markers.Marker interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onAttach(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): globalAndroid.view.View;
					});
					public constructor();
					public onAttach(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): globalAndroid.view.View;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module markers {
				export class MarkerLayout extends globalAndroid.widget.FrameLayout {
					public static class: java.lang.Class<com.otaliastudios.cameraview.markers.MarkerLayout>;
					public static TYPE_AUTOFOCUS: number;
					public onEvent(param0: number, param1: native.Array<globalAndroid.graphics.PointF>): void;
					public focusSearch(param0: number): globalAndroid.view.View;
					public focusableViewAvailable(param0: globalAndroid.view.View): void;
					public createContextMenu(param0: globalAndroid.view.ContextMenu): void;
					public isLayoutRequested(): boolean;
					public isTextDirectionResolved(): boolean;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet);
					public isLayoutDirectionResolved(): boolean;
					public addView(param0: globalAndroid.view.View, param1: number, param2: number): void;
					public onKeyUp(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
					public addView(param0: globalAndroid.view.View): void;
					public addView(param0: globalAndroid.view.View, param1: number, param2: globalAndroid.view.ViewGroup.LayoutParams): void;
					public focusSearch(param0: globalAndroid.view.View, param1: number): globalAndroid.view.View;
					public keyboardNavigationClusterSearch(param0: globalAndroid.view.View, param1: number): globalAndroid.view.View;
					public recomputeViewAttributes(param0: globalAndroid.view.View): void;
					public onNestedPreFling(param0: globalAndroid.view.View, param1: number, param2: number): boolean;
					public clearChildFocus(param0: globalAndroid.view.View): void;
					public onNestedScroll(param0: globalAndroid.view.View, param1: number, param2: number, param3: number, param4: number): void;
					public getLayoutDirection(): number;
					/** @deprecated */
					public invalidateChild(param0: globalAndroid.view.View, param1: globalAndroid.graphics.Rect): void;
					public getChildVisibleRect(param0: globalAndroid.view.View, param1: globalAndroid.graphics.Rect, param2: globalAndroid.graphics.Point): boolean;
					public startActionModeForChild(param0: globalAndroid.view.View, param1: globalAndroid.view.ActionMode.Callback, param2: number): globalAndroid.view.ActionMode;
					public bringChildToFront(param0: globalAndroid.view.View): void;
					public showContextMenuForChild(param0: globalAndroid.view.View, param1: number, param2: number): boolean;
					public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable): void;
					public requestTransparentRegion(param0: globalAndroid.view.View): void;
					/** @deprecated */
					public invalidateChildInParent(param0: native.Array<number>, param1: globalAndroid.graphics.Rect): globalAndroid.view.ViewParent;
					public onKeyLongPress(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number, param3: number);
					public childDrawableStateChanged(param0: globalAndroid.view.View): void;
					public getTextDirection(): number;
					public scheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable, param2: number): void;
					public requestFitSystemWindows(): void;
					public notifySubtreeAccessibilityStateChanged(param0: globalAndroid.view.View, param1: globalAndroid.view.View, param2: number): void;
					public onMarker(param0: number, param1: com.otaliastudios.cameraview.markers.Marker): void;
					public getParent(): globalAndroid.view.ViewParent;
					public isTextAlignmentResolved(): boolean;
					public startActionModeForChild(param0: globalAndroid.view.View, param1: globalAndroid.view.ActionMode.Callback): globalAndroid.view.ActionMode;
					public canResolveTextAlignment(): boolean;
					public childHasTransientStateChanged(param0: globalAndroid.view.View, param1: boolean): void;
					/** @deprecated */
					public requestFitSystemWindows(): void;
					public onDescendantInvalidated(param0: globalAndroid.view.View, param1: globalAndroid.view.View): void;
					public canResolveTextDirection(): boolean;
					public updateViewLayout(param0: globalAndroid.view.View, param1: globalAndroid.view.ViewGroup.LayoutParams): void;
					public requestChildFocus(param0: globalAndroid.view.View, param1: globalAndroid.view.View): void;
					public onStartNestedScroll(param0: globalAndroid.view.View, param1: globalAndroid.view.View, param2: number): boolean;
					public requestDisallowInterceptTouchEvent(param0: boolean): void;
					public onNestedFling(param0: globalAndroid.view.View, param1: number, param2: number, param3: boolean): boolean;
					public addView(param0: globalAndroid.view.View, param1: number): void;
					public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
					public addView(param0: globalAndroid.view.View, param1: globalAndroid.view.ViewGroup.LayoutParams): void;
					public onNestedPreScroll(param0: globalAndroid.view.View, param1: number, param2: number, param3: native.Array<number>): void;
					public sendAccessibilityEvent(param0: number): void;
					public requestLayout(): void;
					public requestSendAccessibilityEvent(param0: globalAndroid.view.View, param1: globalAndroid.view.accessibility.AccessibilityEvent): boolean;
					public getParentForAccessibility(): globalAndroid.view.ViewParent;
					public onKeyDown(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
					public canResolveLayoutDirection(): boolean;
					public getTextAlignment(): number;
					public onNestedScrollAccepted(param0: globalAndroid.view.View, param1: globalAndroid.view.View, param2: number): void;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number);
					public showContextMenuForChild(param0: globalAndroid.view.View): boolean;
					public sendAccessibilityEventUnchecked(param0: globalAndroid.view.accessibility.AccessibilityEvent): void;
					public onKeyMultiple(param0: number, param1: number, param2: globalAndroid.view.KeyEvent): boolean;
					public removeView(param0: globalAndroid.view.View): void;
					public constructor(param0: globalAndroid.content.Context);
					public onStopNestedScroll(param0: globalAndroid.view.View): void;
					public onNestedPrePerformAccessibilityAction(param0: globalAndroid.view.View, param1: number, param2: globalAndroid.os.Bundle): boolean;
					public invalidateDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
					public requestChildRectangleOnScreen(param0: globalAndroid.view.View, param1: globalAndroid.graphics.Rect, param2: boolean): boolean;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module markers {
				export class MarkerParser extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.markers.MarkerParser>;
					public getAutoFocusMarker(): com.otaliastudios.cameraview.markers.AutoFocusMarker;
					public constructor(param0: globalAndroid.content.res.TypedArray);
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module metering {
				export class MeteringRegion extends java.lang.Comparable<com.otaliastudios.cameraview.metering.MeteringRegion> {
					public static class: java.lang.Class<com.otaliastudios.cameraview.metering.MeteringRegion>;
					public compareTo(param0: com.otaliastudios.cameraview.metering.MeteringRegion): number;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module metering {
				export class MeteringRegions extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.metering.MeteringRegions>;
					public get(param0: number, param1: com.otaliastudios.cameraview.metering.MeteringTransform<any>): java.util.List;
					public static fromPoint(param0: com.otaliastudios.cameraview.size.Size, param1: globalAndroid.graphics.PointF, param2: number): com.otaliastudios.cameraview.metering.MeteringRegions;
					public static fromPoint(param0: com.otaliastudios.cameraview.size.Size, param1: globalAndroid.graphics.PointF): com.otaliastudios.cameraview.metering.MeteringRegions;
					public static fromArea(param0: com.otaliastudios.cameraview.size.Size, param1: globalAndroid.graphics.RectF, param2: number, param3: boolean): com.otaliastudios.cameraview.metering.MeteringRegions;
					public transform(param0: com.otaliastudios.cameraview.metering.MeteringTransform<any>): com.otaliastudios.cameraview.metering.MeteringRegions;
					public static fromArea(param0: com.otaliastudios.cameraview.size.Size, param1: globalAndroid.graphics.RectF, param2: number): com.otaliastudios.cameraview.metering.MeteringRegions;
					public static fromArea(param0: com.otaliastudios.cameraview.size.Size, param1: globalAndroid.graphics.RectF): com.otaliastudios.cameraview.metering.MeteringRegions;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module metering {
				export class MeteringTransform<T>  extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.metering.MeteringTransform<any>>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.metering.MeteringTransform<any> interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						transformMeteringPoint(param0: globalAndroid.graphics.PointF): globalAndroid.graphics.PointF;
						transformMeteringRegion(param0: globalAndroid.graphics.RectF, param1: number): T;
					});
					public constructor();
					public transformMeteringRegion(param0: globalAndroid.graphics.RectF, param1: number): T;
					public transformMeteringPoint(param0: globalAndroid.graphics.PointF): globalAndroid.graphics.PointF;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module overlay {
				export class Overlay extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.overlay.Overlay>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.overlay.Overlay interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						drawOn(param0: com.otaliastudios.cameraview.overlay.Overlay.Target, param1: globalAndroid.graphics.Canvas): void;
						drawsOn(param0: com.otaliastudios.cameraview.overlay.Overlay.Target): boolean;
					});
					public constructor();
					public drawOn(param0: com.otaliastudios.cameraview.overlay.Overlay.Target, param1: globalAndroid.graphics.Canvas): void;
					public drawsOn(param0: com.otaliastudios.cameraview.overlay.Overlay.Target): boolean;
				}
				export module Overlay {
					export class Target {
						public static class: java.lang.Class<com.otaliastudios.cameraview.overlay.Overlay.Target>;
						public static PREVIEW: com.otaliastudios.cameraview.overlay.Overlay.Target;
						public static PICTURE_SNAPSHOT: com.otaliastudios.cameraview.overlay.Overlay.Target;
						public static VIDEO_SNAPSHOT: com.otaliastudios.cameraview.overlay.Overlay.Target;
						public static valueOf(param0: java.lang.Class<any>, param1: string): java.lang.Enum<any>;
						public static valueOf(param0: string): com.otaliastudios.cameraview.overlay.Overlay.Target;
						public static values(): native.Array<com.otaliastudios.cameraview.overlay.Overlay.Target>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module overlay {
				export class OverlayDrawer extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.overlay.OverlayDrawer>;
					public constructor(param0: com.otaliastudios.cameraview.overlay.Overlay, param1: com.otaliastudios.cameraview.size.Size);
					public draw(param0: com.otaliastudios.cameraview.overlay.Overlay.Target): void;
					public render(param0: number): void;
					public release(): void;
					public getTransform(): native.Array<number>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module overlay {
				export class OverlayLayout extends globalAndroid.widget.FrameLayout implements com.otaliastudios.cameraview.overlay.Overlay {
					public static class: java.lang.Class<com.otaliastudios.cameraview.overlay.OverlayLayout>;
					public focusSearch(param0: number): globalAndroid.view.View;
					public focusableViewAvailable(param0: globalAndroid.view.View): void;
					public createContextMenu(param0: globalAndroid.view.ContextMenu): void;
					public isLayoutRequested(): boolean;
					public generateLayoutParams(param0: globalAndroid.view.ViewGroup.LayoutParams): globalAndroid.view.ViewGroup.LayoutParams;
					public isTextDirectionResolved(): boolean;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet);
					public isLayoutDirectionResolved(): boolean;
					public addView(param0: globalAndroid.view.View, param1: number, param2: number): void;
					public onKeyUp(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
					public addView(param0: globalAndroid.view.View): void;
					public drawChild(param0: globalAndroid.graphics.Canvas, param1: globalAndroid.view.View, param2: number): boolean;
					public addView(param0: globalAndroid.view.View, param1: number, param2: globalAndroid.view.ViewGroup.LayoutParams): void;
					public focusSearch(param0: globalAndroid.view.View, param1: number): globalAndroid.view.View;
					public keyboardNavigationClusterSearch(param0: globalAndroid.view.View, param1: number): globalAndroid.view.View;
					public recomputeViewAttributes(param0: globalAndroid.view.View): void;
					public onNestedPreFling(param0: globalAndroid.view.View, param1: number, param2: number): boolean;
					public isOverlay(param0: globalAndroid.util.AttributeSet): boolean;
					public clearChildFocus(param0: globalAndroid.view.View): void;
					public onNestedScroll(param0: globalAndroid.view.View, param1: number, param2: number, param3: number, param4: number): void;
					public getLayoutDirection(): number;
					/** @deprecated */
					public invalidateChild(param0: globalAndroid.view.View, param1: globalAndroid.graphics.Rect): void;
					public getChildVisibleRect(param0: globalAndroid.view.View, param1: globalAndroid.graphics.Rect, param2: globalAndroid.graphics.Point): boolean;
					public startActionModeForChild(param0: globalAndroid.view.View, param1: globalAndroid.view.ActionMode.Callback, param2: number): globalAndroid.view.ActionMode;
					public bringChildToFront(param0: globalAndroid.view.View): void;
					public showContextMenuForChild(param0: globalAndroid.view.View, param1: number, param2: number): boolean;
					public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable): void;
					public requestTransparentRegion(param0: globalAndroid.view.View): void;
					/** @deprecated */
					public invalidateChildInParent(param0: native.Array<number>, param1: globalAndroid.graphics.Rect): globalAndroid.view.ViewParent;
					public onKeyLongPress(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number, param3: number);
					public childDrawableStateChanged(param0: globalAndroid.view.View): void;
					public getTextDirection(): number;
					public scheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable, param1: java.lang.Runnable, param2: number): void;
					public drawsOn(param0: com.otaliastudios.cameraview.overlay.Overlay.Target): boolean;
					public requestFitSystemWindows(): void;
					public notifySubtreeAccessibilityStateChanged(param0: globalAndroid.view.View, param1: globalAndroid.view.View, param2: number): void;
					public getParent(): globalAndroid.view.ViewParent;
					public isTextAlignmentResolved(): boolean;
					public startActionModeForChild(param0: globalAndroid.view.View, param1: globalAndroid.view.ActionMode.Callback): globalAndroid.view.ActionMode;
					public canResolveTextAlignment(): boolean;
					public childHasTransientStateChanged(param0: globalAndroid.view.View, param1: boolean): void;
					/** @deprecated */
					public requestFitSystemWindows(): void;
					public onDescendantInvalidated(param0: globalAndroid.view.View, param1: globalAndroid.view.View): void;
					public canResolveTextDirection(): boolean;
					public updateViewLayout(param0: globalAndroid.view.View, param1: globalAndroid.view.ViewGroup.LayoutParams): void;
					public requestChildFocus(param0: globalAndroid.view.View, param1: globalAndroid.view.View): void;
					public onStartNestedScroll(param0: globalAndroid.view.View, param1: globalAndroid.view.View, param2: number): boolean;
					public requestDisallowInterceptTouchEvent(param0: boolean): void;
					public onNestedFling(param0: globalAndroid.view.View, param1: number, param2: number, param3: boolean): boolean;
					public isOverlay(param0: globalAndroid.view.ViewGroup.LayoutParams): boolean;
					public addView(param0: globalAndroid.view.View, param1: number): void;
					public unscheduleDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
					public addView(param0: globalAndroid.view.View, param1: globalAndroid.view.ViewGroup.LayoutParams): void;
					public drawOn(param0: com.otaliastudios.cameraview.overlay.Overlay.Target, param1: globalAndroid.graphics.Canvas): void;
					public onNestedPreScroll(param0: globalAndroid.view.View, param1: number, param2: number, param3: native.Array<number>): void;
					public sendAccessibilityEvent(param0: number): void;
					public requestLayout(): void;
					public requestSendAccessibilityEvent(param0: globalAndroid.view.View, param1: globalAndroid.view.accessibility.AccessibilityEvent): boolean;
					public getParentForAccessibility(): globalAndroid.view.ViewParent;
					public onKeyDown(param0: number, param1: globalAndroid.view.KeyEvent): boolean;
					public canResolveLayoutDirection(): boolean;
					public getTextAlignment(): number;
					public onNestedScrollAccepted(param0: globalAndroid.view.View, param1: globalAndroid.view.View, param2: number): void;
					public generateLayoutParams(param0: globalAndroid.util.AttributeSet): globalAndroid.view.ViewGroup.LayoutParams;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet, param2: number);
					public showContextMenuForChild(param0: globalAndroid.view.View): boolean;
					public sendAccessibilityEventUnchecked(param0: globalAndroid.view.accessibility.AccessibilityEvent): void;
					public onKeyMultiple(param0: number, param1: number, param2: globalAndroid.view.KeyEvent): boolean;
					public removeView(param0: globalAndroid.view.View): void;
					public constructor(param0: globalAndroid.content.Context);
					public onStopNestedScroll(param0: globalAndroid.view.View): void;
					public generateLayoutParams(param0: globalAndroid.util.AttributeSet): com.otaliastudios.cameraview.overlay.OverlayLayout.LayoutParams;
					public onNestedPrePerformAccessibilityAction(param0: globalAndroid.view.View, param1: number, param2: globalAndroid.os.Bundle): boolean;
					public draw(param0: globalAndroid.graphics.Canvas): void;
					public invalidateDrawable(param0: globalAndroid.graphics.drawable.Drawable): void;
					public generateLayoutParams(param0: globalAndroid.util.AttributeSet): globalAndroid.widget.FrameLayout.LayoutParams;
					public requestChildRectangleOnScreen(param0: globalAndroid.view.View, param1: globalAndroid.graphics.Rect, param2: boolean): boolean;
				}
				export module OverlayLayout {
					export class LayoutParams extends globalAndroid.widget.FrameLayout.LayoutParams {
						public static class: java.lang.Class<com.otaliastudios.cameraview.overlay.OverlayLayout.LayoutParams>;
						public drawOnPreview: boolean;
						public drawOnPictureSnapshot: boolean;
						public drawOnVideoSnapshot: boolean;
						public constructor(param0: globalAndroid.view.ViewGroup.LayoutParams);
						public constructor(param0: globalAndroid.view.ViewGroup.MarginLayoutParams);
						public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.util.AttributeSet);
						public constructor(param0: number, param1: number, param2: number);
						public constructor(param0: number, param1: number);
						public toString(): string;
						public constructor(param0: globalAndroid.widget.FrameLayout.LayoutParams);
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module picture {
				export class Full1PictureRecorder extends com.otaliastudios.cameraview.picture.FullPictureRecorder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.picture.Full1PictureRecorder>;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener);
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.engine.Camera1Engine, param2: globalAndroid.hardware.Camera);
					public take(): void;
					public dispatchResult(): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module picture {
				export class Full2PictureRecorder extends com.otaliastudios.cameraview.picture.FullPictureRecorder implements globalAndroid.media.ImageReader.OnImageAvailableListener {
					public static class: java.lang.Class<com.otaliastudios.cameraview.picture.Full2PictureRecorder>;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener);
					public take(): void;
					public onImageAvailable(param0: globalAndroid.media.ImageReader): void;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.engine.Camera2Engine, param2: globalAndroid.hardware.camera2.CaptureRequest.Builder, param3: globalAndroid.media.ImageReader);
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module picture {
				export abstract class FullPictureRecorder extends com.otaliastudios.cameraview.picture.PictureRecorder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.picture.FullPictureRecorder>;
					public static LOG: com.otaliastudios.cameraview.CameraLogger;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener);
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module picture {
				export abstract class PictureRecorder extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.picture.PictureRecorder>;
					public mError: java.lang.Exception;
					public dispatchOnShutter(param0: boolean): void;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener);
					public take(): void;
					public dispatchResult(): void;
				}
				export module PictureRecorder {
					export class PictureResultListener extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.picture.PictureRecorder$PictureResultListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onPictureShutter(param0: boolean): void;
							onPictureResult(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: java.lang.Exception): void;
						});
						public constructor();
						public onPictureShutter(param0: boolean): void;
						public onPictureResult(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: java.lang.Exception): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module picture {
				export class Snapshot1PictureRecorder extends com.otaliastudios.cameraview.picture.SnapshotPictureRecorder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.picture.Snapshot1PictureRecorder>;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.engine.Camera1Engine, param2: globalAndroid.hardware.Camera, param3: com.otaliastudios.cameraview.size.AspectRatio);
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener);
					public take(): void;
					public dispatchResult(): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module picture {
				export class Snapshot2PictureRecorder extends com.otaliastudios.cameraview.picture.SnapshotGlPictureRecorder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.picture.Snapshot2PictureRecorder>;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener);
					public take(): void;
					public dispatchResult(): void;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.engine.Camera2Engine, param2: com.otaliastudios.cameraview.preview.RendererCameraPreview, param3: com.otaliastudios.cameraview.size.AspectRatio);
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener, param2: com.otaliastudios.cameraview.preview.RendererCameraPreview, param3: com.otaliastudios.cameraview.size.AspectRatio, param4: com.otaliastudios.cameraview.overlay.Overlay);
				}
				export module Snapshot2PictureRecorder {
					export class FlashAction extends com.otaliastudios.cameraview.engine.action.BaseAction {
						public static class: java.lang.Class<com.otaliastudios.cameraview.picture.Snapshot2PictureRecorder.FlashAction>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
					export class ResetFlashAction extends com.otaliastudios.cameraview.engine.action.BaseAction {
						public static class: java.lang.Class<com.otaliastudios.cameraview.picture.Snapshot2PictureRecorder.ResetFlashAction>;
						public onCaptureProgressed(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.CaptureResult): void;
						public abort(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public onCaptureCompleted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest, param2: globalAndroid.hardware.camera2.TotalCaptureResult): void;
						public start(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
						public removeCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public getState(): number;
						public addCallback(param0: com.otaliastudios.cameraview.engine.action.ActionCallback): void;
						public onCaptureStarted(param0: com.otaliastudios.cameraview.engine.action.ActionHolder, param1: globalAndroid.hardware.camera2.CaptureRequest): void;
						public onStart(param0: com.otaliastudios.cameraview.engine.action.ActionHolder): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module picture {
				export class SnapshotGlPictureRecorder extends com.otaliastudios.cameraview.picture.SnapshotPictureRecorder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.picture.SnapshotGlPictureRecorder>;
					public onRendererFilterChanged(param0: com.otaliastudios.cameraview.filter.Filter): void;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener);
					public take(): void;
					public onRendererFrame(param0: globalAndroid.graphics.SurfaceTexture, param1: number, param2: number, param3: number): void;
					public takeFrame(param0: globalAndroid.graphics.SurfaceTexture, param1: number, param2: number, param3: number, param4: globalAndroid.opengl.EGLContext): void;
					public dispatchResult(): void;
					public onRendererTextureCreated(param0: number): void;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener, param2: com.otaliastudios.cameraview.preview.RendererCameraPreview, param3: com.otaliastudios.cameraview.size.AspectRatio, param4: com.otaliastudios.cameraview.overlay.Overlay);
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module picture {
				export abstract class SnapshotPictureRecorder extends com.otaliastudios.cameraview.picture.PictureRecorder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.picture.SnapshotPictureRecorder>;
					public static LOG: com.otaliastudios.cameraview.CameraLogger;
					public constructor(param0: com.otaliastudios.cameraview.PictureResult.Stub, param1: com.otaliastudios.cameraview.picture.PictureRecorder.PictureResultListener);
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module preview {
				export abstract class CameraPreview<T, Output>  extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.preview.CameraPreview<any,any>>;
					public static LOG: com.otaliastudios.cameraview.CameraLogger;
					public mCropping: boolean;
					public mOutputSurfaceWidth: number;
					public mOutputSurfaceHeight: number;
					public mInputStreamWidth: number;
					public mInputStreamHeight: number;
					public mDrawRotation: number;
					public setDrawRotation(param0: number): void;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup);
					public dispatchOnSurfaceAvailable(param0: number, param1: number): void;
					public onDestroyView(): void;
					public onDestroy(): void;
					public getView(): T;
					public supportsCropping(): boolean;
					public onResume(): void;
					public getOutput(): Output;
					public crop(param0: com.otaliastudios.cameraview.preview.CameraPreview.CropCallback): void;
					public setSurfaceCallback(param0: com.otaliastudios.cameraview.preview.CameraPreview.SurfaceCallback): void;
					public dispatchOnSurfaceSizeChanged(param0: number, param1: number): void;
					public getRootView(): globalAndroid.view.View;
					public onPause(): void;
					public getSurfaceSize(): com.otaliastudios.cameraview.size.Size;
					public isCropping(): boolean;
					public setStreamSize(param0: number, param1: number): void;
					public hasSurface(): boolean;
					public onCreateView(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): T;
					public getOutputClass(): java.lang.Class<Output>;
					public dispatchOnSurfaceDestroyed(): void;
				}
				export module CameraPreview {
					export class CropCallback extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.preview.CameraPreview.CropCallback>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.preview.CameraPreview$CropCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onCrop(): void;
						});
						public constructor();
						public onCrop(): void;
					}
					export class SurfaceCallback extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.preview.CameraPreview.SurfaceCallback>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.preview.CameraPreview$SurfaceCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onSurfaceAvailable(): void;
							onSurfaceChanged(): void;
							onSurfaceDestroyed(): void;
						});
						public constructor();
						public onSurfaceDestroyed(): void;
						public onSurfaceChanged(): void;
						public onSurfaceAvailable(): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module preview {
				export class FilterCameraPreview extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.preview.FilterCameraPreview>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.preview.FilterCameraPreview interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						setFilter(param0: com.otaliastudios.cameraview.filter.Filter): void;
						getCurrentFilter(): com.otaliastudios.cameraview.filter.Filter;
					});
					public constructor();
					public setFilter(param0: com.otaliastudios.cameraview.filter.Filter): void;
					public getCurrentFilter(): com.otaliastudios.cameraview.filter.Filter;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module preview {
				export class GlCameraPreview extends com.otaliastudios.cameraview.preview.CameraPreview<globalAndroid.opengl.GLSurfaceView,globalAndroid.graphics.SurfaceTexture> {
					public static class: java.lang.Class<com.otaliastudios.cameraview.preview.GlCameraPreview>;
					public onCreateView(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): globalAndroid.opengl.GLSurfaceView;
					public addRendererFrameCallback(param0: com.otaliastudios.cameraview.preview.RendererFrameCallback): void;
					public setFilter(param0: com.otaliastudios.cameraview.filter.Filter): void;
					public getOutputClass(): java.lang.Class<globalAndroid.graphics.SurfaceTexture>;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup);
					public getOutputClass(): java.lang.Class<any>;
					public getTextureId(): number;
					public onDestroy(): void;
					public supportsCropping(): boolean;
					public onResume(): void;
					public getCurrentFilter(): com.otaliastudios.cameraview.filter.Filter;
					public removeRendererFrameCallback(param0: com.otaliastudios.cameraview.preview.RendererFrameCallback): void;
					public crop(param0: com.otaliastudios.cameraview.preview.CameraPreview.CropCallback): void;
					public instantiateRenderer(): com.otaliastudios.cameraview.preview.GlCameraPreview.Renderer;
					public getRootView(): globalAndroid.view.View;
					public onPause(): void;
					public getOutput(): any;
					public getOutput(): globalAndroid.graphics.SurfaceTexture;
					public onCreateView(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): any;
				}
				export module GlCameraPreview {
					export class Renderer extends java.lang.Object implements globalAndroid.opengl.GLSurfaceView.Renderer {
						public static class: java.lang.Class<com.otaliastudios.cameraview.preview.GlCameraPreview.Renderer>;
						public onSurfaceDestroyed(): void;
						public onSurfaceChanged(param0: javax.microedition.khronos.opengles.GL10, param1: number, param2: number): void;
						public onSurfaceCreated(param0: javax.microedition.khronos.opengles.GL10, param1: javax.microedition.khronos.egl.EGLConfig): void;
						public constructor(param0: com.otaliastudios.cameraview.preview.GlCameraPreview);
						public onDrawFrame(param0: javax.microedition.khronos.opengles.GL10): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module preview {
				export class RendererCameraPreview extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.preview.RendererCameraPreview>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.preview.RendererCameraPreview interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						addRendererFrameCallback(param0: com.otaliastudios.cameraview.preview.RendererFrameCallback): void;
						removeRendererFrameCallback(param0: com.otaliastudios.cameraview.preview.RendererFrameCallback): void;
					});
					public constructor();
					public removeRendererFrameCallback(param0: com.otaliastudios.cameraview.preview.RendererFrameCallback): void;
					public addRendererFrameCallback(param0: com.otaliastudios.cameraview.preview.RendererFrameCallback): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module preview {
				export class RendererFrameCallback extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.preview.RendererFrameCallback>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.preview.RendererFrameCallback interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						onRendererTextureCreated(param0: number): void;
						onRendererFrame(param0: globalAndroid.graphics.SurfaceTexture, param1: number, param2: number, param3: number): void;
						onRendererFilterChanged(param0: com.otaliastudios.cameraview.filter.Filter): void;
					});
					public constructor();
					public onRendererFilterChanged(param0: com.otaliastudios.cameraview.filter.Filter): void;
					public onRendererFrame(param0: globalAndroid.graphics.SurfaceTexture, param1: number, param2: number, param3: number): void;
					public onRendererTextureCreated(param0: number): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module preview {
				export class RendererThread extends java.lang.Object implements java.lang.annotation.Annotation {
					public static class: java.lang.Class<com.otaliastudios.cameraview.preview.RendererThread>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.preview.RendererThread interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						equals(param0: any): boolean;
						hashCode(): number;
						toString(): string;
						annotationType(): java.lang.Class<any>;
					});
					public constructor();
					public equals(param0: any): boolean;
					public toString(): string;
					public annotationType(): java.lang.Class<any>;
					public hashCode(): number;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module preview {
				export class SurfaceCameraPreview extends com.otaliastudios.cameraview.preview.CameraPreview<globalAndroid.view.SurfaceView,globalAndroid.view.SurfaceHolder> {
					public static class: java.lang.Class<com.otaliastudios.cameraview.preview.SurfaceCameraPreview>;
					public getOutputClass(): java.lang.Class<globalAndroid.view.SurfaceHolder>;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup);
					public getRootView(): globalAndroid.view.View;
					public getOutput(): any;
					public getOutputClass(): java.lang.Class<any>;
					public getOutput(): globalAndroid.view.SurfaceHolder;
					public onCreateView(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): globalAndroid.view.SurfaceView;
					public onCreateView(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): any;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module preview {
				export class TextureCameraPreview extends com.otaliastudios.cameraview.preview.CameraPreview<globalAndroid.view.TextureView,globalAndroid.graphics.SurfaceTexture> {
					public static class: java.lang.Class<com.otaliastudios.cameraview.preview.TextureCameraPreview>;
					public crop(param0: com.otaliastudios.cameraview.preview.CameraPreview.CropCallback): void;
					public setDrawRotation(param0: number): void;
					public getOutputClass(): java.lang.Class<globalAndroid.graphics.SurfaceTexture>;
					public constructor(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup);
					public getRootView(): globalAndroid.view.View;
					public getOutputClass(): java.lang.Class<any>;
					public getOutput(): any;
					public getOutput(): globalAndroid.graphics.SurfaceTexture;
					public onCreateView(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): globalAndroid.view.TextureView;
					public supportsCropping(): boolean;
					public onCreateView(param0: globalAndroid.content.Context, param1: globalAndroid.view.ViewGroup): any;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module size {
				export class AspectRatio extends java.lang.Comparable<com.otaliastudios.cameraview.size.AspectRatio> {
					public static class: java.lang.Class<com.otaliastudios.cameraview.size.AspectRatio>;
					public static parse(param0: string): com.otaliastudios.cameraview.size.AspectRatio;
					public matches(param0: com.otaliastudios.cameraview.size.Size, param1: number): boolean;
					public getX(): number;
					public flip(): com.otaliastudios.cameraview.size.AspectRatio;
					public static of(param0: number, param1: number): com.otaliastudios.cameraview.size.AspectRatio;
					public getY(): number;
					public compareTo(param0: com.otaliastudios.cameraview.size.AspectRatio): number;
					public static of(param0: com.otaliastudios.cameraview.size.Size): com.otaliastudios.cameraview.size.AspectRatio;
					public equals(param0: any): boolean;
					public toString(): string;
					public matches(param0: com.otaliastudios.cameraview.size.Size): boolean;
					public toFloat(): number;
					public hashCode(): number;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module size {
				export class Size extends java.lang.Comparable<com.otaliastudios.cameraview.size.Size> {
					public static class: java.lang.Class<com.otaliastudios.cameraview.size.Size>;
					public equals(param0: any): boolean;
					public toString(): string;
					public flip(): com.otaliastudios.cameraview.size.Size;
					public getHeight(): number;
					public compareTo(param0: com.otaliastudios.cameraview.size.Size): number;
					public getWidth(): number;
					public hashCode(): number;
					public constructor(param0: number, param1: number);
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module size {
				export class SizeSelector extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.size.SizeSelector>;
					/**
					 * Constructs a new instance of the com.otaliastudios.cameraview.size.SizeSelector interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
					 */
					public constructor(implementation: {
						select(param0: java.util.List<com.otaliastudios.cameraview.size.Size>): java.util.List<com.otaliastudios.cameraview.size.Size>;
					});
					public constructor();
					public select(param0: java.util.List<com.otaliastudios.cameraview.size.Size>): java.util.List<com.otaliastudios.cameraview.size.Size>;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module size {
				export class SizeSelectorParser extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.size.SizeSelectorParser>;
					public constructor(param0: globalAndroid.content.res.TypedArray);
					public getVideoSizeSelector(): com.otaliastudios.cameraview.size.SizeSelector;
					public getPictureSizeSelector(): com.otaliastudios.cameraview.size.SizeSelector;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module size {
				export class SizeSelectors extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.size.SizeSelectors>;
					public static minWidth(param0: number): com.otaliastudios.cameraview.size.SizeSelector;
					public static or(param0: native.Array<com.otaliastudios.cameraview.size.SizeSelector>): com.otaliastudios.cameraview.size.SizeSelector;
					public static maxWidth(param0: number): com.otaliastudios.cameraview.size.SizeSelector;
					public static biggest(): com.otaliastudios.cameraview.size.SizeSelector;
					public static smallest(): com.otaliastudios.cameraview.size.SizeSelector;
					public static withFilter(param0: com.otaliastudios.cameraview.size.SizeSelectors.Filter): com.otaliastudios.cameraview.size.SizeSelector;
					public static minArea(param0: number): com.otaliastudios.cameraview.size.SizeSelector;
					public static maxHeight(param0: number): com.otaliastudios.cameraview.size.SizeSelector;
					public static aspectRatio(param0: com.otaliastudios.cameraview.size.AspectRatio, param1: number): com.otaliastudios.cameraview.size.SizeSelector;
					public static maxArea(param0: number): com.otaliastudios.cameraview.size.SizeSelector;
					public constructor();
					public static minHeight(param0: number): com.otaliastudios.cameraview.size.SizeSelector;
					public static and(param0: native.Array<com.otaliastudios.cameraview.size.SizeSelector>): com.otaliastudios.cameraview.size.SizeSelector;
				}
				export module SizeSelectors {
					export class AndSelector extends java.lang.Object implements com.otaliastudios.cameraview.size.SizeSelector {
						public static class: java.lang.Class<com.otaliastudios.cameraview.size.SizeSelectors.AndSelector>;
						public select(param0: java.util.List<com.otaliastudios.cameraview.size.Size>): java.util.List<com.otaliastudios.cameraview.size.Size>;
					}
					export class Filter extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.size.SizeSelectors.Filter>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.size.SizeSelectors$Filter interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							accepts(param0: com.otaliastudios.cameraview.size.Size): boolean;
						});
						public constructor();
						public accepts(param0: com.otaliastudios.cameraview.size.Size): boolean;
					}
					export class FilterSelector extends java.lang.Object implements com.otaliastudios.cameraview.size.SizeSelector {
						public static class: java.lang.Class<com.otaliastudios.cameraview.size.SizeSelectors.FilterSelector>;
						public select(param0: java.util.List<com.otaliastudios.cameraview.size.Size>): java.util.List<com.otaliastudios.cameraview.size.Size>;
					}
					export class OrSelector extends java.lang.Object implements com.otaliastudios.cameraview.size.SizeSelector {
						public static class: java.lang.Class<com.otaliastudios.cameraview.size.SizeSelectors.OrSelector>;
						public select(param0: java.util.List<com.otaliastudios.cameraview.size.Size>): java.util.List<com.otaliastudios.cameraview.size.Size>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export class Full1VideoRecorder extends com.otaliastudios.cameraview.video.FullVideoRecorder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.video.Full1VideoRecorder>;
					public applyVideoSource(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: globalAndroid.media.MediaRecorder): void;
					public constructor(param0: com.otaliastudios.cameraview.engine.Camera1Engine, param1: globalAndroid.hardware.Camera, param2: number);
					public getCamcorderProfile(param0: com.otaliastudios.cameraview.VideoResult.Stub): globalAndroid.media.CamcorderProfile;
					public onDispatchResult(): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export class Full2VideoRecorder extends com.otaliastudios.cameraview.video.FullVideoRecorder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.video.Full2VideoRecorder>;
					public onStart(): void;
					public applyVideoSource(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: globalAndroid.media.MediaRecorder): void;
					public createInputSurface(param0: com.otaliastudios.cameraview.VideoResult.Stub): globalAndroid.view.Surface;
					public constructor(param0: com.otaliastudios.cameraview.engine.Camera2Engine, param1: string);
					public getCamcorderProfile(param0: com.otaliastudios.cameraview.VideoResult.Stub): globalAndroid.media.CamcorderProfile;
					public getInputSurface(): globalAndroid.view.Surface;
				}
				export module Full2VideoRecorder {
					export class PrepareException extends java.lang.Exception {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.Full2VideoRecorder.PrepareException>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export abstract class FullVideoRecorder extends com.otaliastudios.cameraview.video.VideoRecorder {
					public static class: java.lang.Class<com.otaliastudios.cameraview.video.FullVideoRecorder>;
					public static LOG: com.otaliastudios.cameraview.CameraLogger;
					public mMediaRecorder: globalAndroid.media.MediaRecorder;
					public onStart(): void;
					public applyVideoSource(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: globalAndroid.media.MediaRecorder): void;
					public getCamcorderProfile(param0: com.otaliastudios.cameraview.VideoResult.Stub): globalAndroid.media.CamcorderProfile;
					public onStop(param0: boolean): void;
					public prepareMediaRecorder(param0: com.otaliastudios.cameraview.VideoResult.Stub): boolean;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export class SnapshotVideoRecorder extends com.otaliastudios.cameraview.video.VideoRecorder implements com.otaliastudios.cameraview.preview.RendererFrameCallback, com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine.Listener {
					public static class: java.lang.Class<com.otaliastudios.cameraview.video.SnapshotVideoRecorder>;
					public onStart(): void;
					public onRendererFilterChanged(param0: com.otaliastudios.cameraview.filter.Filter): void;
					public onEncodingStart(): void;
					public onEncodingStop(): void;
					public constructor(param0: com.otaliastudios.cameraview.engine.CameraEngine, param1: com.otaliastudios.cameraview.preview.RendererCameraPreview, param2: com.otaliastudios.cameraview.overlay.Overlay);
					public onEncodingEnd(param0: number, param1: java.lang.Exception): void;
					public onRendererFrame(param0: globalAndroid.graphics.SurfaceTexture, param1: number, param2: number, param3: number): void;
					public onStop(param0: boolean): void;
					public onRendererTextureCreated(param0: number): void;
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export abstract class VideoRecorder extends java.lang.Object {
					public static class: java.lang.Class<com.otaliastudios.cameraview.video.VideoRecorder>;
					public mError: java.lang.Exception;
					public onStart(): void;
					public stop(param0: boolean): void;
					public dispatchVideoRecordingStart(): void;
					public dispatchVideoRecordingEnd(): void;
					public dispatchResult(): void;
					public start(param0: com.otaliastudios.cameraview.VideoResult.Stub): void;
					public onStop(param0: boolean): void;
					public isRecording(): boolean;
					public onDispatchResult(): void;
				}
				export module VideoRecorder {
					export class VideoResultListener extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.VideoRecorder.VideoResultListener>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.video.VideoRecorder$VideoResultListener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							onVideoResult(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.lang.Exception): void;
							onVideoRecordingStart(): void;
							onVideoRecordingEnd(): void;
						});
						public constructor();
						public onVideoRecordingStart(): void;
						public onVideoResult(param0: com.otaliastudios.cameraview.VideoResult.Stub, param1: java.lang.Exception): void;
						public onVideoRecordingEnd(): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class AudioConfig extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.AudioConfig>;
						public bitRate: number;
						public channels: number;
						public encoder: string;
						public mimeType: string;
						public samplingFrequency: number;
						public constructor();
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class AudioMediaEncoder extends com.otaliastudios.cameraview.video.encoding.MediaEncoder {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.AudioMediaEncoder>;
						public constructor(param0: com.otaliastudios.cameraview.video.encoding.AudioConfig);
						public onPrepare(param0: com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine.Controller, param1: number): void;
						public onStopped(): void;
						public getEncodedBitRate(): number;
						public onStop(): void;
						public onStart(): void;
						public constructor(param0: string);
					}
					export module AudioMediaEncoder {
						export class AudioEncodingThread extends java.lang.Thread {
							public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.AudioMediaEncoder.AudioEncodingThread>;
							public run(): void;
						}
						export class AudioRecordingThread extends java.lang.Thread {
							public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.AudioMediaEncoder.AudioRecordingThread>;
							public run(): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class AudioNoise extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.AudioNoise>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class AudioTimestamp extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.AudioTimestamp>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class ByteBufferPool extends com.otaliastudios.cameraview.internal.Pool<java.nio.ByteBuffer> {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.ByteBufferPool>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class EncoderThread extends java.lang.Object implements java.lang.annotation.Annotation {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.EncoderThread>;
						/**
						 * Constructs a new instance of the com.otaliastudios.cameraview.video.encoding.EncoderThread interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
						 */
						public constructor(implementation: {
							equals(param0: any): boolean;
							hashCode(): number;
							toString(): string;
							annotationType(): java.lang.Class<any>;
						});
						public constructor();
						public equals(param0: any): boolean;
						public hashCode(): number;
						public toString(): string;
						public annotationType(): java.lang.Class<any>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class InputBuffer extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.InputBuffer>;
						public data: java.nio.ByteBuffer;
						public source: java.nio.ByteBuffer;
						public index: number;
						public length: number;
						public timestamp: number;
						public isEndOfStream: boolean;
						public constructor();
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class InputBufferPool extends com.otaliastudios.cameraview.internal.Pool<com.otaliastudios.cameraview.video.encoding.InputBuffer> {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.InputBufferPool>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class MediaCodecBuffers extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.MediaCodecBuffers>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export abstract class MediaEncoder extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.MediaEncoder>;
						public mMediaCodec: globalAndroid.media.MediaCodec;
						public mWorker: com.otaliastudios.cameraview.internal.WorkerHandler;
						public onWriteOutput(param0: com.otaliastudios.cameraview.video.encoding.OutputBufferPool, param1: com.otaliastudios.cameraview.video.encoding.OutputBuffer): void;
						public getPendingEvents(param0: string): number;
						public acquireInputBuffer(param0: com.otaliastudios.cameraview.video.encoding.InputBuffer): void;
						public getMaxLengthUs(): number;
						public encodeInputBuffer(param0: com.otaliastudios.cameraview.video.encoding.InputBuffer): void;
						public getEncodedBitRate(): number;
						public onStop(): void;
						public tryAcquireInputBuffer(param0: com.otaliastudios.cameraview.video.encoding.InputBuffer): boolean;
						public hasReachedMaxLength(): boolean;
						public onPrepare(param0: com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine.Controller, param1: number): void;
						public notifyFirstFrameMillis(param0: number): void;
						public onStopped(): void;
						public notifyMaxLengthReached(): void;
						public onEvent(param0: string, param1: any): void;
						public onStart(): void;
						public constructor(param0: string);
						public drainOutput(param0: boolean): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class MediaEncoderEngine extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine>;
						public static END_BY_USER: number;
						public static END_BY_MAX_DURATION: number;
						public static END_BY_MAX_SIZE: number;
						public getAudioEncoder(): com.otaliastudios.cameraview.video.encoding.AudioMediaEncoder;
						public getVideoEncoder(): com.otaliastudios.cameraview.video.encoding.VideoMediaEncoder<any>;
						public notify(): void;
						public start(): void;
						public stop(): void;
						public notify(param0: string, param1: any): void;
						public constructor(param0: java.io.File, param1: com.otaliastudios.cameraview.video.encoding.VideoMediaEncoder<any>, param2: com.otaliastudios.cameraview.video.encoding.AudioMediaEncoder, param3: number, param4: number, param5: com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine.Listener);
					}
					export module MediaEncoderEngine {
						export class Controller extends java.lang.Object {
							public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine.Controller>;
							public notifyStarted(param0: globalAndroid.media.MediaFormat): number;
							public constructor(param0: com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine);
							public requestStop(param0: number): void;
							public isStarted(): boolean;
							public write(param0: com.otaliastudios.cameraview.video.encoding.OutputBufferPool, param1: com.otaliastudios.cameraview.video.encoding.OutputBuffer): void;
							public notifyStopped(param0: number): void;
						}
						export class Listener extends java.lang.Object {
							public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine.Listener>;
							/**
							 * Constructs a new instance of the com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine$Listener interface with the provided implementation. An empty constructor exists calling super() when extending the interface class.
							 */
							public constructor(implementation: {
								onEncodingStart(): void;
								onEncodingStop(): void;
								onEncodingEnd(param0: number, param1: java.lang.Exception): void;
							});
							public constructor();
							public onEncodingStop(): void;
							public onEncodingStart(): void;
							public onEncodingEnd(param0: number, param1: java.lang.Exception): void;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class OutputBuffer extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.OutputBuffer>;
						public info: globalAndroid.media.MediaCodec.BufferInfo;
						public trackIndex: number;
						public data: java.nio.ByteBuffer;
						public constructor();
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class OutputBufferPool extends com.otaliastudios.cameraview.internal.Pool<com.otaliastudios.cameraview.video.encoding.OutputBuffer> {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.OutputBufferPool>;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class TextureConfig extends com.otaliastudios.cameraview.video.encoding.VideoConfig {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.TextureConfig>;
						public textureId: number;
						public overlayTarget: com.otaliastudios.cameraview.overlay.Overlay.Target;
						public overlayDrawer: com.otaliastudios.cameraview.overlay.OverlayDrawer;
						public overlayRotation: number;
						public scaleX: number;
						public scaleY: number;
						public eglContext: globalAndroid.opengl.EGLContext;
						public constructor();
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class TextureMediaEncoder extends com.otaliastudios.cameraview.video.encoding.VideoMediaEncoder<com.otaliastudios.cameraview.video.encoding.TextureConfig> {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.TextureMediaEncoder>;
						public static FRAME_EVENT: string;
						public static FILTER_EVENT: string;
						public shouldRenderFrame(param0: number): boolean;
						public onPrepare(param0: com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine.Controller, param1: number): void;
						public onStopped(): void;
						public onEvent(param0: string, param1: any): void;
						public acquireFrame(): com.otaliastudios.cameraview.video.encoding.TextureMediaEncoder.Frame;
						public constructor(param0: string);
						public constructor(param0: com.otaliastudios.cameraview.video.encoding.TextureConfig);
					}
					export module TextureMediaEncoder {
						export class Frame extends java.lang.Object {
							public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.TextureMediaEncoder.Frame>;
							public timestampNanos: number;
							public timestampMillis: number;
							public transform: native.Array<number>;
						}
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export class VideoConfig extends java.lang.Object {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.VideoConfig>;
						public width: number;
						public height: number;
						public bitRate: number;
						public frameRate: number;
						public rotation: number;
						public mimeType: string;
						public encoder: string;
						public constructor();
						public copy(param0: com.otaliastudios.cameraview.video.encoding.VideoConfig): void;
					}
				}
			}
		}
	}
}

declare module com {
	export module otaliastudios {
		export module cameraview {
			export module video {
				export module encoding {
					export abstract class VideoMediaEncoder<C>  extends com.otaliastudios.cameraview.video.encoding.MediaEncoder {
						public static class: java.lang.Class<com.otaliastudios.cameraview.video.encoding.VideoMediaEncoder<any>>;
						public mConfig: any;
						public mSurface: globalAndroid.view.Surface;
						public mFrameNumber: number;
						public onWriteOutput(param0: com.otaliastudios.cameraview.video.encoding.OutputBufferPool, param1: com.otaliastudios.cameraview.video.encoding.OutputBuffer): void;
						public shouldRenderFrame(param0: number): boolean;
						public onPrepare(param0: com.otaliastudios.cameraview.video.encoding.MediaEncoderEngine.Controller, param1: number): void;
						public getEncodedBitRate(): number;
						public onStop(): void;
						public onStart(): void;
					}
				}
			}
		}
	}
}

//Generics information:
//com.otaliastudios.cameraview.frame.FrameManager:1
//com.otaliastudios.cameraview.internal.Pool:1
//com.otaliastudios.cameraview.internal.Pool.Factory:1
//com.otaliastudios.cameraview.metering.MeteringTransform:1
//com.otaliastudios.cameraview.preview.CameraPreview:2
//com.otaliastudios.cameraview.video.encoding.VideoMediaEncoder:1

