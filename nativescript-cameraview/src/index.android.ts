import { CameraViewBase, torchProperty } from './index.common';
import { isSimulator } from '@nativescript-community/extendedinfo';

export class CameraView extends CameraViewBase {
    // nativeViewProtected: com.otaliastudios.cameraview.CameraView;
    nativeViewProtected: com.akylas.cameraview.CameraView;
    public createNativeView() {
        const result = new com.akylas.cameraview.CameraView(this._context);
        return result;
    }
    processor: com.akylas.cameraview.ImageAnalysisCallback;
    listener: com.akylas.cameraview.CameraEventListener;
    initNativeView() {
        super.initNativeView();
        const nativeView = this.nativeViewProtected;

        const listener = (this.listener = new com.akylas.cameraview.CameraEventListener({
            onReady() {},
            onCameraOpen() {},
            onCameraVideo(param0) {},
            onCameraAnalysis(param0) {},
            onCameraVideoStart() {},
            onCameraError: (param0: string, error) => {
                this.photoListeners?.forEach((c) => c.onCameraError(param0, error));
            },
            onCameraClose: () => {
                this.photoListeners?.forEach((c) => c.onCameraClose());
            },
            onCameraPhoto: (file) => {
                this.photoListeners?.forEach((c) => c.onCameraPhoto(file));
            }
        }));
        nativeView.setListener(listener);
        this.startPreview();
    }

    private _frameChangeCount = 0;

    public addEventListener(arg: string, callback: any, thisArg?: any) {
        super.addEventListener(arg, callback, thisArg);

        if (arg === CameraViewBase.FRAME_EVENT) {
            this._frameChangeCount++;
            this.setProcessor();
        }
    }

    public removeEventListener(arg: string, callback: any, thisArg?: any) {
        super.removeEventListener(arg, callback, thisArg);

        if (arg === CameraViewBase.FRAME_EVENT) {
            this._frameChangeCount--;
            if (this._frameChangeCount === 0) {
                this.detachProcessor();
            }
        }
    }

    setProcessor() {
        if (!this.processor) {
            const processor = (this.processor = new com.akylas.cameraview.ImageAnalysisCallback({
                process: (image, info, processor) => {
                    try {
                        this.notify({ eventName: 'frame', object: this, image, info, processor });
                    } catch (err) {
                        console.log('process error', err, err.stack);
                    }
                }
            }));
            if (this.nativeViewProtected) {
                this.nativeViewProtected.setAnalyserCallback(processor);
            }
        }
    }
    detachProcessor() {
        if (this.processor) {
            if (this.nativeViewProtected) {
                this.nativeViewProtected.setAnalyserCallback(null);
            }
            this.processor = null;
        }
    }
    disposeNativeView() {
        const nativeView = this.nativeViewProtected;
        nativeView.stopPreview();
        nativeView.stop();
        if (this.listener) {
            nativeView.setListener(null);
            (nativeView as any).listener = this.listener = null;
        }
        if (this.processor) {
            nativeView.setAnalyserCallback(null);
            (nativeView as any).processor = this.processor = null;
        }
        super.disposeNativeView();
    }
    startPreview() {
        const nativeView = this.nativeViewProtected;

        if (this.processor) {
            this.nativeViewProtected.setAnalyserCallback(this.processor);
        }
        if (nativeView) {
            nativeView.startPreview();
        }
    }
    stopPreview() {
        const nativeView = this.nativeViewProtected;
        if (nativeView) {
            nativeView.stopPreview();
        }
    }
    toggleCamera() {
        const nativeView = this.nativeViewProtected;
        if (nativeView) {
            nativeView.toggleCamera();
        }
    }
    photoListeners: {
        onCameraError(param0: string, error);
        onCameraClose();
        onCameraPhoto(file);
    }[] = [];
    takePicture() {
        return new Promise((resolve, reject) => {
            const myListener = {
                onCameraPhoto: (file) => {
                    removeListener();
                    resolve(file);
                    // const size = res.getSize();
                    // resolve({
                    //     data: res.getData(),
                    //     rotation: res.getRotation() - 90,
                    //     size: { width: size.getWidth(), height: size.getHeight() }
                    // });
                },
                onCameraError: (param0: string, error) => {
                    removeListener();
                    reject(error);
                },
                onCameraClose: () => {
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
            this.nativeViewProtected.takePhoto();
        });
    }

    [torchProperty.setNative](value: string) {
        switch (value) {
            case 'off':
                this.nativeViewProtected.setFlashMode(com.akylas.cameraview.CameraFlashMode.OFF);
                break;
            case 'on':
                this.nativeViewProtected.setFlashMode(com.akylas.cameraview.CameraFlashMode.ON);
                break;
            case 'auto':
                this.nativeViewProtected.setFlashMode(com.akylas.cameraview.CameraFlashMode.AUTO);
                break;
            case 'torch':
                this.nativeViewProtected.setFlashMode(com.akylas.cameraview.CameraFlashMode.TORCH);
                break;
        }
    }
}
