#include <jni.h>
#include <string>
#include <android_utils.h>
#include <DocumentDetector.h>
#include <DocumentOCR.h>
#include <Utils.h>
#include <jsoncons/json.hpp>
#include <MultiFormatWriter.h>
#include <ReadBarcode.h>
#include <android/log.h>
#include "BitMatrix.h"

#define TAG "JS"
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


jobject pointsToJava(JNIEnv *env, std::vector<std::vector<cv::Point>> scanPointsList)
{
//     auto t_start = std::chrono::high_resolution_clock::now();
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
     auto t_end = std::chrono::high_resolution_clock::now();

//     auto elapsed_time_ms = duration_cast<std::chrono::milliseconds>(t_end - t_start);
//    __android_log_print(ANDROID_LOG_INFO,     TAG, "pointsToJava %d ms\n", elapsed_time_ms.count());
    return outerVector;
}

ZXing::ImageView ImageViewFromMat(const cv::Mat& image)
{
    using ZXing::ImageFormat;

    auto fmt = ImageFormat::None;
    switch (image.channels()) {
        case 1: fmt = ImageFormat::Lum; break;
        case 3: fmt = ImageFormat::BGR; break;
        case 4: fmt = ImageFormat::BGRX; break;
    }

    if (image.depth() != CV_8U || fmt == ImageFormat::None)
        return {nullptr, 0, 0, ImageFormat::None};

    return {image.data, image.cols, image.rows, fmt};
}



namespace jsoncons {
    template<class Json>
    struct json_type_traits<Json, ZXing::Position>
    {
        using allocator_type = typename Json::allocator_type;
//        static bool is(const Json& j) noexcept
//        {
//            return j.is_object() && j.contains("author") &&
//                   j.contains("title") && j.contains("price");
//        }
//        static bool is(const Json& j) noexcept
//        {
//            return j.is_object() && j.contains("author") &&
//                   j.contains("title") && j.contains("price");
//        }
//        static ns::book as(const Json& j)
//        {
//            ns::book val;
//            val.author = j.at("author").template as<std::string>();
//            val.title = j.at("title").template as<std::string>();
//            val.price = j.at("price").template as<double>();
//            return val;
//        }
        static Json to_json(const ZXing::Position& val,
                            allocator_type allocator=allocator_type())
        {
            Json j(json_array_arg);
            Json j1(json_array_arg);
            j1.push_back( val.topLeft().x);
            j1.push_back( val.topLeft().y);
            j.push_back(j1);
            j1.clear();
            j1.push_back( val.topRight().x);
            j1.push_back( val.topRight().y);
            j.push_back(j1);
            j1.clear();
            j1.push_back( val.bottomRight().x);
            j1.push_back( val.bottomRight().y);
            j.push_back(j1);
            j1.clear();
            j1.push_back( val.bottomLeft().x);
            j1.push_back( val.bottomLeft().y);
            j.push_back(j1);
            return j;
        }
    };
} // namespace jsoncons
struct ScanPlusQRCodeResult {
    std::vector<std::vector<cv::Point>> points;
    ZXing::Results qrcodes;
    float resizeScale;
};
JSONCONS_ALL_MEMBER_TRAITS(ScanPlusQRCodeResult, points, qrcodes, resizeScale);
//JSONCONS_ALL_MEMBER_TRAITS(cv::Point, x, y);

static jstring native_scan_qrcode(JNIEnv *env, jobject type, jobject srcBitmap, jint shrunkImageHeight, jint imageRotation, jstring options_, jdouble scale) {
    Mat srcBitmapMat;
    bitmap_to_mat(env, srcBitmap, srcBitmapMat);
    ScanPlusQRCodeResult result;

    detector::DocumentDetector docDetector(srcBitmapMat, shrunkImageHeight, imageRotation);
    result.points =  docDetector.scanPoint();
    std::string options{jstringToString(env, options_)};

    auto hints = ZXing::DecodeHints().setFormats(ZXing::BarcodeFormat::Any).setMaxNumberOfSymbols(1);
    result.qrcodes = ZXing::ReadBarcodes(ImageViewFromMat(docDetector.resizeImageToSize(700)), hints);
    result.resizeScale = docDetector.resizeScale * scale;
    string s;
    encode_json(result, s, jsoncons::indenting::no_indent);
    return stringToJavaString(env, s);
}
static std::vector<std::vector<cv::Point>> native_scan_mat(Mat &srcBitmapMat, jint shrunkImageHeight, jint imageRotation)
{
    detector::DocumentDetector docDetector(srcBitmapMat, shrunkImageHeight, imageRotation);
    return docDetector.scanPoint();
}
static jobject native_scan(JNIEnv *env, jobject type, jobject srcBitmap, jint shrunkImageHeight, jint imageRotation)
{
    Mat srcBitmapMat;
    bitmap_to_mat(env, srcBitmap, srcBitmapMat);
    std::vector<std::vector<cv::Point>> scanPointsList = native_scan_mat(srcBitmapMat,shrunkImageHeight, imageRotation);
    jobject outerVector = pointsToJava(env, scanPointsList);
    srcBitmapMat.release();
    return outerVector;
}

