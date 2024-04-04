#include "android_utils.h"


void buffer_to_mat(JNIEnv *env, jint width, jint height, jint chromaPixelStride, jobject buffer1,
                   jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                   jint rowStride3, Mat &srcMat) {
    if (chromaPixelStride == 2) { // Chroma channels are interleaved
        void *yPlane = (env->GetDirectBufferAddress(buffer1));
        int yPlaneStep = rowStride1;
        void *uvPlane1 = (env->GetDirectBufferAddress(buffer2));
        int uvPlane1Step = rowStride2;
        void *uvPlane2 = (env->GetDirectBufferAddress(buffer3));
        int uvPlane2Step = rowStride3;
        Mat yMat(cv::Size(width, height), CV_8UC1, yPlane, yPlaneStep);
        Mat uvMat1(cv::Size(width / 2, height / 2), CV_8UC2, uvPlane1, uvPlane1Step);
        Mat uvMat2(cv::Size(width / 2, height / 2), CV_8UC2, uvPlane2, uvPlane2Step);
        int addrDiff = (long) uvMat2.data - (long) uvMat1.data;
        if (addrDiff > 0) {
            uvMat2.release();
            cv::cvtColorTwoPlane(yMat, uvMat1, srcMat, cv::COLOR_YUV2RGBA_NV12);
            yMat.release();
            uvMat1.release();
        } else {
            uvMat1.release();
            cv::cvtColorTwoPlane(yMat, uvMat2, srcMat, cv::COLOR_YUV2RGBA_NV21);
            yMat.release();
            uvMat2.release();
        }
    } else { // Chroma channels are not interleaved
        // Allocate memory for the YUV frame
        char *yuvBytes = new char[width * (height + height / 2)];
        // Get the pointers to the Y, U, and V planes of the YUV frame
        const uint8_t *yPlane = static_cast<uint8_t *>(env->GetDirectBufferAddress(buffer1));
        const uint8_t *uPlane = static_cast<uint8_t *>(env->GetDirectBufferAddress(buffer2));
        const uint8_t *vPlane = static_cast<uint8_t *>(env->GetDirectBufferAddress(buffer3));
        // Offset for the bytes in the Y plane
        int yuvBytesOffset = 0;
        // Row stride of the Y plane
        int yPlaneStep = rowStride1;
        // Number of pixels in the frame
        int pixels = width * height;
        if (yPlaneStep == width) {
            // Copy the Y plane data to the buffer
//            std::memcpy(yuvBytes, yPlane, pixels);
            std::copy(yPlane, yPlane + pixels, yuvBytes);
            yuvBytesOffset += pixels;
        } else {
            // Padding between rows of the Y plane
            int padding = yPlaneStep - width;
            for (int i = 0; i < height; ++i) {
                // Copy the Y plane data to the buffer
                std::copy(yPlane + yuvBytesOffset, yPlane + yuvBytesOffset + width, yuvBytes);

                yuvBytesOffset += width;
                if (i < height - 1) {
                    yPlane += padding;
                }
            }
//            assert(yuvBytesOffset == pixels)
        }
        int chromaRowStride = rowStride1;
        int chromaRowPadding = chromaRowStride - width / 2;
        if (chromaRowPadding == 0) {
            // When the row stride of the chroma channels equals their width, we can copy
            // the entire channels in one go
            std::copy(uPlane + yuvBytesOffset, yPlane + yuvBytesOffset + pixels / 4, yuvBytes);
//                    uPlane[yuvBytes, yuvBytesOffset, pixels / 4]
            yuvBytesOffset += pixels / 4;
            std::copy(vPlane + yuvBytesOffset, yPlane + yuvBytesOffset + pixels / 4, yuvBytes);
//                    vPlane[yuvBytes, yuvBytesOffset, pixels / 4]
        } else {
            // When not equal, we need to copy the channels row by row
            for (int i = 0; i < height / 2; ++i) {
//                uPlane[yuvBytes, yuvBytesOffset, width / 2]
                std::copy(uPlane, uPlane + width / 2, yuvBytes + yuvBytesOffset);
                yuvBytesOffset += width / 2;
                if (i < height / 2 - 1) {
                    uPlane += chromaRowPadding;
                }
            }
            for (int i = 0; i < height / 2; ++i) {
                std::copy(vPlane, vPlane + width / 2, yuvBytes + yuvBytesOffset);
//                        vPlane[yuvBytes, yuvBytesOffset, width / 2]
                yuvBytesOffset += width / 2;
                if (i < height / 2 - 1) {
                    vPlane += chromaRowPadding;
                }
            }
        }
        Mat yuvMat(cv::Size(width, height + height / 2), CV_8UC1, yuvBytes);
//        std::copy(yuvBytes, yuvBytes + (width * (height + height / 2)), yuvMat.data);

//        memcpy(yuvMat.data, yuvBytes, width * (height + height / 2));
//        yuvMat.put(0, 0, yuvBytes);
        cv::cvtColor(yuvMat, srcMat, cv::COLOR_YUV2RGBA_I420, 4);
        delete[] yuvBytes;
        yuvMat.release();
    }
}

