export interface ImageComputeOptions {
    full?: boolean;
    debug?: boolean;
    maxSize?: number;
    colorType: number;
    computeTextOrientation?: boolean;
    algo: number;
    pageContourType: number;
    boundType: number;
    approxValue?: number;
    sizeFactor?: number;
    blurSize?: number;
}
export interface ImageWorkerOptions extends ImageComputeOptions {
    id: number;
    width: number;
    height: number;
    rotation: number;
}


export const DEFAULT_PRODUCTION_COMPUTE_OPTIONS: ImageComputeOptions = {
    algo: 4,
    boundType: 0,
    pageContourType: 4,
    colorType: 1,
    approxValue: 0.02,
    computeTextOrientation: false,
    debug: false,
    sizeFactor: 1,
    blurSize: 3
}