static jobject native_scan_buffer(JNIEnv *env, jobject type, jint width, jint height, jint chromaPixelStride, jobject buffer1,
                                       jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                                       jint rowStride3, jint shrunkImageHeight, jint imageRotation)
{
    Mat srcBitmapMat;
    buffer_to_mat(env, width, height, chromaPixelStride, buffer1, rowStride1, buffer2, rowStride2, buffer3 , rowStride3, srcBitmapMat);
    std::vector<std::vector<cv::Point>> scanPointsList = native_scan_mat(srcBitmapMat,shrunkImageHeight, imageRotation);
    jobject outerVector = pointsToJava(env, scanPointsList);
    srcBitmapMat.release();
    return outerVector;
}

static void testImageProxyToBitmap(JNIEnv *env, jobject type, jint width, jint height, jint chromaPixelStride, jobject buffer1,
                                      jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                                      jint rowStride3, jobject out_bitmap) {
    Mat srcBitmapMat;
    buffer_to_mat(env, width, height, chromaPixelStride, buffer1, rowStride1, buffer2, rowStride2, buffer3 , rowStride3, srcBitmapMat);
    mat_to_bitmap(env, srcBitmapMat, out_bitmap);
    srcBitmapMat.release();
}
static std::string native_scan_json_mat(JNIEnv *env, Mat &srcBitmapMat, jint shrunkImageHeight, jint imageRotation, jdouble scale, jstring _options) {
    detector::DocumentDetector docDetector(srcBitmapMat, shrunkImageHeight, imageRotation, scale);
    if (shrunkImageHeight == 0) {
        // image was resized on the native side let diminish blur
        docDetector.options.medianBlurValue = 3;
    }
    std::string options{jstringToString(env, _options)};
    docDetector.updateOptions(options);
    return docDetector.scanPointToJSON();
}
static jstring native_scan_json(JNIEnv *env, jobject type, jobject srcBitmap, jint shrunkImageHeight, jint imageRotation, jdouble scale, jstring options)
{
//    auto t_start = std::chrono::high_resolution_clock::now();
//    __android_log_print(ANDROID_LOG_INFO,     TAG, "OpenCV: %s", cv::getBuildInformation().c_str());

    Mat srcBitmapMat;
    bitmap_to_mat(env, srcBitmap, srcBitmapMat);
//    __android_log_print(ANDROID_LOG_INFO,     TAG, "bitmap_to_mat %d ms\n", duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count());
    std::string scanPointsList = native_scan_json_mat(env, srcBitmapMat, shrunkImageHeight, imageRotation, scale, options);
    srcBitmapMat.release();
//    __android_log_print(ANDROID_LOG_INFO,     TAG, "native_scan_json_mat %d ms\n", duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count());
    return stringToJavaString(env, scanPointsList);
}
static jstring native_color_palette(JNIEnv *env, jobject type, jobject srcBitmap, jint shrunkImageHeight, jint colorsFilterDistanceThreshold, jint colorPalette)
{
    Mat srcBitmapMat;
    bitmap_to_mat(env, srcBitmap, srcBitmapMat);
//    Mat bgrData(srcBitmapMat.rows, srcBitmapMat.cols, CV_8UC3);
//    cvtColor(srcBitmapMat, bgrData, COLOR_RGBA2BGR);
    std::vector<std::pair<Vec3b, float>> colors = getPalette(srcBitmapMat, true, shrunkImageHeight, colorsFilterDistanceThreshold, -1, true, (ColorSpace)colorPalette);
    jsoncons::json j(jsoncons::json_array_arg);
    for (int i = 0; i < colors.size(); ++i) {
        j.push_back(BGRHexString(colors[i].first));
    }
    srcBitmapMat.release();
    return stringToJavaString(env, j.to_string());
}
static jstring native_scan_json_buffer(JNIEnv *env, jobject type, jint width, jint height, jint chromaPixelStride, jobject buffer1,
                                       jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                                       jint rowStride3, jint shrunkImageHeight, jint imageRotation)
{
//     auto t_start = std::chrono::high_resolution_clock::now();
    Mat srcBitmapMat;
    buffer_to_mat(env, width, height, chromaPixelStride, buffer1, rowStride1, buffer2, rowStride2, buffer3 , rowStride3, srcBitmapMat);
//    __android_log_print(ANDROID_LOG_INFO,     TAG, "buffer_to_mat %d ms\n", duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count());
    std::string scanPointsList = native_scan_json_mat(env, srcBitmapMat, shrunkImageHeight, imageRotation, 1.0, NULL);
    srcBitmapMat.release();
//    __android_log_print(ANDROID_LOG_INFO,     TAG, "native_scan_json_mat %d ms\n", duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count());
    return stringToJavaString(env, scanPointsList);
}
static jstring native_scan_json_buffer_with_image(JNIEnv *env, jobject type, jint width, jint height, jint chromaPixelStride, jobject buffer1,
                                       jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                                       jint rowStride3, jint shrunkImageHeight, jint imageRotation, jobject outBitmap)
{
    Mat srcBitmapMat;
    buffer_to_mat(env, width, height, chromaPixelStride, buffer1, rowStride1, buffer2, rowStride2, buffer3 , rowStride3, srcBitmapMat);
    std::string scanPointsList = native_scan_json_mat(env, srcBitmapMat, shrunkImageHeight, imageRotation, 1.0, NULL);
    mat_to_bitmap(env, srcBitmapMat, outBitmap);
    srcBitmapMat.release();
    return stringToJavaString(env, scanPointsList);
}
//static jstring native_scan_json_buffer_with_image_one_plane(JNIEnv *env, jobject type, jint width, jint height, jobject buffer1,
//                                       jint rowStride1, jint shrunkImageHeight, jint imageRotation, jobject outBitmap)
//{
//    const char *pixels = static_cast<const char *>(env->GetDirectBufferAddress(buffer1));
//    vector<uchar> jpgbytes(pixels, pixels+rowStride1);
//    Mat srcBitmapMat = imdecode(jpgbytes, 0);
////    Mat srcBitmapMat(cv::Size(width, height), CV_8UC1, pixels, rowStride1);
//    std::string scanPointsList = native_scan_json_mat(srcBitmapMat, shrunkImageHeight, imageRotation);
//    mat_to_bitmap(env, srcBitmapMat, outBitmap);
//    srcBitmapMat.release();
//    return stringToJavaString(env, scanPointsList);
//}

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
    std::vector<double> leftTop = val[0].as<std::vector<double>>();
    std::vector<double> rightTop = val[1].as<std::vector<double>>();
    std::vector<double> rightBottom = val[2].as<std::vector<double>>();
    std::vector<double> leftBottom = val[3].as<std::vector<double>>();

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
        detector::DocumentDetector::applyTransforms(dstBitmapMat, transformsStd, false);
    }
    mat_to_bitmap(env, dstBitmapMat, outBitmap);
}

