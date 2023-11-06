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
int adapThresholdBlockSize = 338; // 391
int adapThresholdC = 47;          // 53

bool tesseractDemo = true;
int actualTesseractDetect = 1;
int desseractDetectContours = 1;

int textDetectDilate = 40; // 0
int textDetect1 = 70;      // 34
int textDetect2 = 4;       // 12

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
    // images = new std::string[result.size()];
    // std::copy(result.begin(), result.end(), images);
}

bool isRepetitive(const string &s)
{
    int count = 0;
    for (int i = 0; i < (int)s.size(); i++)
    {
        if ((s[i] == 'i') ||
            (s[i] == 'l') ||
            (s[i] == 'I'))
            count++;
    }
    if (count > ((int)s.size() + 1) / 2)
    {
        return true;
    }
    return false;
}

void er_draw(vector<Mat> &channels, vector<vector<cv::text::ERStat>> &regions, vector<Vec2i> group, Mat &segmentation)
{
    for (int r = 0; r < (int)group.size(); r++)
    {
        cv::text::ERStat er = regions[group[r][0]][group[r][1]];
        if (er.parent != NULL) // deprecate the root region
        {
            int newMaskVal = 255;
            int flags = 4 + (newMaskVal << 8) + FLOODFILL_FIXED_RANGE + FLOODFILL_MASK_ONLY;
            floodFill(channels[group[r][0]], segmentation, Point(er.pixel % channels[group[r][0]].cols, er.pixel / channels[group[r][0]].cols),
                      Scalar(255), 0, Scalar(er.level), Scalar(0), flags);
        }
    }
}

cv::Mat resizeImageToThreshold(const cv::Mat &image, int resizeThreshold, int borderSize)
{
    // add borders to image
    if (resizeThreshold <= 0)
    {
        return image;
    }
    int width = image.cols;
    int height = image.rows;
    int minSize = min(width, height);
    if (minSize > resizeThreshold)
    {
        float resizeScale = 1.0f * minSize / resizeThreshold;
        width = static_cast<int>(width / resizeScale);
        height = static_cast<int>(height / resizeScale);
        Size size(width, height);
        cv::Mat resizedBitmap(size, image.type());
        resize(image, resizedBitmap, size);
        if (borderSize > 0)
        {
            copyMakeBorder(resizedBitmap, resizedBitmap, borderSize, borderSize, borderSize, borderSize, BORDER_REPLICATE);
        }
        return resizedBitmap;
    }
    if (borderSize > 0)
    {
        Mat resizedBitmap;
        copyMakeBorder(image, resizedBitmap, borderSize, borderSize, borderSize, borderSize, BORDER_REPLICATE);
        return resizedBitmap;
    }
    return image;
}

void preprocess_ocr(const Mat &image, const Mat &rgb)
{
    cvtColor(image, rgb, COLOR_BGR2GRAY);
    cv::adaptiveThreshold(rgb, rgb, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, cv::THRESH_BINARY, 197, 48);
}

struct OCRData
{
    cv::Rect box;
    string text;
    float confidence;
    std::optional<std::string> font_name;
    std::optional<bool> bold;
    std::optional<bool> italic;
    std::optional<bool> underlined;
    std::optional<bool> monospace;
    std::optional<bool> serif;
    std::optional<bool> smallcaps;
    std::optional<int> pointsize;
    std::optional<int> font_id;
};
struct OCRResult
{
    string text;
    std::vector<OCRData> blocks;
};

JSONCONS_ALL_MEMBER_TRAITS(cv::Rect, x, y, width, height);
JSONCONS_N_MEMBER_TRAITS(OCRData, 0, box, text, confidence,
                         font_name, bold, italic, underlined, pointsize);
JSONCONS_ALL_MEMBER_TRAITS(OCRResult, text, blocks);

double contoursApproxEpsilonFactor = 0.02;
// comparison function object
bool compareContourAreas(std::vector<cv::Point> contour1, std::vector<cv::Point> contour2)
{
    double i = fabs(contourArea(cv::Mat(contour1)));
    double j = fabs(contourArea(cv::Mat(contour2)));
    return (i > j);
}

float getYSortValue(const Rect &a)
{
    return (round((a.y + a.height / 2) / 100) * 10000);
}
float getSorkKeyTopToBottomLeftToRight(const Rect &a)
{
    return (getYSortValue(a) + a.x);
}

