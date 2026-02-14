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

// New optimized algorithms for document enhancement
// CLAHE-based enhancement: faster and better for shadow removal while keeping colors
void documentEnhanceCLAHE(const cv::Mat &img, cv::Mat &res, 
                          double clipLimit = 2.0, int tileGridSize = 8,
                          int bilateralD = 9, double bilateralSigmaColor = 75.0, 
                          double bilateralSigmaSpace = 75.0);

// Fast adaptive binarization: much faster than DoG, ideal for text-heavy documents
void documentBinarizeAdaptive(const cv::Mat &img, cv::Mat &res, 
                               int blockSize = 11, double C = 2);

#endif //DOCUMENT_WHITEBOARD_H
