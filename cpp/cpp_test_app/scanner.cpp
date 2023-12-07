#include <opencv2/opencv.hpp>
#include <opencv2/text.hpp>
#include <opencv2/core/utility.hpp>

#include <tesseract/baseapi.h>

#include <stdio.h>
#include <math.h>
#include <iostream>
#include <string>
#include <filesystem>
#include <vector>
#include <DocumentDetector.h>
#include <ColorSimplificationTransform.h>

#include <Utils.h>
#include <stack>
// #include <DocumentOCR.h>
#include <jsoncons/json.hpp>

using namespace cv;
using namespace std;

// trim from start (in place)
static inline void ltrim(std::string &s)
{
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch)
                                    { return !std::isspace(ch); }));
}

// trim from end (in place)
static inline void rtrim(std::string &s)
{
    s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch)
                         { return !std::isspace(ch); })
                .base(),
            s.end());
}

// trim from both ends (in place)
static inline void trim(std::string &s)
{
    rtrim(s);
    ltrim(s);
}

void listFilesInFolder(string dirPath)
{

    for (auto &entry : std::filesystem::directory_iterator(dirPath))
    {
        std::cout << entry.path() << std::endl;
    }
}

bool compareXCords(Point p1, Point p2)
{
    return (p1.x < p2.x);
}

bool compareYCords(Point p1, Point p2)
{
    return (p1.y < p2.y);
}

bool compareDistance(pair<Point, Point> p1, pair<Point, Point> p2)
{
    return (norm(p1.first - p1.second) < norm(p2.first - p2.second));
}

double _distance(Point p1, Point p2)
{
    return sqrt(((p1.x - p2.x) * (p1.x - p2.x)) +
                ((p1.y - p2.y) * (p1.y - p2.y)));
}

void orderPoints(vector<Point> inpts, vector<Point> &ordered)
{
    sort(inpts.begin(), inpts.end(), compareXCords);
    vector<Point> lm(inpts.begin(), inpts.begin() + 2);
    vector<Point> rm(inpts.end() - 2, inpts.end());

    sort(lm.begin(), lm.end(), compareYCords);
    Point tl(lm[0]);
    Point bl(lm[1]);
    vector<pair<Point, Point>> tmp;
    for (size_t i = 0; i < rm.size(); i++)
    {
        tmp.push_back(make_pair(tl, rm[i]));
    }

    sort(tmp.begin(), tmp.end(), compareDistance);
    Point tr(tmp[0].second);
    Point br(tmp[1].second);

    ordered.push_back(tl);
    ordered.push_back(tr);
    ordered.push_back(br);
    ordered.push_back(bl);
}

Mat cropAndWarp(Mat src, vector<cv::Point> orderedPoints)
{
    int newWidth = _distance(orderedPoints[0], orderedPoints[1]);
    int newHeight = _distance(orderedPoints[1], orderedPoints[2]);
    Mat dstBitmapMat = Mat::zeros(newHeight, newWidth, src.type());

    std::vector<Point2f> srcTriangle;
    std::vector<Point2f> dstTriangle;

    srcTriangle.push_back(Point2f(orderedPoints[0].x, orderedPoints[0].y));
    srcTriangle.push_back(Point2f(orderedPoints[1].x, orderedPoints[1].y));
    srcTriangle.push_back(Point2f(orderedPoints[3].x, orderedPoints[3].y));
    srcTriangle.push_back(Point2f(orderedPoints[2].x, orderedPoints[2].y));

    dstTriangle.push_back(Point2f(0, 0));
    dstTriangle.push_back(Point2f(newWidth, 0));
    dstTriangle.push_back(Point2f(0, newHeight));
    dstTriangle.push_back(Point2f(newWidth, newHeight));

    Mat transform = getPerspectiveTransform(srcTriangle, dstTriangle);
    warpPerspective(src, dstBitmapMat, transform, dstBitmapMat.size());
    return dstBitmapMat;
}

