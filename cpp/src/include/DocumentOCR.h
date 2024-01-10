#ifndef DOCUMENT_OCR_H
#define DOCUMENT_OCR_H

#include <opencv2/opencv.hpp>
#include <tesseract/baseapi.h>
#include <optional>

using namespace cv;
using namespace std;

namespace detector {
    class DocumentOCR {
        public:

            struct OCRData
            {
                cv::Rect box;
                string text;
                float confidence;
                std::optional<std::string> fontFamily;
                std::optional<bool> monospace;
                std::optional<bool> serif;
                std::optional<bool> smallcaps;
                std::optional<int> fontSize;
                std::optional<std::string> fontWeight;
                std::optional<std::string> fontStyle;
                std::optional<std::string> textDecoration;
                std::optional<int> font_id;
            };
            struct OCRResult
            {
                string text;
                std::vector<OCRData> blocks;
                int imageWidth;
                int imageHeight;
            };
            struct DetectOptions {

                int rotation = 0;
                int adapThresholdBlockSize = 339; // 391
                int adapThresholdC = 47;          // 53

                bool tesseractDemo = true;
                bool trim = false;
                int actualTesseractDetect = 1;
                int desseractDetectContours = 1;

                int textDetectDilate = 40; // 0
                int textDetect1 = 70;      // 34
                int textDetect2 = 4;       // 12

                std::string dataPath = "";
                std::string language = "";
                std::string dpi = "300";
                int pageSegMode = tesseract::PSM_AUTO;
                int iteratorLevel = tesseract::RIL_PARA;
                int oem = tesseract::OcrEngineMode::OEM_DEFAULT;
            };

            static std::optional<OCRResult> detectTextImpl(const Mat &image, Mat &output, const DetectOptions &options, std::optional<std::function<void(int)>> const& progressLambda);
            static std::optional<OCRResult> detectTextImpl(const Mat &image, const DetectOptions &options, std::optional<std::function<void(int)>> const& progressLambda);
            static std::string detectText(const Mat &image, const std::string &optionsJson, std::optional<std::function<void(int)>> const& progressLambda);
    };
}
#endif //DOCUMENT_OCR_H
