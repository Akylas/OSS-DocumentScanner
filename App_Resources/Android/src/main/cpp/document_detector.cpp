#include <jni.h>
#include <string>
#include <android_utils.h>
#include "./src/include/DocumentDetector.h"

using namespace std;

static const char* const kClassDocumentDetector = "com/nativescript/cameraViewDemo/ImageAnalysisCallback";

static struct {
    jclass jClassPoint;
    jclass jClassVector;
    jmethodID jMethodInit;
    jfieldID jFieldIDX;
    jfieldID jFieldIDY;
} gPointInfo;

static void initClassInfo(JNIEnv *env) {
    gPointInfo.jClassPoint = reinterpret_cast<jclass>(env -> NewGlobalRef(env -> FindClass("android/graphics/Point")));
    gPointInfo.jClassVector = reinterpret_cast<jclass>(env -> NewGlobalRef(env -> FindClass("java/util/Vector")));
    gPointInfo.jMethodInit = env -> GetMethodID(gPointInfo.jClassPoint, "<init>", "(II)V");
    gPointInfo.jFieldIDX = env -> GetFieldID(gPointInfo.jClassPoint, "x", "I");
    gPointInfo.jFieldIDY = env -> GetFieldID(gPointInfo.jClassPoint, "y", "I");
}

static jobject createJavaPoint(JNIEnv *env, Point point_) {
    return env -> NewObject(gPointInfo.jClassPoint, gPointInfo.jMethodInit, point_.x, point_.y);
}

static jobject native_scan(JNIEnv *env, jobject type, jobject srcBitmap, jint shrunkImageHeight, jint imageRotation) {
    Mat srcBitmapMat;
    bitmap_to_mat(env, srcBitmap, srcBitmapMat);
    Mat bgrData(srcBitmapMat.rows, srcBitmapMat.cols, CV_8UC3);
    cvtColor(srcBitmapMat, bgrData, COLOR_RGBA2BGR);
    detector::DocumentDetector docDetector(bgrData, shrunkImageHeight, imageRotation);
    std::vector<vector<Point>> scanPointsList = docDetector.scanPoint();
    const int size = scanPointsList.size();
    jmethodID mid = env->GetMethodID(gPointInfo.jClassVector, "<init>", "()V");
    jmethodID addMethodID = env->GetMethodID(gPointInfo.jClassVector, "add", "(Ljava/lang/Object;)Z");
    jobject outerVector = env->NewObject(gPointInfo.jClassVector, mid);
    if (size > 0) {
        for (int i = 0; i < size; ++i) {
            vector<Point> scanPoints = scanPointsList[i];
            jobject innerVector = env->NewObject(gPointInfo.jClassVector, mid);
            if (scanPoints.size() == 4) {
                for (int j = 0; j < 4; ++j) {
                    env->CallBooleanMethod(innerVector, addMethodID, createJavaPoint(env, scanPoints[j]));
                }
            }
            env->CallBooleanMethod(outerVector, addMethodID, innerVector);
        }
    }
    srcBitmapMat.release();
    return outerVector;
}

static vector<Point> pointsToNative(JNIEnv *env, jobjectArray points_) {
    int arrayLength = env->GetArrayLength(points_);
    vector<Point> result;
    for(int i = 0; i < arrayLength; i++) {
        jobject point_ = env -> GetObjectArrayElement(points_, i);
        int pX = env -> GetIntField(point_, gPointInfo.jFieldIDX);
        int pY = env -> GetIntField(point_, gPointInfo.jFieldIDY);
        result.push_back(Point(pX, pY));
    }
    return result;
}
static void native_crop(JNIEnv *env, jobject type, jobject srcBitmap, jobjectArray points_, jobject outBitmap) {
   std::vector<Point> points = pointsToNative(env, points_);
   if (points.size() != 4) {
       return;
   }
   Point leftTop = points[0];
   Point rightTop = points[1];
   Point rightBottom = points[2];
   Point leftBottom = points[3];

   Mat srcBitmapMat;
   bitmap_to_mat(env, srcBitmap, srcBitmapMat);

   AndroidBitmapInfo outBitmapInfo;
   AndroidBitmap_getInfo(env, outBitmap, &outBitmapInfo);
   Mat dstBitmapMat;
   int newHeight = outBitmapInfo.height;
   int newWidth = outBitmapInfo.width;
   dstBitmapMat = Mat::zeros(newHeight, newWidth, srcBitmapMat.type());

   std::vector<Point2f> srcTriangle;
   std::vector<Point2f> dstTriangle;

   srcTriangle.push_back(Point2f(leftTop.x, leftTop.y));
   srcTriangle.push_back(Point2f(rightTop.x, rightTop.y));
   srcTriangle.push_back(Point2f(leftBottom.x, leftBottom.y));
   srcTriangle.push_back(Point2f(rightBottom.x, rightBottom.y));

   dstTriangle.push_back(Point2f(0, 0));
   dstTriangle.push_back(Point2f(newWidth, 0));
   dstTriangle.push_back(Point2f(0, newHeight));
   dstTriangle.push_back(Point2f(newWidth, newHeight));

   Mat transform = getPerspectiveTransform(srcTriangle, dstTriangle);
   warpPerspective(srcBitmapMat, dstBitmapMat, transform, dstBitmapMat.size());

   mat_to_bitmap(env, dstBitmapMat, outBitmap);
}


//extern "C"
JNIEXPORT jint JNICALL
JNI_OnLoad(JavaVM* vm, void* reserved) {
    JNIEnv *env = NULL;
    if (vm->GetEnv((void **) &env, JNI_VERSION_1_6) != JNI_OK) {
        return JNI_FALSE;
    }
    initClassInfo(env);
    return JNI_VERSION_1_6;
}

extern "C"
JNIEXPORT jobject JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeScan(JNIEnv *env,
                                                                                     jobject thiz,
                                                                                     jobject src_bitmap,
                                                                                     jint shrunk_image_height,
                                                                                     jint image_rotation) {
    return native_scan(env, thiz, src_bitmap, shrunk_image_height, image_rotation);
}

extern "C"
JNIEXPORT void JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeCrop(JNIEnv *env,
                                                                                  jobject thiz,
                                                                                  jobject src_bitmap,
                                                                                  jobjectArray points,
                                                                                  jobject out_bitmap) {
    native_crop(env, thiz, src_bitmap, points, out_bitmap);
}