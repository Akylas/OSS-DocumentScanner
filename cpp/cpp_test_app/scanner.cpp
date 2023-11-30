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
int gammaCorrection = docDetector.gammaCorrection * 10;         // 53
int shouldNegate = docDetector.shouldNegate;         // 53
int useChannel = docDetector.useChannel;         // 53

int whitepaper = 0;
int enhance = 0;
int toon = 0;
Mat edged;
Mat warped;
Mat image;
Mat resizedImage;
int imageIndex = 0;

int dogKSize = 15;
int dogSigma1 = 100.0;
int dogSigma2 = 0.0;

bool tesseractDemo = true;
int actualTesseractDetect = 1;
int desseractDetectContours = 1;

int textDetectDilate = 40; // 0
int textDetect1 = 70;      // 34
int textDetect2 = 4;       // 12

// inline uchar reduceVal(const uchar val)
// {
//     if (val < 64) return 0;
//     if (val < 128) return 64;
//     return 255;
// }

inline uchar reduceVal(const uchar val)
{
    if (val < 192) return uchar(val / 64.0 + 0.5) * 64;
    return 255;
}
void processColors(Mat& img)
{
    uchar* pixelPtr = img.data;
    for (int i = 0; i < img.rows; i++)
    {
        for (int j = 0; j < img.cols; j++)
        {
            const int pi = i*img.cols*3 + j*3;
            pixelPtr[pi + 0] = reduceVal(pixelPtr[pi + 0]); // B
            pixelPtr[pi + 1] = reduceVal(pixelPtr[pi + 1]); // G
            pixelPtr[pi + 2] = reduceVal(pixelPtr[pi + 2]); // R
        }
    }
}

cv::Mat quantizeImage(const cv::Mat& inImage, int numBits)
{
    cv::Mat retImage = inImage.clone();

    uchar maskBit = 0xFF;

    // keep numBits as 1 and (8 - numBits) would be all 0 towards the right
    maskBit = maskBit << (8 - numBits);

    for(int j = 0; j < retImage.rows; j++)
        for(int i = 0; i < retImage.cols; i++)
        {
            cv::Vec3b valVec = retImage.at<cv::Vec3b>(j, i);
            valVec[0] = valVec[0] & maskBit;
            valVec[1] = valVec[1] & maskBit;
            valVec[2] = valVec[2] & maskBit;
            retImage.at<cv::Vec3b>(j, i) = valVec;
        }

        return retImage;
}

cv::Mat adaptiveThresholdColor(const cv::Mat &image)
{
    // Split the image into its color channels
    // std::vector<cv::Mat> channels;
    // cv::split(image, channels);

    // // Apply adaptive thresholding to each color channel
    // cv::Mat thresholded_b, thresholded_g, thresholded_r;
    // cv::adaptiveThreshold(channels[0], thresholded_b, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, cv::THRESH_BINARY, adapThresholdBlockSize, adapThresholdC);
    // cv::adaptiveThreshold(channels[1], thresholded_g, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, cv::THRESH_BINARY, adapThresholdBlockSize, adapThresholdC);
    // cv::adaptiveThreshold(channels[2], thresholded_r, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, cv::THRESH_BINARY, adapThresholdBlockSize, adapThresholdC);

    // // Merge the thresholded color channels back together
    // std::vector<cv::Mat> thresholded_channels = {thresholded_b, thresholded_g, thresholded_r};
    // cv::Mat thresholded_image;
    // cv::merge(thresholded_channels, thresholded_image);

    // Create an output image with the same size and type as the input
    cv::Mat output = image.clone();

    // Define a neighborhood size
    int neighborhoodSize = 4;

    for (int y = 0; y < image.rows; y++)
    {
        for (int x = 0; x < image.cols; x++)
        {
            // Get the center pixel color
            cv::Vec3b centerColor = image.at<cv::Vec3b>(y, x);

            // Initialize max color with the center color
            cv::Vec3b maxColor = centerColor;

            // Find the max color in the neighborhood
            for (int ny = -neighborhoodSize; ny <= neighborhoodSize; ny++)
            {
                for (int nx = -neighborhoodSize; nx <= neighborhoodSize; nx++)
                {
                    int ny_new = y + ny;
                    int nx_new = x + nx;

                    if (ny_new >= 0 && ny_new < image.rows && nx_new >= 0 && nx_new < image.cols)
                    {
                        cv::Vec3b neighborColor = image.at<cv::Vec3b>(ny_new, nx_new);
                        for (int i = 0; i < 3; i++)
                        {
                            maxColor[i] = std::max(maxColor[i], neighborColor[i]);
                        }
                    }
                }
            }

            // Normalize the center color according to the max color
            for (int i = 0; i < 3; i++)
            {
                output.at<cv::Vec3b>(y, x)[i] = static_cast<uchar>(static_cast<float>(centerColor[i]) / maxColor[i] * 255.0f);
            }
        }
    }
    return output;
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

    for (size_t i = 0; i < pointsList.size(); i++)
    {
        vector<cv::Point> orderedPoints;
        orderPoints(pointsList[i], orderedPoints);
    }

    if (pointsList.size() > 0)
    {
        vector<cv::Point> orderedPoints;
        orderPoints(pointsList[0], orderedPoints);
        warped = cropAndWarp(image, orderedPoints);
        if (whitepaper == 1)
        {
            detector::DocumentDetector::applyTransforms(warped, "whitepaper");
        }
        if (enhance == 1)
        {
            detector::DocumentDetector::applyTransforms(warped, "enhance");
        }
        if (toon == 1)
        {
            // warped = quantizeImage(warped, 2);
            processColors(warped);
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
    resizeWindow("Warped", 400, 400);

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
    createTrackbar("toon:", "Options", &toon, 1, on_trackbar);
    createTrackbar("adapThresholdBlockSize:", "Options", &adapThresholdBlockSize, 500, on_trackbar);
    createTrackbar("adapThresholdC:", "Options", &adapThresholdC, 500, on_trackbar);
    // createTrackbar("enhance details:", "SourceImage", &enhance, 1, on_trackbar);
    // createTrackbar("stylization:", "SourceImage", &toon, 1, on_trackbar);
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
       if (k == 27) {
        break;
       }
    }
    
    // edged.release();
    // warped.release();

    return 0;
}
