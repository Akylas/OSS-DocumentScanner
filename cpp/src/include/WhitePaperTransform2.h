#ifndef DOCUMENT_WHITEBOARD2_H
#define DOCUMENT_WHITEBOARD2_H

#include <opencv2/opencv.hpp>
#include "./WhitePaperTransform.h"

void whiteboardEnhance2(const cv::Mat &img, cv::Mat &dst, const std::string &optionsJson);
#endif //DOCUMENT_WHITEBOARD2_H
