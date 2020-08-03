export  interface ImageComputeOptions {
    full?: boolean;
    debug?: boolean;
    colorType: number;
    computeTextOrientation?: boolean;
    algo: number;
    pageContourType: number;
    boundType: number;
    approxValue?: number;
    sizeFactor?: number;
}
export interface ImageWorkerOptions extends ImageComputeOptions {
    id: number;
    width: number;
    height: number;
    rotation: number;
}
