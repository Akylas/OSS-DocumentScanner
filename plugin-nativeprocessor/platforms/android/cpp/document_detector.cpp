#include <jni.h>
#include <string>
#include <android_utils.h>
#include <DocumentDetector.h>
#include <DocumentOCR.h>
#include <jsoncons/json.hpp>
#include <android/log.h>

using namespace std;

static const char *const kClassDocumentDetector = "com/nativescript/cameraViewDemo/ImageAnalysisCallback";
jstring stringToJavaString(JNIEnv *env, const std::string &stringValue)
{
    return env->NewStringUTF(stringValue.c_str());
}

std::string jstringToString(JNIEnv *env, jstring value)
{
    if (value == nullptr)
    {
        return {};
    }

    jboolean f = JNI_FALSE;
    auto chars = env->GetStringUTFChars(value, &f);
    std::string s(chars);
    env->ReleaseStringUTFChars(value, chars);

    return s;
}

static struct
{
    jclass jClassPoint;
    jclass jClassVector;
    jmethodID jMethodInit;
    jfieldID jFieldIDX;
    jfieldID jFieldIDY;
} gPointInfo;

static void initClassInfo(JNIEnv *env)
{
    gPointInfo.jClassPoint = reinterpret_cast<jclass>(env->NewGlobalRef(env->FindClass("android/graphics/Point")));
    gPointInfo.jClassVector = reinterpret_cast<jclass>(env->NewGlobalRef(env->FindClass("java/util/Vector")));
    gPointInfo.jMethodInit = env->GetMethodID(gPointInfo.jClassPoint, "<init>", "(II)V");
    gPointInfo.jFieldIDX = env->GetFieldID(gPointInfo.jClassPoint, "x", "I");
    gPointInfo.jFieldIDY = env->GetFieldID(gPointInfo.jClassPoint, "y", "I");
}

static jobject createJavaPoint(JNIEnv *env, Point point_)
{
    return env->NewObject(gPointInfo.jClassPoint, gPointInfo.jMethodInit, point_.x, point_.y);
}

static jstring native_ocr(JNIEnv *env, jobject type, jobject srcBitmap, jstring options_, jobject progressInterface)
{
    Mat srcBitmapMat;
    bitmap_to_mat(env, srcBitmap, srcBitmapMat);
    Mat bgrData(srcBitmapMat.rows, srcBitmapMat.cols, CV_8UC3);
    std::string options{jstringToString(env, options_)};
    std::optional<std::function<void(int)>> progressLambda;
    jmethodID method = NULL;
    if (progressInterface != NULL)
    {
        jclass objclass = env->GetObjectClass(progressInterface);
        method = env->GetMethodID(objclass, "onProgress", "(I)V");
        progressLambda = [&](int progress)
        {
            env->CallVoidMethod(progressInterface, method, progress);
        };
    }

    std::string result = detector::DocumentOCR::detectText(srcBitmapMat, options, progressLambda);
    return stringToJavaString(env, result);
}
static jobject native_scan(JNIEnv *env, jobject type, jobject srcBitmap, jint shrunkImageHeight, jint imageRotation)
{
    Mat srcBitmapMat;
    bitmap_to_mat(env, srcBitmap, srcBitmapMat);
    Mat bgrData(srcBitmapMat.rows, srcBitmapMat.cols, CV_8UC3);
    cvtColor(srcBitmapMat, bgrData, COLOR_RGBA2BGR);
    detector::DocumentDetector docDetector(bgrData, shrunkImageHeight, imageRotation);
    std::vector<std::vector<cv::Point>> scanPointsList = docDetector.scanPoint();
    const int size = scanPointsList.size();
    jmethodID mid = env->GetMethodID(gPointInfo.jClassVector, "<init>", "()V");
    jmethodID addMethodID = env->GetMethodID(gPointInfo.jClassVector, "add", "(Ljava/lang/Object;)Z");
    jobject outerVector = env->NewObject(gPointInfo.jClassVector, mid);
    if (size > 0)
    {
        for (int i = 0; i < size; ++i)
        {
            vector<Point> scanPoints = scanPointsList[i];
            jobject innerVector = env->NewObject(gPointInfo.jClassVector, mid);
            if (scanPoints.size() == 4)
            {
                for (int j = 0; j < 4; ++j)
                {
                    env->CallBooleanMethod(innerVector, addMethodID, createJavaPoint(env, scanPoints[j]));
                }
            }
            env->CallBooleanMethod(outerVector, addMethodID, innerVector);
        }
    }
    srcBitmapMat.release();
    return outerVector;
}
static jstring native_scan_json(JNIEnv *env, jobject type, jobject srcBitmap, jint shrunkImageHeight, jint imageRotation)
{
    Mat srcBitmapMat;
    bitmap_to_mat(env, srcBitmap, srcBitmapMat);
    Mat bgrData(srcBitmapMat.rows, srcBitmapMat.cols, CV_8UC3);
    cvtColor(srcBitmapMat, bgrData, COLOR_RGBA2BGR);
    detector::DocumentDetector docDetector(bgrData, shrunkImageHeight, imageRotation);
    std::string scanPointsList = docDetector.scanPointToJSON();
    // const int size = scanPointsList.size();
    // jmethodID mid = env->GetMethodID(gPointInfo.jClassVector, "<init>", "()V");
    // jmethodID addMethodID = env->GetMethodID(gPointInfo.jClassVector, "add", "(Ljava/lang/Object;)Z");
    // jobject outerVector = env->NewObject(gPointInfo.jClassVector, mid);
    // if (size > 0)
    // {
    //     for (int i = 0; i < size; ++i)
    //     {
    //         vector<Point> scanPoints = scanPointsList[i];
    //         jobject innerVector = env->NewObject(gPointInfo.jClassVector, mid);
    //         if (scanPoints.size() == 4)
    //         {
    //             for (int j = 0; j < 4; ++j)
    //             {
    //                 env->CallBooleanMethod(innerVector, addMethodID, createJavaPoint(env, scanPoints[j]));
    //             }
    //         }
    //         env->CallBooleanMethod(outerVector, addMethodID, innerVector);
    //     }
    // }
    srcBitmapMat.release();
    return stringToJavaString(env, scanPointsList);
}