detector::DocumentDetector docDetector(300, 0);
int cannyThreshold1 = docDetector.cannyThreshold1;
int cannyThreshold2 = docDetector.cannyThreshold2;
int morphologyAnchorSize = docDetector.morphologyAnchorSize;
int dilateAnchorSize = docDetector.dilateAnchorSize;
int gaussianBlur = docDetector.gaussianBlur;
int medianBlurValue = docDetector.medianBlurValue;
int bilateralFilterValue = docDetector.bilateralFilterValue;
int dilateAnchorSizeBefore = docDetector.dilateAnchorSizeBefore;
int houghLinesThreshold = docDetector.houghLinesThreshold;
int houghLinesMinLineLength = docDetector.houghLinesMinLineLength;
int houghLinesMaxLineGap = docDetector.houghLinesMaxLineGap;
int thresh = docDetector.thresh;
int threshMax = docDetector.threshMax;
int adapThresholdBlockSize = docDetector.adapThresholdBlockSize; // 391
int adapThresholdC = docDetector.adapThresholdBlockSize;         // 53
int gammaCorrection = docDetector.gammaCorrection * 10;          // 53
int shouldNegate = docDetector.shouldNegate;                     // 53
int useChannel = docDetector.useChannel;                         // 53

int whitepaper = 0;
int enhance = 0;
int enhanceAfter = 0;
int process1 = 0;
int colors = 0;
Mat edged;
Mat warped;
Mat image;
Mat resizedImage;
int imageIndex = 0;
int colorsResizeThreshold = 100;
int distanceThreshold = 40;
int colorsFilterDistanceThreshold = 20;
int colorSpace = 0;
int paletteColorSpace = 2;
int paletteNbColors = 5;

int dogKSize = 15;
int dogSigma1 = 100.0;
int dogSigma2 = 0.0;

bool tesseractDemo = true;
int actualTesseractDetect = 1;
int desseractDetectContours = 1;

int textDetectDilate = 40; // 0
int textDetect1 = 70;      // 34
int textDetect2 = 4;       // 12

inline uchar reduceVal(const uchar val)
{
    if (val > 128)
        return 255;
    // if (val > 50) return 128;
    return val;
}

inline uchar reduceVal2(const uchar val)
{
    if (val < 64)
        return 0;
    if (val < 128)
        return 64;
    return 255;
}
void processColors(Mat &img)
{
    Mat dest;
    cvtColor(img, dest, COLOR_BGR2HLS);
    uchar *pixelPtr = dest.data;
    for (int i = 0; i < dest.rows; i++)
    {
        for (int j = 0; j < dest.cols; j++)
        {
            const int pi = i * dest.cols * 3 + j * 3;
            // pixelPtr[pi + 0] = reduceVal(pixelPtr[pi + 0]); // B
            // pixelPtr[pi + 1] = reduceVal2(pixelPtr[pi + 1]); // G
            pixelPtr[pi + 2] = reduceVal2(pixelPtr[pi + 2]); // R
        }
    }
    cvtColor(dest, img, COLOR_HLS2BGR);
}

std::vector<string> images = {"/home/mguillon/Desktop/IMG_20230918_111703_632.jpg", "/home/mguillon/Desktop/IMG_20230918_111709_558.jpg", "/home/mguillon/Desktop/IMG_20230918_111717_906.jpg", "/home/mguillon/Desktop/IMG_20230918_111721_005.jpg", "/home/mguillon/Desktop/IMG_20230918_111714_873.jpg", "/home/mguillon/Desktop/IMG_20231004_092528_420.jpg", "/home/mguillon/Desktop/IMG_20231004_092535_158.jpg"};

void setImagesFromFolder(string dirPath)
{
    images.clear();
    for (auto &entry : std::filesystem::directory_iterator(dirPath))
    {
        images.push_back(entry.path());
    }
}

void preprocess_ocr(const Mat &image, const Mat &rgb)
{
    cvtColor(image, rgb, COLOR_BGR2GRAY);
    cv::adaptiveThreshold(rgb, rgb, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, cv::THRESH_BINARY, 197, 48);
}

