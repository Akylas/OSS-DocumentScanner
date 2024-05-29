#ifndef UTILS_H
#define UTILS_H

#include <opencv2/opencv.hpp>
#include <opencv2/core/utility.hpp>


enum class ColorSpace {
    HSV = 0,
    HSL = 1,
    BGR = 2,
    Lab = 3
};

// float normDistance(const cv::Vec3b& color1, const cv::Vec3b& color2);
float colorDistance(const cv::Vec3b &color1, const cv::Vec3b &color2, ColorSpace colorSpace);

int toBGRColorSpace(ColorSpace colorSpace);
int toRGBColorSpace(ColorSpace colorSpace);
int fromBGRColorSpace(ColorSpace colorSpace);
int fromRGBColorSpace(ColorSpace colorSpace);
cv::Vec3b ColorSpaceToBGR(cv::Vec3b color, ColorSpace colorSpace);
cv::Vec3b BGRToColorSpace(cv::Vec3b color, ColorSpace colorSpace);

bool compareContourAreas(std::vector<cv::Point> contour1, std::vector<cv::Point> contour2);

template <typename T>
std::string int_to_hex(T val, size_t width=sizeof(T)*2);
std::string BGRHexString(cv::Vec3b bgr) ;

cv::Mat resizeImageToSize(const cv::Mat &image, int size, int resizeThreshold);

std::vector<std::pair<cv::Vec3b, float>> getPalette(const cv::Mat&src, bool isRGB, int resizeThreshold = 200,
                                                    int colorsFilterDistanceThreshold = 20, int nbColors = -1, bool returnAsBGR = false, ColorSpace colorSpace = ColorSpace::BGR);
std::string getPaletteString(const cv::Mat&src, bool isRGB, int resizeThreshold = 200,
                                                    int colorsFilterDistanceThreshold = 20, int nbColors = -1, bool returnAsBGR = false, ColorSpace colorSpace = ColorSpace::BGR);
std::vector<std::pair<cv::Vec3b, float>> getPaletteFrom1Row(const cv::Mat &src, int colorsFilterDistanceThreshold = 20, int nbColors = -1, bool HLS = false, ColorSpace colorSpace = ColorSpace::BGR);
#endif //UTILS_H
