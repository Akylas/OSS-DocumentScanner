import { CameraViewBase, torchProperty } from './cameraview.common';
import { isSimulator } from 'nativescript-extendedinfo';

export interface CameraListener extends com.otaliastudios.cameraview.CameraListener {
    // tslint:disable-next-line:no-misused-new
    new (owner: WeakRef<CameraView>): CameraListener;
    // owner: LogEventListener;
}

let CameraListener: CameraListener;
function initCameraListener() {
    if (CameraListener) {
        return;
    }
    @NativeClass
    class CameraListenerImpl extends com.otaliastudios.cameraview.CameraListener {
        constructor(private owner: WeakRef<CameraView>) {
            super();
            return global.__native(this);
        }
        public onZoomChanged(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>) {
            this.owner && this.owner.get().onZoomChanged.call(this.owner.get(), param0, param1, param2);
        }
        public onCameraError(param0: com.otaliastudios.cameraview.CameraException) {
            this.owner && this.owner.get().onCameraError.call(this.owner.get(), param0);
        }
        public onExposureCorrectionChanged(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>) {
            this.owner && this.owner.get().onExposureCorrectionChanged.call(this.owner.get(), param0, param1, param2);
        }
        public onOrientationChanged(param0: number) {
            this.owner && this.owner.get().onOrientationChanged.call(this.owner.get(), param0);
        }
        public onVideoTaken(param0: com.otaliastudios.cameraview.VideoResult) {
            this.owner && this.owner.get().onVideoTaken.call(this.owner.get(), param0);
        }
        public onVideoRecordingEnd() {
            this.owner && this.owner.get().onVideoRecordingEnd.call(this.owner.get());
        }
        public onCameraClosed() {
            this.owner && this.owner.get().onCameraClosed.call(this.owner.get());
        }
        public onPictureTaken(param0: com.otaliastudios.cameraview.PictureResult) {
            this.owner && this.owner.get().onPictureTaken.call(this.owner.get(), param0);
        }
        public onCameraOpened(param0: com.otaliastudios.cameraview.CameraOptions) {
            this.owner && this.owner.get().onCameraOpened.call(this.owner.get(), param0);
        }
        public onVideoRecordingStart() {
            this.owner && this.owner.get().onVideoRecordingStart.call(this.owner.get());
        }
        public onAutoFocusEnd(param0: boolean, param1: globalAndroid.graphics.PointF) {
            this.owner && this.owner.get().onAutoFocusEnd.call(this.owner.get(), param0, param1);
        }
        public onAutoFocusStart(param0: globalAndroid.graphics.PointF) {
            this.owner && this.owner.get().onAutoFocusStart.call(this.owner.get(), param0);
        }
    }
    CameraListener = CameraListenerImpl as any;
}

export class CameraView extends CameraViewBase {
    nativeViewProtected: com.otaliastudios.cameraview.CameraView;
    public createNativeView() {
        const result = new com.otaliastudios.cameraview.CameraView(this._context);
        // console.log('createNativeView', result, result.delegate);
        return result;
    }
    processor: com.otaliastudios.cameraview.frame.FrameProcessor;
    listener: CameraListener;
    initNativeView() {
        super.initNativeView();
        initCameraListener();
        const nativeView = this.nativeViewProtected;
        nativeView.setPlaySounds(false);
        if (!isSimulator()) {
            nativeView.setExperimental(true);
            nativeView.setEngine(com.otaliastudios.cameraview.controls.Engine.CAMERA2);
        }
        nativeView.setAudio(com.otaliastudios.cameraview.controls.Audio.OFF);
        nativeView.setLifecycleOwner(this._context);
        const listener = (this.listener = new CameraListener(new WeakRef(this)));
        nativeView.addCameraListener(listener);
        const processor = (this.processor = new com.otaliastudios.cameraview.frame.FrameProcessor({
            process: frame => {
                try {
                    this.notify({ eventName: 'frame', object: this, frame });
                } catch (err) {
                    console.log('process error', err);
                }
            }
        }));
        nativeView.addFrameProcessor(processor);
    }
    disposeNativeView() {
        const nativeView = this.nativeViewProtected;
        if (this.listener) {
            nativeView.removeCameraListener(this.listener);
            (nativeView as any).listener = this.listener = null;
        }
        if (this.processor) {
            nativeView.removeFrameProcessor(this.processor);
            (nativeView as any).processor = this.processor = null;
        }
        super.disposeNativeView();
    }
    photoListeners: {
        onCameraError(param0: com.otaliastudios.cameraview.CameraException);
        onCameraClosed();
        onPictureTaken(param0: com.otaliastudios.cameraview.PictureResult);
    }[] = [];