bool rectComparatorYThenX(const Rect &a, const Rect &b)
{
    return getSorkKeyTopToBottomLeftToRight(a) < getSorkKeyTopToBottomLeftToRight(b);
}
void detect_text(const Mat &image, const Mat &out_img)
{
    double t_r = (double)getTickCount();
    cout << "TIME_OCR_INITIALIZATION = " << ((double)getTickCount() - t_r) * 1000 / getTickFrequency() << endl;
    std::vector<cv::Rect> boundRects;
    cv::Mat img_gray, img_sobel, img_threshold, element;
    cvtColor(image, img_sobel, COLOR_BGR2GRAY);
    cv::adaptiveThreshold(img_sobel, img_sobel, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, cv::THRESH_BINARY_INV, adapThresholdBlockSize, adapThresholdC);

    int imageWidth = img_sobel.size().width;
    int imageHeight = img_sobel.size().height;
    double resizeScale = (double)image.size().width / imageWidth;

    if (desseractDetectContours == 1)
    {
        vector<Vec4i> hierarchy;
        std::vector<std::vector<cv::Point>> contours;
        std::vector<cv::Point> contours_poly;
        std::vector<cv::Point> contour;
        element = getStructuringElement(cv::MORPH_RECT, cv::Size(textDetect1, textDetect2));
        cv::morphologyEx(img_sobel, img_threshold, MORPH_CLOSE, element); // Does the trick

        imshow("Detect", img_sobel);
        if (textDetectDilate > 0)
        {
            element = getStructuringElement(cv::MORPH_RECT, cv::Size(textDetectDilate, textDetectDilate));
            cv::dilate(img_threshold, img_threshold, element, cv::Point(-1, -1), 1); // Does the trick
        }
        // img_threshold = resizeImageToThreshold(img_threshold, 1500, 0);
        cv::findContours(img_threshold, contours, hierarchy, cv::RETR_EXTERNAL, cv::CHAIN_APPROX_NONE);
        if (contours.size() > 0)
        {

            std::sort(contours.begin(), contours.end(), compareContourAreas);
            for (int i = 0; i < contours.size(); i++)
            {
                contour = contours[i];
                if (contour.size() > 200)
                {
                    double epsilon = cv::arcLength(contour, true) * contoursApproxEpsilonFactor;
                    cv::approxPolyDP(cv::Mat(contour), contours_poly, 3, true);
                    cv::Rect appRect(boundingRect(cv::Mat(contours_poly)));
                    appRect.x *= resizeScale;
                    appRect.y *= resizeScale;
                    appRect.width *= resizeScale;
                    appRect.height *= resizeScale;
                    if (appRect.width < 0.9 * imageWidth && appRect.height < 0.9 * imageHeight)
                    {
                        boundRects.push_back(appRect);
                        cv::rectangle(out_img, appRect, cv::Scalar(0, 255, 0), 3);
                    }
                }
            }
            std::sort(boundRects.begin(), boundRects.end(), rectComparatorYThenX);
        }
        else
        {
            boundRects.push_back(cv::Rect(0, 0, imageWidth, imageHeight));
        }
    }
    else
    {
        boundRects.push_back(cv::Rect(0, 0, imageWidth, imageHeight));
    }

    bitwise_not(img_sobel, img_sobel);
    if (actualTesseractDetect == 0)
    {
        return;
    }

    tesseract::TessBaseAPI *api = new tesseract::TessBaseAPI();
    api->Init("/home/mguillon/Downloads/tesseract/best", "fra");
    api->SetPageSegMode(tesseract::PSM_AUTO);
    api->SetVariable("user_defined_dpi", "300");
    string fullText = "";
    float scale_img = 600.f / image.rows;
    float scale_font = (float)(2 - scale_img) / 1.4f;
    vector<OCRData> ocr_data;
    Rect lastBoundRect;
    for (int i = 0; i < boundRects.size(); i++)
    {
        Mat group_img = Mat::zeros(image.rows + 2, image.cols + 2, CV_8UC1);
        img_sobel(boundRects[i]).copyTo(group_img);
        copyMakeBorder(group_img, group_img, 15, 15, 15, 15, BORDER_CONSTANT, Scalar(255));
        api->SetImage(group_img.data, group_img.size().width, group_img.size().height, group_img.channels(), group_img.step1());
        api->Recognize(0);
        tesseract::ResultIterator *ri = api->GetIterator();
        tesseract::PageIteratorLevel level = tesseract::RIL_PARA;
        if (ri != 0)
        {
            do
            {
                const char *word = ri->GetUTF8Text(level);
                if (word == NULL)
                    continue;

                OCRData data;
                float conf = ri->Confidence(level);
                string stdWord = (string(word));
                int wordSize = stdWord.size();
                if ((wordSize < 2) || (conf < 51) ||
                    ((wordSize == 2) && (stdWord[0] == stdWord[1])) ||
                    ((wordSize < 4) && (conf < 60)) ||
                    isRepetitive(stdWord))
                    continue;

                int x1, y1, x2, y2;
                ri->BoundingBox(level, &x1, &y1, &x2, &y2);
                trim(stdWord);
                if (desseractDetectContours == 1)
                {
                    stdWord.erase(std::remove(stdWord.begin(), stdWord.end(), '\n'), stdWord.end());
                }
                if (!lastBoundRect.empty())
                {
                    float lastYSortValue = getYSortValue(lastBoundRect);
                    float ySortValue = getYSortValue(boundRects[i]);
                    if (ySortValue == lastYSortValue)
                    {
                        fullText += " " + stdWord;
                    }
                    else
                    {
                        fullText += "\n" + stdWord;
                    }
                }
                else
                {
                    fullText += stdWord;
                }
                bool bold;
                bool italic;
                bool underlined;
                bool monospace;
                bool serif;
                bool smallcaps;
                int pointsize;
                int font_id;
                const char *font_name =
                    ri->WordFontAttributes(&bold, &italic, &underlined, &monospace,
                                           &serif, &smallcaps, &pointsize, &font_id);
                if (font_name != 0)
                {
                    data.font_name = string(font_name);
                }
                data.text = stdWord;
                data.box = Rect(x1, y1, x2 - x1, y2 - y1);

                data.box.x += boundRects[i].x - 15;
                data.box.y += boundRects[i].y - 15;
                data.confidence = conf;
                data.pointsize = pointsize;
                if (bold)
                {
                    data.bold = bold;
                }
                if (italic)
                {
                    data.italic = italic;
                }
                if (underlined)
                {
                    data.underlined = underlined;
                }
                if (smallcaps)
                {
                    data.smallcaps = smallcaps;
                }
                ocr_data.push_back(data);

                delete[] word;
            } while (ri->Next(level));
            delete ri;
        }
        lastBoundRect = boundRects[i];
    }

    for (int j = 0; j < (int)ocr_data.size(); j++)
    {
        OCRData data = ocr_data[j];
        rectangle(out_img, data.box.tl(), data.box.br(), Scalar(255, 0, 255), 3);
        Size word_size = getTextSize(data.text, FONT_HERSHEY_SIMPLEX, (double)scale_font, (int)(3 * scale_font), NULL);
        rectangle(out_img, data.box.tl() - Point(3, word_size.height + 3), data.box.tl() + Point(word_size.width, 0), Scalar(255, 0, 255), -1);
        putText(out_img, data.text, data.box.tl() - Point(1, 1), FONT_HERSHEY_SIMPLEX, scale_font, Scalar(255, 255, 255), (int)(3 * scale_font));
    }
    OCRResult result;
    result.text = fullText;
    result.blocks = ocr_data;
    api->Clear();
    std::string s;
    encode_json(result, s, jsoncons::indenting::no_indent);
    cout << s << endl;
    cout << "TIME_OCR = " << ((double)getTickCount() - t_r) * 1000 / getTickFrequency() << endl;
}

