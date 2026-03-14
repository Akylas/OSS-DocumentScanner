#ifndef DOCUMENT_WHITEBOARD_H
#define DOCUMENT_WHITEBOARD_H

#include <opencv2/opencv.hpp>


struct WhitePaperTransformOptions {
    int csBlackPer = 2;
    double csWhitePer = 99.5;
    int gaussKSize = 3;
    double gaussSigma = 1.0;
    double gammaValue = 1.1;
    int cbBlackPer = 2;
    int cbWhitePer = 1;
    int dogKSize = 15;
    int dogSigma1 = 100.0;
    int dogSigma2 = 0.0;
};

void whiteboardEnhance(const cv::Mat &img, cv::Mat &dst, const std::string &optionsJson);

// Fast alternative algorithm using CLAHE and morphological operations
// 5-10x faster than DoG-based approach, good for most documents
void whiteboardEnhanceFast(const cv::Mat &img, cv::Mat &dst, 
                           double clipLimit = 3.0, int tileGridSize = 8);

#endif //DOCUMENT_WHITEBOARD_H