JSONCONS_ENUM_TRAITS(ZXing::BarcodeFormat, None, Aztec, Codabar, Code39, Code93, Code128, DataBar, DataBarExpanded, DataMatrix, EAN8, EAN13, ITF, MaxiCode, PDF417, QRCode, UPCA, UPCE, MicroQRCode);
//JSONCONS_ALL_GETTER_CTOR_TRAITS(ZXing::Position, topLeft, topRight, bottomRight, bottomLeft);
JSONCONS_ALL_MEMBER_TRAITS(ZXing::PointI, x, y);
JSONCONS_N_CTOR_GETTER_TRAITS(ZXing::Result, 1, text, format, ecLevel, orientation, isMirrored, isInverted, position);

ZXing::Results ReadQRCode(JNIEnv *env, Mat &srcMat, jint jRotation, jstring options_)
{
    auto hints = ZXing::DecodeHints().setFormats(ZXing::BarcodeFormat::Any).setMaxNumberOfSymbols(1);
    std::string options{jstringToString(env, options_)};
    double scale = 1.0f;
    int rotation = jRotation;
    if (!options.empty()) {
        jsoncons::json j = jsoncons::json::parse(options);

        if (j.contains("tryHarder")) {
            hints = hints.setTryHarder(j["tryHarder"].as<bool>());
        }
        if (j.contains("rotation")) {
            rotation = j["rotation"].as<int>();
        }
        if (j.contains("resizeThreshold")) {
            double resizeThreshold = j["resizeThreshold"].as<double>();
            int width = srcMat.cols;
            int height = srcMat.rows;
            int size = max(width, height);
            if (size > resizeThreshold) {
                scale = 1.0f * size / resizeThreshold;
                Size size(width / scale, height / scale);
                Mat resizedBitmap(size, CV_8UC3);
                resize(srcMat, resizedBitmap, size);
                srcMat.release();
                srcMat  = resizedBitmap;
            }
        }
    }
    ZXing::Results results = ZXing::ReadBarcodes(ImageViewFromMat(srcMat).rotated(rotation), hints);
    for (int i = 0; i < results.size(); ++i) {
        auto position = results[i].position();
        auto topLeft = position.topLeft();
        auto topRight = position.topRight();
        auto bottomRight = position.bottomRight();
        auto bottomLeft = position.bottomLeft();
        results[i].setPosition(ZXing::QuadrilateralI(ZXing::PointI(topLeft.x * scale, topLeft.y * scale),
                                                     ZXing::PointI(topRight.x * scale, topRight.y * scale),
                                                     ZXing::PointI(bottomRight.x * scale, bottomRight.y * scale),
                                                     ZXing::PointI(bottomLeft.x * scale, bottomLeft.y * scale)));
    }
    return results;
}
static jstring native_qrcore_read(JNIEnv *env, jobject type, jobject srcBitmap, jstring options_)
{
    Mat srcBitmapMat;
    bitmap_to_mat(env, srcBitmap, srcBitmapMat);
    ZXing::Results results = ReadQRCode(env, srcBitmapMat, 0, options_);
    string s;
    encode_json(results, s, jsoncons::indenting::no_indent);
    return stringToJavaString(env, s);
}