void detectTextOrientation(const cv::Mat &image)
{
    tesseract::Orientation orientation;
    tesseract::WritingDirection direction;
    tesseract::TextlineOrder order;
    float deskew_angle;
    tesseract::TessBaseAPI *api = new tesseract::TessBaseAPI();
    api->Init(NULL, "eng");
    api->SetPageSegMode(tesseract::PSM_AUTO_OSD);
    api->SetImage(image.data, image.size().width, image.size().height, image.channels(), image.step1());
    api->Recognize(0);

    tesseract::PageIterator *it = api->AnalyseLayout();
    it->Orientation(&orientation, &direction, &order, &deskew_angle);
    printf("Orientation: %d;\nWritingDirection: %d\nTextlineOrder: %d\n"
           "Deskew angle: %.4f\n",
           orientation, direction, order, deskew_angle);
    api->End();
    delete api;
}

void updateImage()
{
    docDetector.cannyThreshold1 = cannyThreshold1;
    docDetector.cannyThreshold2 = cannyThreshold2;
    docDetector.dilateAnchorSize = dilateAnchorSize;
    docDetector.morphologyAnchorSize = std::max(morphologyAnchorSize, 3);
    if (gaussianBlur % 2 == 0)
    {
        docDetector.gaussianBlur = gaussianBlur + 1;
    }
    else
    {
        docDetector.gaussianBlur = gaussianBlur;
    }
    vector<vector<cv::Point>> pointsList = docDetector.scanPoint(edged);

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
            cv::detailEnhance(warped, warped, 10, 0.15);
        }
        if (toon == 1)
        {
            cv::stylization(warped, warped, 60, 0.07);
        }
    }
    else
    {
        warped = Mat();
    }
    imshow("Edges", edged);
    if (!warped.empty())
    {

        if (tesseractDemo)
        {
            // warped = resizeImageToThreshold(warped, 500, 0);
            // Mat toTest;
            // preprocess_ocr(warped, toTest);
            // cvtColor(warped, toTest, COLOR_BGR2GRAY);
            // tesseractTest(warped, warped);
            // detectTextOrientation(toTest);
            // Mat res;
            detect_text(warped, warped);
        }

        imshow("Warped", warped);
    }
    else
    {
        destroyWindow("Warped");
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
    if (adapThresholdBlockSize % 2 == 0)
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
    namedWindow("SourceImage", 0);
    resizeWindow("SourceImage", 600, 400);
    namedWindow("Edges");
    moveWindow("Edges", 100, 400);

    namedWindow("Warped", WINDOW_KEEPRATIO);
    moveWindow("Warped", 900, 100);
    resizeWindow("Warped", 600, 600);

    namedWindow("Detect", WINDOW_KEEPRATIO);
    moveWindow("Detect", 1400, 100);
    resizeWindow("Detect", 600, 600);
    updateSourceImage();
    createTrackbar("image:", "SourceImage", &imageIndex, std::size(images) - 1, on_trackbar_image);
    // createTrackbar("gaussianBlur:", "SourceImage", &gaussianBlur, 20, on_trackbar);
    // createTrackbar("morphologyAnchorSize:", "SourceImage", &morphologyAnchorSize, 20, on_trackbar);
    // createTrackbar("cannyThreshold1:", "SourceImage", &cannyThreshold1, 255, on_trackbar);
    // createTrackbar("cannyThreshold2:", "SourceImage", &cannyThreshold2, 255, on_trackbar);
    // createTrackbar("dilateAnchorSize:", "SourceImage", &dilateAnchorSize, 20, on_trackbar);
    createTrackbar("actualTesseractDetect:", "SourceImage", &actualTesseractDetect, 1, on_trackbar);
    createTrackbar("textDetect1:", "SourceImage", &textDetect1, 100, on_trackbar);
    createTrackbar("textDetect2:", "SourceImage", &textDetect2, 100, on_trackbar);
    createTrackbar("textDetectDilate:", "SourceImage", &textDetectDilate, 100, on_trackbar);
    createTrackbar("desseractDetectContours:", "SourceImage", &desseractDetectContours, 1, on_trackbar);
    createTrackbar("whitepaper:", "SourceImage", &whitepaper, 1, on_trackbar);
    createTrackbar("enhance details:", "SourceImage", &enhance, 1, on_trackbar);
    createTrackbar("stylization:", "SourceImage", &toon, 1, on_trackbar);
    // createTrackbar("dogKSize:", "SourceImage", &dogKSize, 30, on_trackbar);
    // createTrackbar("dogSigma1:", "SourceImage", &dogSigma1, 200, on_trackbar);
    // createTrackbar("dogSigma2:", "SourceImage", &dogSigma2, 200, on_trackbar);
    createTrackbar("adapThresholdBlockSize:", "SourceImage", &adapThresholdBlockSize, 500, on_trackbar);
    createTrackbar("adapThresholdC:", "SourceImage", &adapThresholdC, 500, on_trackbar);
    waitKey(0);
    // edged.release();
    // warped.release();

    return 0;
}
