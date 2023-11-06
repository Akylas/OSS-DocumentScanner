#ifndef DOCUMENT_OCR_H
#define DOCUMENT_OCR_H

#include <opencv2/opencv.hpp>

using namespace cv;
using namespace std;

namespace detector {
    class DocumentOCR {
        public:
            static std::string detectText(const Mat &image, const std::string &optionsJson);
    };
}
#endif //DOCUMENT_OCR_H