static void generateQRCode(JNIEnv *env, jobject type, jstring text_, jstring format_, jint width, jint height, jstring options_, jobject outBitmap)
{
    std::string format{jstringToString(env, format_)};
    auto writer = ZXing::MultiFormatWriter(ZXing::BarcodeFormatFromString(format));
    std::string options{jstringToString(env, options_)};
    if (!options.empty()) {
        jsoncons::json j = jsoncons::json::parse(options);

        if (j.contains("encoding")) {
            writer = writer.setEncoding(ZXing::CharacterSetFromString(j["encoding"].as<string>()));
        }
        if (j.contains("ecclevel")) {
            writer = writer.setEccLevel(j["ecclevel"].as<int>());
        }
        if (j.contains("margin")) {
            writer = writer.setMargin(j["margin"].as<int>());
        }
    }
    std::string text{jstringToString(env, text_)};
    auto matrix = writer.encode(text, width, height);
    auto bitmap = ToMatrix<uint8_t>(matrix);
    const unsigned char *buffer = bitmap.data();
    Mat resultMat(height,width,CV_8UC1,(unsigned char*)buffer);

    // colorize the image
    // Mat resultColor(height,width,CV_8UC4,Scalar(0,0,0,0));
    // for(int r = 0; r < resultMat.rows; r++){
    //     for(int c = 0; c < resultMat.cols; c++){
    //         char currentColor = resultMat.at<uchar>(r, c);
    //         if (currentColor == 0) {
    //             resultColor.at<Vec4b>(r, c)[3] = 255;
    //         }
    //     }
    // }
    mat_to_bitmap(env, resultMat, outBitmap);
}

