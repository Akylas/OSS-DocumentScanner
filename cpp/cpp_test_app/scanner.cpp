#include <opencv2/opencv.hpp>

#include <stdio.h>
#include <math.h>
#include <iostream>
#include <string>
#include <filesystem>
#include <vector>
#include "./src/include/DocumentDetector.h"

using namespace cv;
using namespace std;

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
int imageIndex = 0;

int dogKSize = 15;
int dogSigma1 = 100.0;
int dogSigma2 = 0.0;
int adapThresholdBlockSize = 11;
int adapThresholdC = 12;

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

    for (int y = 0; y < image.rows; y++) {
        for (int x = 0; x < image.cols; x++) {
            // Get the center pixel color
            cv::Vec3b centerColor = image.at<cv::Vec3b>(y, x);

            // Initialize max color with the center color
            cv::Vec3b maxColor = centerColor;

            // Find the max color in the neighborhood
            for (int ny = -neighborhoodSize; ny <= neighborhoodSize; ny++) {
                for (int nx = -neighborhoodSize; nx <= neighborhoodSize; nx++) {
                    int ny_new = y + ny;
                    int nx_new = x + nx;

                    if (ny_new >= 0 && ny_new < image.rows && nx_new >= 0 && nx_new < image.cols) {
                        cv::Vec3b neighborColor = image.at<cv::Vec3b>(ny_new, nx_new);
                        for (int i = 0; i < 3; i++) {
                            maxColor[i] = std::max(maxColor[i], neighborColor[i]);
                        }
                    }
                }
            }

            // Normalize the center color according to the max color
            for (int i = 0; i < 3; i++) {
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

void updateImage()
{
    // if (!edged.empty())
    // {
    //     edged.release();
    // }
    // if (!warped.empty())
    // {
    //     warped.release();
    // }
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
        // polylines(image, pointsList[i], true, Scalar(0, 255, 255), 2);
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
    imshow("Edges", edged);
    if (!warped.empty())
    {
        namedWindow("Warped", WINDOW_KEEPRATIO);
        moveWindow("Warped", 900, 100);
        resizeWindow("Warped", 600, 600);
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
    Mat resizedImage = docDetector.resizeImage();
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
    updateSourceImage();
    createTrackbar("image:", "SourceImage", &imageIndex, std::size(images) - 1, on_trackbar_image);
    createTrackbar("gaussianBlur:", "SourceImage", &gaussianBlur, 20, on_trackbar);
    createTrackbar("morphologyAnchorSize:", "SourceImage", &morphologyAnchorSize, 20, on_trackbar);
    createTrackbar("cannyThreshold1:", "SourceImage", &cannyThreshold1, 255, on_trackbar);
    createTrackbar("cannyThreshold2:", "SourceImage", &cannyThreshold2, 255, on_trackbar);
    createTrackbar("dilateAnchorSize:", "SourceImage", &dilateAnchorSize, 20, on_trackbar);
    createTrackbar("whitepaper:", "SourceImage", &whitepaper, 1, on_trackbar);
    createTrackbar("enhance details:", "SourceImage", &enhance, 1, on_trackbar);
    createTrackbar("stylization:", "SourceImage", &toon, 1, on_trackbar);
    // createTrackbar("dogKSize:", "SourceImage", &dogKSize, 30, on_trackbar);
    // createTrackbar("dogSigma1:", "SourceImage", &dogSigma1, 200, on_trackbar);
    // createTrackbar("dogSigma2:", "SourceImage", &dogSigma2, 200, on_trackbar);
    // createTrackbar("adapThresholdBlockSize:", "SourceImage", &adapThresholdBlockSize, 500, on_trackbar);
    // createTrackbar("adapThresholdC:", "SourceImage", &adapThresholdC, 500, on_trackbar);
    waitKey(0);
    // edged.release();
    // warped.release();

    return 0;
}
