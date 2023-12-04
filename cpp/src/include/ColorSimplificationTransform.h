#ifndef COLOR_SIMPLIFICATION_H
#define COLOR_SIMPLIFICATION_H


#include <opencv2/opencv.hpp>
#include "./Utils.h"

std::vector<std::pair<cv::Vec3b, float>> colorSimplificationTransform(const cv::Mat &img, cv::Mat &res, bool isRGB = false, int resizeThreshold = 200, int colorsFilterDistanceThreshold = 20, int distanceThreshold = 15, int paletteNbColors = -1, ColorSpace colorSpace = ColorSpace::Lab);
std::vector<std::pair<cv::Vec3b, float>> colorSimplificationTransform(const cv::Mat &img, cv::Mat &res, bool isRGB, int resizeThreshold, int colorsFilterDistanceThreshold, int distanceThreshold, int paletteNbColors, ColorSpace colorSpace, ColorSpace paletteColorSpace);

#endif //COLOR_SIMPLIFICATION_H
