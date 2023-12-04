#ifndef IMG_ANDROID_UTILS_H
#define IMG_ANDROID_UTILS_H

#include <android/bitmap.h>
#include <opencv2/opencv.hpp>

using namespace cv;

void bitmap_to_mat(JNIEnv *env, jobject &srcBitmap, Mat &srcMat);

void mat_to_bitmap(JNIEnv *env, Mat &srcMat, jobject &dstBitmap);
void buffer_to_mat(JNIEnv *env, jint width, jint height, jint chromaPixelStride, jobject buffer1,
                  jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                  jint rowStride3, Mat &srcMat);


#endif //IMG_ANDROID_UTILS_H
