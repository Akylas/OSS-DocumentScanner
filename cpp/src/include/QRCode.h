#ifndef QRCODE_H
#define QRCODE_H

#include <opencv2/opencv.hpp>
#include <jsoncons/json.hpp>

#ifdef __APPLE__
#include <ZXingCpp/ReadBarcode.h>
#else
#include <ReadBarcode.h>
#endif

struct ScanPlusQRCodeResult {
    std::vector<std::vector<cv::Point>> points;
    ZXing::Results qrcodes;
    float resizeScale;
};

cv::Mat generateQRCode(std::string text, std::string format, int width, int height, std::string options);
std::string readQRCode(cv::Mat &srcMat, int rotation, std::string options, double scale);
std::string generateQRCodeSVG(std::string text, std::string format, int size_hint, std::string options);

JSONCONS_ALL_MEMBER_TRAITS(ScanPlusQRCodeResult, points, qrcodes, resizeScale);

JSONCONS_ENUM_TRAITS(ZXing::BarcodeFormat, None, Aztec, Codabar, Code39, Code93, Code128, DataBar, DataBarExpanded, DataMatrix, EAN8, EAN13, ITF, MaxiCode, PDF417, QRCode, UPCA, UPCE, MicroQRCode);
//JSONCONS_ALL_GETTER_CTOR_TRAITS(ZXing::Position, topLeft, topRight, bottomRight, bottomLeft);
JSONCONS_ALL_MEMBER_TRAITS(ZXing::PointI, x, y);
JSONCONS_N_CTOR_GETTER_TRAITS(ZXing::Result, 1, text, format, ecLevel, orientation, isMirrored, isInverted, position);

#endif //UTILS_H