void updateImage()
{
    docDetector.cannyThreshold1 = cannyThreshold1;
    docDetector.cannyThreshold2 = cannyThreshold2;
    docDetector.dilateAnchorSize = dilateAnchorSize;
    docDetector.dilateAnchorSizeBefore = dilateAnchorSizeBefore;
    docDetector.dilateAnchorSizeBefore = dilateAnchorSizeBefore;
    docDetector.houghLinesThreshold = houghLinesThreshold;
    docDetector.houghLinesMinLineLength = houghLinesMinLineLength;
    docDetector.houghLinesMaxLineGap = houghLinesMaxLineGap;
    docDetector.adapThresholdBlockSize = adapThresholdBlockSize;
    docDetector.adapThresholdC = adapThresholdC;
    docDetector.morphologyAnchorSize = morphologyAnchorSize;
    docDetector.shouldNegate = shouldNegate;
    docDetector.useChannel = useChannel;
    docDetector.bilateralFilterValue = bilateralFilterValue;
    docDetector.thresh = thresh;
    docDetector.threshMax = threshMax;
    docDetector.gammaCorrection = gammaCorrection / 10.0;
    if (gaussianBlur > 0 && gaussianBlur % 2 == 0)
    {
        docDetector.gaussianBlur = gaussianBlur + 1;
    }
    else
    {
        docDetector.gaussianBlur = gaussianBlur;
    }
    if (medianBlurValue > 0 && medianBlurValue % 2 == 0)
    {
        docDetector.medianBlurValue = medianBlurValue + 1;
    }
    else
    {
        docDetector.medianBlurValue = medianBlurValue;
    }
    docDetector.image = image;
    resizedImage = docDetector.resizeImageMax();
    vector<vector<cv::Point>> pointsList = docDetector.scanPoint(edged, resizedImage, true);

    // for (size_t i = 0; i < pointsList.size(); i++)
    // {
    //     vector<cv::Point> orderedPoints;
    //     orderPoints(pointsList[i], orderedPoints);
    // }

    if (pointsList.size() > 0)
    {
        // vector<cv::Point> orderedPoints;
        // orderPoints(pointsList[0], orderedPoints);
        warped = cropAndWarp(image, pointsList[0]);
        if (whitepaper == 1)
        {
            detector::DocumentDetector::applyTransforms(warped, "whitepaper");
        }
        if (enhance == 1)
        {
            detector::DocumentDetector::applyTransforms(warped, "enhance");
        }
        // if (process1 == 1)
        // {
        //     // warped = quantizeImage(warped, 2);
        //     processColors(warped);
        //     // cv::stylization(warped, warped, 60, 0.07);
        // }
        if (colors == 1)
        {
            std::stringstream stream;
            stream << "colors_" << colorsResizeThreshold << "_" << colorsFilterDistanceThreshold << "_" << distanceThreshold << "_" << (colorSpace - 1);
            // detector::DocumentDetector::applyTransforms(warped, stream.str());
            std::vector<std::pair<Vec3b, float>> colors = colorSimplificationTransform(warped, warped, false, colorsResizeThreshold, colorsFilterDistanceThreshold, distanceThreshold, paletteNbColors, (ColorSpace)(colorSpace), (ColorSpace)(paletteColorSpace));
            for (int index = 0; index < colors.size(); ++index)
            {
                auto color = colors.at(index).first;
                auto rbgColor = ColorSpaceToBGR(color, (ColorSpace)(colorSpace));
                std::stringstream stream;
                stream << "\e[48;2;" << (int)rbgColor(2) << ";" << (int)rbgColor(1) << ";" << (int)rbgColor(0) << "m   \e[0m";
                // ESC[48;2;⟨r⟩;⟨g⟩;⟨b⟩m
                //     __android_log_print(ANDROID_LOG_INFO, "JS", "Color  Color %s Area: %f% %d\n", rgbSexString(HLStoBGR(color.first)).c_str(), 100.f * float(color.second) / n, colors.size());
                cout  << stream.str()  << "Color: " << colors.size() << " - Hue: " << (int)color(0) << " - Lightness: " << (int)color(1) << " - Saturation: " << (int)color(2) << " " << BGRHexString(rbgColor) << " - Area: " << 100.f * (colors.at(index).second) << "%" << endl;
                rectangle(warped, cv::Rect(index * 60, 0, 60, 60), Scalar(rbgColor(0), rbgColor(1), rbgColor(2)), -1);
            }

            // processColors2(warped);
            // cv::stylization(warped, warped, 60, 0.07);
        }
    }
    else
    {
        warped = Mat();
    }
    imshow("SourceImage", resizedImage);
    imshow("Edges", edged);
    if (!warped.empty())
    {

        // if (tesseractDemo)
        // {
        //     // warped = resizeImageToThreshold(warped, 500, 0);
        //     // Mat toTest;
        //     // preprocess_ocr(warped, toTest);
        //     // cvtColor(warped, toTest, COLOR_BGR2GRAY);
        //     // tesseractTest(warped, warped);
        //     // detectTextOrientation(toTest);
        //     // Mat res;
        //     detector::DocumentOCR::DetectOptions options;
        //     options.dataPath = "/home/mguillon/Downloads/tesseract/best";
        //     options.language = "fra";
        //     options.adapThresholdBlockSize = adapThresholdBlockSize;
        //     options.adapThresholdC = adapThresholdC;
        //     options.desseractDetectContours = desseractDetectContours;
        //     options.tesseractDemo = tesseractDemo;
        //     options.actualTesseractDetect = actualTesseractDetect;
        //     options.textDetectDilate = textDetectDilate;
        //     options.textDetect1 = textDetect1;
        //     options.textDetect2 = textDetect2;
        //     double t_r = (double)getTickCount();
        //     std::optional<detector::DocumentOCR::OCRResult> result = detector::DocumentOCR::detectTextImpl(warped, warped, options, std::nullopt);
        //     cout << "TIME_OCR = " << ((double)getTickCount() - t_r) * 1000 / getTickFrequency() << endl;
        //     if (result != std::nullopt)
        //     {
        //         float scale_img = 600.f / warped.rows;
        //         float scale_font = (float)(2 - scale_img) / 1.4f;
        //         auto ocrResult = *std::move(result);
        //         for (int j = 0; j < ocrResult.blocks.size(); j++)
        //         {
        //             detector::DocumentOCR::OCRData data = ocrResult.blocks[j];
        //             rectangle(warped, data.box.tl(), data.box.br(), Scalar(255, 0, 255), 3);
        //             Size word_size = getTextSize(data.text, FONT_HERSHEY_SIMPLEX, (double)scale_font, (int)(3 * scale_font), NULL);
        //             rectangle(warped, data.box.tl() - Point(3, word_size.height + 3), data.box.tl() + Point(word_size.width, 0), Scalar(255, 0, 255), -1);
        //             putText(warped, data.text, data.box.tl() - Point(1, 1), FONT_HERSHEY_SIMPLEX, scale_font, Scalar(255, 255, 255), (int)(3 * scale_font));
        //         }
        //     }
        //     // detect_text(warped, warped);
        // }

        imshow("Warped", warped);
    }
    else
    {
        // destroyWindow("Warped");
        // namedWindow("Warped", WINDOW_KEEPRATIO);
        // moveWindow("Warped", 900, 100);
    }
}
void updateSourceImage()
{
    image = imread(images[imageIndex]);
    docDetector.image = image;
    resizedImage = docDetector.resizeImage();
    imshow("SourceImage", resizedImage);
    updateImage();
}
void on_trackbar(int, void *)
{
    if (adapThresholdBlockSize > 0 && adapThresholdBlockSize % 2 == 0)
    {
        adapThresholdBlockSize = adapThresholdBlockSize + 1;
    }
    updateImage();
}
void on_trackbar_image(int, void *)
{
    updateSourceImage();
}

