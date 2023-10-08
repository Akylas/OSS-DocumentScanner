#include <opencv2/opencv.hpp>

#include <stdio.h>
#include <math.h>
#include <iostream>
#include "./src/include/DocumentDetector.h"
#include "./src/nQuantGpp/PnnQuantizer.h"

using namespace cv;
using namespace std;

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

inline uchar reduceVal(const uchar val)
{
    if (val < 64) return 0;
    if (val < 128) return 64;
    return 255;
	// if (val < 192) return uchar(val / 64.0 + 0.5) * 64;
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

/*
Calculates a table of 256 assignments with the given number of distinct values.

Values are taken at equal intervals from the ranges [0, 128) and [128, 256),
such that both 0 and 255 are always included in the range.
*/
cv::Mat lookupTable(int levels) {
    int factor = 256 / levels;
    cv::Mat table(1, 256, CV_8U);
    uchar *p = table.data;

    for(int i = 0; i < 128; ++i) {
        p[i] = factor * (i / factor);
    }

    for(int i = 128; i < 256; ++i) {
        p[i] = factor * (1 + (i / factor)) - 1;
    }

    return table;
}

/*
Truncates channel levels in the given image to the given number of
equally-spaced values.

Arguments:

image
    Input multi-channel image. The specific color space is not
    important, as long as all channels are encoded from 0 to 255.

levels
    The number of distinct values for the channels of the output
    image. Output values are drawn from the range [0, 255] from
    the extremes inwards, resulting in a nearly equally-spaced scale
    where the smallest and largest values are always 0 and 255.

Returns:

Multi-channel images with values truncated to the specified number of
distinct levels.
*/
cv::Mat colorReduce(const cv::Mat &image, int levels) {
    cv::Mat table = lookupTable(levels);

    std::vector<cv::Mat> c;
    cv::split(image, c);
    for (std::vector<cv::Mat>::iterator i = c.begin(), n = c.end(); i != n; ++i) {
        cv::Mat &channel = *i;
        cv::LUT(channel.clone(), table, channel);
    }

    cv::Mat reduced;
    cv::merge(c, reduced);
    return reduced;
}


Mat testFunc(Mat input) {
	Mat palette = (Mat_<uchar>(5, 3) << 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 255, 255, 255, 255, 255, 255);

    Mat X_query = input.reshape(1, input.rows * input.cols);
    X_query.convertTo(X_query, CV_32F);

    Mat X_index = palette.clone();
    X_index.convertTo(X_index, CV_32F);

    cv::Ptr<cv::ml::KNearest> knn = cv::ml::KNearest::create();
    knn->train(X_index, cv::ml::ROW_SAMPLE, Mat::zeros(palette.rows, 1, CV_32S));

    Mat results, neighbors, dist;
    knn->findNearest(X_query, 1, results, neighbors, dist);

    Mat quantized_image(input.size(), input.type());
    for (int i = 0; i < X_query.rows; ++i) {
        int idx = neighbors.at<float>(i, 0);
        quantized_image.at<Vec3b>(i / input.cols, i % input.cols) = palette.at<Vec3b>(idx, 0);
    }
	return quantized_image;
}

int main(int argc, char **argv)
{
	// Mat image;					 // Declaring a matrix to load the frames//
	// namedWindow("Video Player"); // Declaring the video to show the video//
	// VideoCapture cap(0);		 // Declaring an object to capture stream of frames from default camera//
	// if (!cap.isOpened())
	// { // This section prompt an error message if no video stream is found//
	// 	cout << "No video stream detected" << endl;
	// 	system("pause");
	// 	return -1;
	// }
	// while (true)
	// { // Taking an everlasting loop to show the video//
	// 	cap >> image;
	// 	if (image.empty())
	// 	{ // Breaking the loop if no video frame is detected//
	// 		break;
	// 	}

	// 	Mat edged;
	// 	detector::DocumentDetector docDetector(image, 300, 0);
	// 	vector<vector<cv::Point>> pointsList = docDetector.scanPoint(edged);
	// 	for (size_t i = 0; i < pointsList.size(); i++)
	// 	{
	// 		vector<cv::Point> orderedPoints;
	// 		orderPoints(pointsList[i], orderedPoints);
	// 		polylines(image, pointsList[i], true, Scalar(0, 255, 255), 2);
	// 	}

	// 	imshow("Video Player", image);
	// 	imshow("Edges", edged);
	// 	// if (!warped.empty())
	// 	// {
	// 	// 	imshow("Warped", warped);
	// 	// }
	// 	edged.release();
	// 	// warped.release();
	// 	char c = (char)waitKey(25); // Allowing 25 milliseconds frame processing time and initiating break condition//
	// 	if (c == 27)
	// 	{ // If 'Esc' is entered break the loop//
	// 		break;
	// 	}
	// }
	// cap.release(); // Releasing the buffer memory//
	// return 0;

	// with single image
	Mat image = imread("/home/mguillon/Desktop/IMG_20231004_092528_420.jpg");
	Mat edged;
	Mat warped;
	detector::DocumentDetector docDetector(image, 200, 0);
	Mat resizedImage = docDetector.resizeImage();
	vector<vector<cv::Point>> pointsList = docDetector.scanPoint(edged);

	for (size_t i = 0; i < pointsList.size(); i++)
	{
		vector<cv::Point> orderedPoints;
		orderPoints(pointsList[i], orderedPoints);
		polylines(image, pointsList[i], true, Scalar(0, 255, 255), 2);
	}

	if (pointsList.size() > 0)
	{
		vector<cv::Point> orderedPoints;
		orderPoints(pointsList[0], orderedPoints);
		warped = cropAndWarp(image, orderedPoints);
	}

	imshow("Video Player", resizedImage);
	namedWindow("Edges");
	moveWindow("Edges", 100, 400);
	imshow("Edges", edged);
	edged.release();
	if (!warped.empty())
	{
		// warped = not_so_smart_sharpen(warped, 2.0f, 6.0f, 1.0f);
		// colorReduce(warped, 2);
		// warped = colorReduce(warped, 3);
		warped = testFunc(warped);
		namedWindow("Warped", WINDOW_KEEPRATIO);
		moveWindow("Warped", 900, 100);
		resizeWindow("Warped", 600, 600);
		imshow("Warped", warped);
		warped.release();
	}
	waitKey(0);

	return 0;
}
