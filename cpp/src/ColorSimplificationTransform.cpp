#include "./include/ColorSimplificationTransform.h"
#include "./include/Utils.h"
// #include <android/log.h>

using namespace cv;
using namespace std;

std::vector<std::pair<Vec3b, float>> colorSimplificationTransform(const cv::Mat &img, cv::Mat &res, bool isRGB, int resizeThreshold,
                                                                  int colorsFilterDistanceThreshold, int distanceThreshold, int paletteNbColors, ColorSpace colorSpace, ColorSpace paletteColorSpace)
{
    int channels = img.channels();

    // Get palette
    std::vector<std::pair<Vec3b, float>> colors = getPalette(img, isRGB, resizeThreshold, colorsFilterDistanceThreshold, paletteNbColors, paletteColorSpace != colorSpace, paletteColorSpace);


    if (paletteColorSpace != colorSpace) {
              for (auto itr = colors.begin(); itr != colors.end(); ++itr) {
                itr->first  = BGRToColorSpace(itr->first, colorSpace);
            }

    }
    if (channels == 4)
    {
        if (isRGB)
        {
            cvtColor(img, res, fromRGBColorSpace(colorSpace));
        }
        else if (colorSpace != ColorSpace::BGR)
        {
            cvtColor(img, res, fromBGRColorSpace(colorSpace));
        }
    }
    else if (isRGB)
    {
        cvtColor(img, res, fromRGBColorSpace(colorSpace));
    }
    else if (colorSpace != ColorSpace::BGR)
    {
        cv::cvtColor(img, res, fromBGRColorSpace(colorSpace));
    }
    for (int i = 0; i < res.rows; i++)
    {
        for (int j = 0; j < res.cols; j++)
        {
            Vec3b pixel = (res.at<Vec3b>(i, j));
            for (int k = 0; k < colors.size(); k++)
            {
                Vec3b color = colors.at(k).first;
                if (colorDistance(pixel, color, colorSpace) < distanceThreshold)
                {
                    // pixel[0] = color[0];
                    // pixel[1] = color[1];
                    // pixel[2] = color[2];
                    res.at<Vec3b>(i, j) = color;
                    break;
                }
            }
        }
    }
    if (isRGB)
    {
        cv::cvtColor(res, res, toBGRColorSpace(colorSpace));
    }
    else if (colorSpace != ColorSpace::BGR)
    {
        cv::cvtColor(res, res, toBGRColorSpace(colorSpace));
    }
    return colors;
}

std::vector<std::pair<Vec3b, float>> colorSimplificationTransform(const cv::Mat &img, cv::Mat &res, bool isRGB, int resizeThreshold,
                                                                  int colorsFilterDistanceThreshold, int distanceThreshold, int paletteNbColors, ColorSpace colorSpace)
{
    return colorSimplificationTransform(img, res, isRGB, resizeThreshold, colorsFilterDistanceThreshold, distanceThreshold, paletteNbColors, colorSpace, colorSpace);
}