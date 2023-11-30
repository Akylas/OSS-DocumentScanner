#ifndef DOCUMENT_UTILS_H
#define DOCUMENT_UTILS_H

#include <opencv2/opencv.hpp>


inline bool compareContourAreas(std::vector<cv::Point> contour1, std::vector<cv::Point> contour2)
{
    double i = fabs(contourArea(cv::Mat(contour1)));
    double j = fabs(contourArea(cv::Mat(contour2)));
    return (i > j);
}
#endif //DOCUMENT_UTILS_H