int main(int argc, char **argv)
{
    // with single image
    if (argc != 2)
    {
        cout << "Usage: ./scanner [test_images_dir_path]\n";
        return 1;
    }
    const char *dirPath = argv[1];

    setImagesFromFolder(dirPath);
    namedWindow("SourceImage", WINDOW_KEEPRATIO);
    resizeWindow("SourceImage", 600, 400);
    moveWindow("SourceImage", 550, 500);
    namedWindow("Options", 0);
    resizeWindow("Options", 450, 400);
    namedWindow("HoughLinesP", WINDOW_KEEPRATIO);
    resizeWindow("HoughLinesP", 400, 300);
    moveWindow("HoughLinesP", 1200, 600);
    namedWindow("Edges", WINDOW_KEEPRATIO);
    resizeWindow("Edges", 600, 400);
    moveWindow("Edges", 550, 0);

    namedWindow("Warped", WINDOW_KEEPRATIO);
    moveWindow("Warped", 1200, 0);
    resizeWindow("Warped", 400, 600);

    // namedWindow("Detect", WINDOW_KEEPRATIO);
    // moveWindow("Detect", 1400, 100);
    // resizeWindow("Detect", 600, 600);
    updateSourceImage();
    createTrackbar("image:", "Options", &imageIndex, std::size(images) - 1, on_trackbar_image);
    createTrackbar("useChannel:", "Options", &useChannel, 3, on_trackbar);
    createTrackbar("bilateralFilter:", "Options", &bilateralFilterValue, 200, on_trackbar);
    createTrackbar("gaussianBlur:", "Options", &gaussianBlur, 200, on_trackbar);
    createTrackbar("medianBlurValue:", "Options", &medianBlurValue, 200, on_trackbar);
    createTrackbar("morphologyAnchorSize:", "Options", &morphologyAnchorSize, 20, on_trackbar);
    createTrackbar("cannyThreshold1:", "Options", &cannyThreshold1, 255, on_trackbar);
    createTrackbar("cannyThreshold2:", "Options", &cannyThreshold2, 255, on_trackbar);
    createTrackbar("dilateAnchorSizeBefore:", "Options", &dilateAnchorSizeBefore, 20, on_trackbar);
    createTrackbar("dilateAnchorSize:", "Options", &dilateAnchorSize, 20, on_trackbar);
    createTrackbar("gammaCorrection:", "Options", &gammaCorrection, 200, on_trackbar);
    createTrackbar("thresh:", "Options", &thresh, 300, on_trackbar);
    createTrackbar("threshMax:", "Options", &threshMax, 300, on_trackbar);
    // createTrackbar("actualTesseractDetect:", "SourceImage", &actualTesseractDetect, 1, on_trackbar);
    // createTrackbar("textDetect1:", "SourceImage", &textDetect1, 100, on_trackbar);
    // createTrackbar("textDetect2:", "SourceImage", &textDetect2, 100, on_trackbar);
    // createTrackbar("textDetectDilate:", "SourceImage", &textDetectDilate, 100, on_trackbar);
    // createTrackbar("desseractDetectContours:", "SourceImage", &desseractDetectContours, 1, on_trackbar);
    // createTrackbar("whitepaper:", "SourceImage", &whitepaper, 1, on_trackbar);
    createTrackbar("negate:", "Options", &shouldNegate, 1, on_trackbar);
    createTrackbar("enhance details:", "Warped", &enhance, 1, on_trackbar);
    // createTrackbar("process1:", "Warped", &process1, 1, on_trackbar);
    createTrackbar("colors:", "Warped", &colors, 1, on_trackbar);
    createTrackbar("colorsResizeThreshold:", "Warped", &colorsResizeThreshold, 400, on_trackbar);
    createTrackbar("colorsFilterDistanceThreshold:", "Warped", &colorsFilterDistanceThreshold, 180, on_trackbar);
    createTrackbar("distanceThreshold:", "Warped", &distanceThreshold, 180, on_trackbar);
    createTrackbar("colorSpace:", "Warped", &colorSpace, 3, on_trackbar);
    createTrackbar("paletteColorSpace:", "Warped", &paletteColorSpace, 3, on_trackbar);
    createTrackbar("paletteNbColors:", "Warped", &paletteNbColors, 8, on_trackbar);
    // createTrackbar("enhance details after:", "Warped", &enhanceAfter, 1, on_trackbar);
    createTrackbar("adapThresholdBlockSize:", "Options", &adapThresholdBlockSize, 500, on_trackbar);
    createTrackbar("adapThresholdC:", "Options", &adapThresholdC, 500, on_trackbar);
    // createTrackbar("stylization:", "Warped", &toon, 1, on_trackbar);
    // createTrackbar("dogKSize:", "SourceImage", &dogKSize, 30, on_trackbar);
    // createTrackbar("dogSigma1:", "SourceImage", &dogSigma1, 200, on_trackbar);
    // createTrackbar("dogSigma2:", "SourceImage", &dogSigma2, 200, on_trackbar);
    // createTrackbar("houghLinesThreshold:", "Options", &houghLinesThreshold, 500, on_trackbar);
    // createTrackbar("houghLinesMinLineLength:", "Options", &houghLinesMinLineLength, 500, on_trackbar);
    // createTrackbar("houghLinesMaxLineGap:", "Options", &houghLinesMaxLineGap, 500, on_trackbar);
    int k;
    while (true)
    {
        k = waitKey(0);
        if (k == 27)
        {
            break;
        }
    }

    // edged.release();
    // warped.release();

    return 0;
}