static jstring native_qrcore_read_buffer(JNIEnv *env, jobject type, jint width, jint height, jint rotation, jobject buffer1,
                                          jint rowStride1, jstring options_)
{
    void *pixels = (env->GetDirectBufferAddress(buffer1));
    Mat mat(cv::Size(width, height), CV_8UC1, pixels, rowStride1);
    ZXing::Results results = ReadQRCode(env, mat, rotation, options_);
    string s;
    encode_json(results, s, jsoncons::indenting::no_indent);
    return stringToJavaString(env, s);
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

extern "C" JNIEXPORT jobject JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeBufferScan(JNIEnv *env,
                                                                                      jobject thiz,
                                                                                            jint width, jint height, jint chromaPixelStride, jobject buffer1,
                                                                                            jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                                                                                            jint rowStride3,
                                                                                      jint shrunk_image_height,
                                                                                      jint image_rotation)
{
    return native_scan_buffer(env, thiz, width, height, chromaPixelStride, buffer1, rowStride1, buffer2, rowStride2, buffer3 , rowStride3, shrunk_image_height, image_rotation);
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeScanAndQRCode(JNIEnv *env,
                                                                                      jobject thiz,
                                                                                      jobject src_bitmap,
                                                                                      jint shrunk_image_height,
                                                                                      jint image_rotation,
                                                                                      jstring options,
                                                                                      jdouble scale)
{
    return native_scan_qrcode(env, thiz, src_bitmap, shrunk_image_height, image_rotation, options, scale);
}
extern "C" JNIEXPORT jstring JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeScanJSON(JNIEnv *env,
                                                                                          jobject thiz,
                                                                                          jobject src_bitmap,
                                                                                          jint shrunk_image_height,
                                                                                          jint image_rotation,
                                                                                          jdouble scale,
                                                                                          jstring options)
{
    return native_scan_json(env, thiz, src_bitmap, shrunk_image_height, image_rotation, scale, options);
}
extern "C" JNIEXPORT jstring JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeScanJSONFromProxy(JNIEnv *env,
                                                                                          jobject thiz,
                                                                                        jint width, jint height, jint chromaPixelStride, jobject buffer1,
                                                                                        jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                                                                                        jint rowStride3,
                                                                                          jint shrunk_image_height,
                                                                                          jint image_rotation,
                                                                                                    jobject out_bitmap)
{
    return native_scan_json_buffer_with_image(env, thiz, width, height, chromaPixelStride, buffer1, rowStride1, buffer2, rowStride2, buffer3 , rowStride3, shrunk_image_height, image_rotation, out_bitmap);
}
//extern "C" JNIEXPORT jstring JNICALL
//Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeScanJSONFromProxyOnePlane(JNIEnv *env,
//                                                                                          jobject thiz,
//                                                                                        jint width, jint height, jobject buffer1,
//                                                                                        jint rowStride1,
//                                                                                          jint shrunk_image_height,
//                                                                                          jint image_rotation,
//                                                                                                    jobject out_bitmap)
//{
//    return native_scan_json_buffer_with_image_one_plane(env, thiz, width, height, buffer1, rowStride1, shrunk_image_height, image_rotation, out_bitmap);
//}
extern "C" JNIEXPORT jstring JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeColorPalette(JNIEnv *env,
                                                                                          jobject thiz,
                                                                                          jobject src_bitmap,
                                                                                          jint shrunk_image_height,
                                                                                          jint colorsFilterDistanceThreshold,
                                                                                          jint colorPalette)
{
    return native_color_palette(env, thiz, src_bitmap, shrunk_image_height, colorsFilterDistanceThreshold, colorPalette);
}
extern "C" JNIEXPORT jstring JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeBufferScanJSON(JNIEnv *env,
                                                                                          jobject thiz,
                                                                                                jint width, jint height, jint chromaPixelStride, jobject buffer1,
                                                                                                jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                                                                                                jint rowStride3,
                                                                                          jint shrunk_image_height,
                                                                                          jint image_rotation)
{
    return native_scan_json_buffer(env, thiz, width, height, chromaPixelStride, buffer1, rowStride1, buffer2, rowStride2, buffer3 , rowStride3, shrunk_image_height, image_rotation);
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
extern "C" JNIEXPORT jstring JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeQRCodeRead(JNIEnv *env,
                                                                                            jobject thiz,
                                                                                            jobject src_bitmap,
                                                                                            jstring options)
{
    return native_qrcore_read(env, thiz, src_bitmap, options);
}


extern "C" JNIEXPORT jstring JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeQRCodeReadBuffer(JNIEnv *env,
                                                                                            jobject thiz,
                                                                                                  jint width, jint height, jint rotation, jobject buffer1,
                                                                                                  jint rowStride1,
                                                                                            jstring options)
{
    return native_qrcore_read_buffer(env, thiz, width, height, rotation, buffer1, rowStride1, options);
}


extern "C" JNIEXPORT void JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_testImageProxyToBitmap(JNIEnv *env,
                                                                                                jobject thiz,
                                                                                                jint width, jint height, jint chromaPixelStride, jobject buffer1,
                                                                                                jint rowStride1, jobject buffer2, jint rowStride2, jobject buffer3,
                                                                                                jint rowStride3,jobject out_bitmap)
{
    testImageProxyToBitmap(env, thiz, width, height, chromaPixelStride, buffer1, rowStride1, buffer2, rowStride2, buffer3 , rowStride3, out_bitmap);
}
extern "C" JNIEXPORT void JNICALL
Java_com_akylas_documentscanner_CustomImageAnalysisCallback_00024Companion_nativeGenerateQRCode(JNIEnv *env, jobject thiz, jstring text_, jstring format_, jint width, jint height, jstring options_, jobject outBitmap)
{
    generateQRCode(env, thiz, text_, format_, width, height, options_, outBitmap);
}