    takePicture() {
        return new Promise((resolve, reject) => {
            const myListener = {
                onPictureTaken: (res: com.otaliastudios.cameraview.PictureResult) => {
                    removeListener();
                    const size = res.getSize();
                    resolve({ data: res.getData(), rotation: res.getRotation() - 90, size:{width:size.getWidth(), height: size.getHeight()} });
                    // // res.getData()
                    // res.toBitmap(
                    //     new com.otaliastudios.cameraview.BitmapCallback({
                    //         onBitmapReady(bitmap) {
                    //             resolve({ image: bitmap, rotation: res.getRotation(), size:{width:size.getWidth(), height: size.getHeight()} });
                    //         }
                    //     })
                    // );
                },
                onCameraError: (error: com.otaliastudios.cameraview.CameraException) => {
                    removeListener();
                    reject(error);
                },
                onCameraClosed: () => {
                    removeListener();
                    reject('camera_closed');
                }
            };
            const removeListener = () => {
                const index = this.photoListeners.indexOf(myListener);
                if (index > 0) {
                    this.photoListeners.splice(index, 1);
                }
            };
            this.photoListeners.push(myListener);
            this.nativeViewProtected.takePicture();
        });
    }

    // isCameraStarted = false;
    // cameraStarted() {
    //     return this.isCameraStarted;
    // }
    // startCamera() {
    //     this.isCameraStarted = true;
    //     console.log('startCamera');
    //     // const resolution = this.nativeViewProtected.mCamera.getParameters().getPreviewSize();
    //     // mMaxHeight = resolution.height;
    //     // mMaxWidth = resolution.width;
    //     // console.log('startCamera', resolution.width, resolution.height);
    //     // this.nativeViewProtected.enableView();
    //     // const resolutions = this.nativeViewProtected.mCamera.getParameters().getSupportedPreviewSizes();
    //     // console.log('startCamera', 'done', resolutions);
    //     // this.nativeViewProtected.connectCamera(this.getMeasuredWidth(), this.getMeasuredHeight());
    //     // this.nativeViewProtected.enableFpsMeter();
    //     // this.nativeViewProtected.connectCamera();
    // }
    // stopCamera() {
    //     console.log('stopCamera');
    //     this.isCameraStarted = false;
    //     // this.nativeViewProtected.disconnectCamera();
    // }
    // processOpenCVMat(mat: OpenCVMat) {
    //     // const mat2 = new OpenCVMat();
    //     console.log('processOpenCVMat', mat.channels());
    //     this.notify({ eventName: 'processMat', object: this, mat });
    // }

    [torchProperty.setNative](value: string) {
        console.log('torchProperty', value);
        switch (value) {
            case 'off':
                this.nativeViewProtected.setFlash(com.otaliastudios.cameraview.controls.Flash.OFF);
                break;
            case 'on':
                this.nativeViewProtected.setFlash(com.otaliastudios.cameraview.controls.Flash.ON);
                break;
            case 'auto':
                this.nativeViewProtected.setFlash(com.otaliastudios.cameraview.controls.Flash.AUTO);
                break;
            case 'torch':
                this.nativeViewProtected.setFlash(com.otaliastudios.cameraview.controls.Flash.TORCH);
                break;
        }
    }

    public onZoomChanged(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>) {}
    public onCameraError(param0: com.otaliastudios.cameraview.CameraException) {
        this.photoListeners.forEach(l => l.onCameraError(param0));
    }
    public onExposureCorrectionChanged(param0: number, param1: native.Array<number>, param2: native.Array<globalAndroid.graphics.PointF>) {}
    public onOrientationChanged(param0: number) {}
    public onVideoTaken(param0: com.otaliastudios.cameraview.VideoResult) {}
    public onVideoRecordingEnd() {}
    public onCameraClosed() {
        this.photoListeners.forEach(l => l.onCameraClosed());
    }
    public onPictureTaken(param0: com.otaliastudios.cameraview.PictureResult) {
        this.photoListeners.forEach(l => l.onPictureTaken(param0));
    }
    public onCameraOpened(param0: com.otaliastudios.cameraview.CameraOptions) {}
    public onVideoRecordingStart() {}
    public onAutoFocusEnd(param0: boolean, param1: globalAndroid.graphics.PointF) {}
    public onAutoFocusStart(param0: globalAndroid.graphics.PointF) {}
}
