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
    
    // Convert image to target color space
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
        else
        {
            res = img.clone();
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
    else
    {
        res = img.clone();
    }
    
    // Optimize: Process the image in a single pass with better memory access patterns
    const int rows = res.rows;
    const int cols = res.cols;
    const int totalPixels = rows * cols;
    const int paletteSize = colors.size();
    
    // Pre-compute squared distance threshold for faster comparison
    const int distThreshSq = distanceThreshold * distanceThreshold;
    
    // Process pixels - use pointer arithmetic for faster access
    Vec3b* dataPtr = res.ptr<Vec3b>(0);
    
    for (int idx = 0; idx < totalPixels; ++idx)
    {
        Vec3b& pixel = dataPtr[idx];
        
        // Find closest color in palette
        int minDistSq = INT_MAX;
        int bestColorIdx = -1;
        
        for (int k = 0; k < paletteSize; ++k)
        {
            const Vec3b& color = colors[k].first;
            
            // Calculate squared distance to avoid sqrt
            int d0 = pixel[0] - color[0];
            int d1 = pixel[1] - color[1];
            int d2 = pixel[2] - color[2];
            int distSq = d0*d0 + d1*d1 + d2*d2;
            
            if (distSq < minDistSq)
            {
                minDistSq = distSq;
                bestColorIdx = k;
                
                // Early exit if we're close enough
                if (distSq < distThreshSq)
                    break;
            }
        }
        
        // Apply the closest color if within threshold
        if (bestColorIdx >= 0 && minDistSq < distThreshSq)
        {
            pixel = colors[bestColorIdx].first;
        }
    }
    
    // Convert back to BGR
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