static vector<Point> pointsToNative(JNIEnv *env, jobjectArray points_)
{
    int arrayLength = env->GetArrayLength(points_);
    vector<Point> result;
    for (int i = 0; i < arrayLength; i++)
    {
        jobject point_ = env->GetObjectArrayElement(points_, i);
        int pX = env->GetIntField(point_, gPointInfo.jFieldIDX);
        int pY = env->GetIntField(point_, gPointInfo.jFieldIDY);
        result.push_back(Point(pX, pY));
    }
    return result;
}

static void native_crop(JNIEnv *env, jobject type, jobject srcBitmap, jstring points_, jstring transforms, jobject outBitmap)
{
    std::string points{jstringToString(env, points_)};
    jsoncons::json val = jsoncons::json::parse(points);
    std::vector<int> leftTop = val[0].as<std::vector<int>>();
    std::vector<int> rightTop = val[1].as<std::vector<int>>();
    std::vector<int> rightBottom = val[2].as<std::vector<int>>();
    std::vector<int> leftBottom = val[3].as<std::vector<int>>();

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

    srcTriangle.push_back(Point2f(leftTop[0], leftTop[1]));
    srcTriangle.push_back(Point2f(rightTop[0], rightTop[1]));
    srcTriangle.push_back(Point2f(leftBottom[0], leftBottom[1]));
    srcTriangle.push_back(Point2f(rightBottom[0], rightBottom[1]));

    dstTriangle.push_back(Point2f(0, 0));
    dstTriangle.push_back(Point2f(newWidth, 0));
    dstTriangle.push_back(Point2f(0, newHeight));
    dstTriangle.push_back(Point2f(newWidth, newHeight));

    Mat transform = getPerspectiveTransform(srcTriangle, dstTriangle);
    warpPerspective(srcBitmapMat, dstBitmapMat, transform, dstBitmapMat.size());

    std::string transformsStd{jstringToString(env, transforms)};
    if (transformsStd.length() > 0)
    {
        detector::DocumentDetector::applyTransforms(dstBitmapMat, transformsStd);
    }
    mat_to_bitmap(env, dstBitmapMat, outBitmap);
}

// extern "C"
JNIEXPORT jint JNICALL
JNI_OnLoad(JavaVM *vm, void *reserved)
{
    JNIEnv *env = NULL;
    if (vm->GetEnv((void **)&env, JNI_VERSION_1_6) != JNI_OK)
    {
        return JNI_FALSE;
    }
    initClassInfo(env);
    return JNI_VERSION_1_6;
}

extern "C" JNIEXPORT jobject JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeScan(JNIEnv *env,
                                                                                      jobject thiz,
                                                                                      jobject src_bitmap,
                                                                                      jint shrunk_image_height,
                                                                                      jint image_rotation)
{
    return native_scan(env, thiz, src_bitmap, shrunk_image_height, image_rotation);
}
extern "C" JNIEXPORT jstring JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeScanJSON(JNIEnv *env,
                                                                                          jobject thiz,
                                                                                          jobject src_bitmap,
                                                                                          jint shrunk_image_height,
                                                                                          jint image_rotation)
{
    return native_scan_json(env, thiz, src_bitmap, shrunk_image_height, image_rotation);
}

extern "C" JNIEXPORT void JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeCrop(JNIEnv *env,
                                                                                      jobject thiz,
                                                                                      jobject src_bitmap,
                                                                                      jstring points,
                                                                                      jstring transforms,
                                                                                      jobject out_bitmap)
{
    native_crop(env, thiz, src_bitmap, points, transforms, out_bitmap);
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeOCR(JNIEnv *env,
                                                                                     jobject thiz,
                                                                                     jobject src_bitmap,
                                                                                     jstring options,
                                                                                     jobject progressInterface)
{
    return native_ocr(env, thiz, src_bitmap, options, progressInterface);
}