void bitmap_to_mat(JNIEnv *env, jobject &srcBitmap, Mat &srcMat) {
    void *srcPixels = 0;
    AndroidBitmapInfo srcBitmapInfo;
    try {
        AndroidBitmap_getInfo(env, srcBitmap, &srcBitmapInfo);
        AndroidBitmap_lockPixels(env, srcBitmap, &srcPixels);
        uint32_t srcHeight = srcBitmapInfo.height;
        uint32_t srcWidth = srcBitmapInfo.width;
        srcMat.create(srcHeight, srcWidth, CV_8UC4);
        if (srcBitmapInfo.format == ANDROID_BITMAP_FORMAT_RGBA_8888) {
            Mat tmp(srcHeight, srcWidth, CV_8UC4, srcPixels);
            tmp.copyTo(srcMat);
        } else {
            Mat tmp = Mat(srcHeight, srcWidth, CV_8UC2, srcPixels);
            cvtColor(tmp, srcMat, COLOR_BGR5652RGBA);
        }
        AndroidBitmap_unlockPixels(env, srcBitmap);
        return;
//    } catch (cv::Exception &e) {
//        AndroidBitmap_unlockPixels(env, srcBitmap);
//        jclass je = env->FindClass("java/lang/Exception");
//        env->ThrowNew(je, e.what());
//        return;
    } catch (...) {
        AndroidBitmap_unlockPixels(env, srcBitmap);
        jclass je = env->FindClass("java/lang/Exception");
        env->ThrowNew(je, "unknown");
        return;
    }
}

void mat_to_bitmap(JNIEnv *env, Mat &srcMat, jobject &dstBitmap) {
    void *dstPixels = 0;
    AndroidBitmapInfo dstBitmapInfo;
    try {
        AndroidBitmap_getInfo(env, dstBitmap, &dstBitmapInfo);
        AndroidBitmap_lockPixels(env, dstBitmap, &dstPixels);
        uint32_t dstHeight = dstBitmapInfo.height;
        uint32_t dstWidth = dstBitmapInfo.width;
        if (dstBitmapInfo.format == ANDROID_BITMAP_FORMAT_RGBA_8888) {
            Mat tmp(dstHeight, dstWidth, CV_8UC4, dstPixels);
            if (srcMat.type() == CV_8UC1) {
                cvtColor(srcMat, tmp, COLOR_GRAY2RGBA);
            } else if (srcMat.type() == CV_8UC3) {
                cvtColor(srcMat, tmp, COLOR_RGB2RGBA);
            } else if (srcMat.type() == CV_8UC4) {
                srcMat.copyTo(tmp);
            }
        } else {
            Mat tmp = Mat(dstHeight, dstWidth, CV_8UC2, dstPixels);
            if (srcMat.type() == CV_8UC1) {
                cvtColor(srcMat, tmp, COLOR_GRAY2BGR565);
            } else if (srcMat.type() == CV_8UC3) {
                cvtColor(srcMat, tmp, COLOR_RGB2BGR565);
            } else if (srcMat.type() == CV_8UC4) {
                cvtColor(srcMat, tmp, COLOR_RGBA2BGR565);
            }
        }
        AndroidBitmap_unlockPixels(env, dstBitmap);
//    } catch (cv::Exception &e) {
//        AndroidBitmap_unlockPixels(env, dstBitmap);
//        jclass je = env->FindClass("java/lang/Exception");
//        env->ThrowNew(je, e.what());
//        return;
    } catch (...) {
        AndroidBitmap_unlockPixels(env, dstBitmap);
        jclass je = env->FindClass("java/lang/Exception");
        env->ThrowNew(je, "unknown");
        return;
    }
}



