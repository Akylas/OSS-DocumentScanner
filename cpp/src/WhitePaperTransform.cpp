#include "./include/Log.h"
#include "./include/WhitePaperTransform.h"
#include <jsoncons/json.hpp>

void dog(const cv::Mat &img, cv::Mat &dst, int kSize, double sigma1, double sigma2)
{
    // Use OpenCV's optimized Gaussian blur for much better performance
    // This is significantly faster than custom kernel computation
    cv::Mat blurred1, blurred2;
    
    if (sigma1 > 0)
    {
        cv::GaussianBlur(img, blurred1, cv::Size(kSize, kSize), sigma1);
    }
    else
    {
        blurred1 = img.clone();
    }
    
    if (sigma2 > 0)
    {
        cv::GaussianBlur(img, blurred2, cv::Size(kSize, kSize), sigma2);
    }
    else
    {
        blurred2 = img.clone();
    }
    
    // Compute the Difference of Gaussians (DoG)
    cv::subtract(blurred1, blurred2, dst);
}

void negateImage(const cv::Mat &img, const cv::Mat &res)
{
    cv::bitwise_not(img, res);
}

std::vector<int> getBlackWhiteIndices(const cv::Mat &hist, int totCount, int blackCount, int whiteCount)
{
    int blackInd = 0;
    int whiteInd = 255;
    int co = 0;
    for (int i = 0; i < hist.rows; ++i)
    {
        co += hist.at<float>(i);
        if (co > blackCount)
        {
            blackInd = i;
            break;
        }
    }
    co = 0;
    for (int i = hist.rows - 1; i >= 0; --i)
    {
        co += hist.at<float>(i);
        if (co > (totCount - whiteCount))
        {
            whiteInd = i;
            break;
        }
    }
    return {blackInd, whiteInd};
}

void contrastStretch(const cv::Mat &img, cv::Mat &res, int blackPoint, int whitePoint)
{
    int totCount = img.rows * img.cols;
    int blackCount = totCount * blackPoint / 100;
    int whiteCount = totCount * whitePoint / 100;
    int channels = std::min(img.channels(), 3);

    // Split channels once
    std::vector<cv::Mat> channelImages;
    cv::split(img, channelImages);
    
    std::vector<cv::Mat> chStretch(channels);
    
    // Process each channel
    for (int i = 0; i < channels; ++i)
    {
        cv::Mat hist;
        cv::calcHist(std::vector<cv::Mat>{channelImages[i]}, {0}, cv::Mat(), hist, {256}, {0, 256});
        
        std::vector<int> indices = getBlackWhiteIndices(hist, totCount, blackCount, whiteCount);
        int blackInd = indices[0];
        int whiteInd = indices[1];
        
        // Build LUT for this channel
        cv::Mat lut(1, 256, CV_8U);
        uchar* lutData = lut.ptr<uchar>(0);
        
        if (whiteInd - blackInd > 0)
        {
            double scale = 255.0 / (whiteInd - blackInd);
            for (int j = 0; j < 256; ++j)
            {
                if (j < blackInd)
                    lutData[j] = 0;
                else if (j > whiteInd)
                    lutData[j] = 255;
                else
                    lutData[j] = static_cast<uchar>((j - blackInd) * scale + 0.5);
            }
        }
        else
        {
            std::fill_n(lutData, 256, 0);
        }
        
        cv::LUT(channelImages[i], lut, chStretch[i]);
    }

    cv::merge(chStretch, res);
}

void fastGaussianBlur(const cv::Mat &img, const cv::Mat &res, int kSize, double sigma)
{
    cv::Mat kernel1D = cv::getGaussianKernel(kSize, sigma);
    cv::sepFilter2D(img, res, -1, kernel1D, kernel1D);
}

void gamma(const cv::Mat &img, const cv::Mat &res, double gammaValue)
{
    double iGamma = 1.0 / gammaValue;
    cv::Mat lut(1, 256, CV_8U);
    for (int i = 0; i < 256; ++i)
    {
        lut.at<uchar>(i) = static_cast<uchar>(pow(i / 255.0, iGamma) * 255);
    }
    cv::LUT(img, lut, res);
}
int findLowerBound(const cv::Mat &hist, int lowCount)
{
    int li = 0;
    int sum = 0;
    for (int i = 0; i < hist.rows; ++i)
    {
        sum += hist.at<float>(i);
        if (sum >= lowCount)
        {
            li = i;
            break;
        }
    }
    return li;
}

int findUpperBound(const cv::Mat &hist, int highCount)
{
    int hi = hist.rows - 1;
    int sum = 0;
    for (int i = hist.rows - 1; i >= 0; --i)
    {
        sum += hist.at<float>(i);
        if (sum >= highCount)
        {
            hi = i;
            break;
        }
    }
    return hi;
}

void colorBalance(const cv::Mat &img, const cv::Mat &res, double lowPer, double highPer)
{
    int totPix = img.cols * img.rows;
    int lowCount = totPix * lowPer / 100;
    int highCount = totPix * (100 - highPer) / 100;

    std::vector<cv::Mat> channels;
    cv::split(img, channels);
    
    std::vector<cv::Mat> csImg(img.channels());

    for (int i = 0; i < img.channels(); ++i)
    {
        cv::Mat hist;
        cv::calcHist(std::vector<cv::Mat>{channels[i]}, {0}, cv::Mat(), hist, {256}, {0, 256});

        int li = findLowerBound(hist, lowCount);
        int hi = findUpperBound(hist, highCount);

        if (li == hi)
        {
            csImg[i] = channels[i];
            continue;
        }

        cv::Mat lut(1, 256, CV_8U);
        uchar* lutData = lut.ptr<uchar>(0);
        
        double scale = (hi - li > 0) ? 255.0 / (hi - li) : 0.0;
        
        for (int j = 0; j < 256; ++j)
        {
            if (j < li)
                lutData[j] = 0;
            else if (j > hi)
                lutData[j] = 255;
            else if (scale > 0)
                lutData[j] = static_cast<uchar>((j - li) * scale + 0.5);
            else
                lutData[j] = 0;
        }

        cv::LUT(channels[i], lut, csImg[i]);
    }

    cv::merge(csImg, res);
}

// New optimized algorithm for document enhancement
// Uses CLAHE for adaptive contrast and bilateral filtering for shadow removal
// This is faster and often produces better results than the DoG-based approach
void documentEnhanceCLAHE(const cv::Mat &img, cv::Mat &res, 
                          double clipLimit, int tileGridSize,
                          int bilateralD, double bilateralSigmaColor, 
                          double bilateralSigmaSpace)
{
    cv::Mat lab;
    cv::cvtColor(img, lab, cv::COLOR_BGR2Lab);
    
    // Split into L, a, b channels
    std::vector<cv::Mat> lab_planes;
    cv::split(lab, lab_planes);
    
    // Apply CLAHE to L channel for contrast enhancement
    cv::Ptr<cv::CLAHE> clahe = cv::createCLAHE(clipLimit, cv::Size(tileGridSize, tileGridSize));
    clahe->apply(lab_planes[0], lab_planes[0]);
    
    // Merge back
    cv::merge(lab_planes, lab);
    cv::cvtColor(lab, res, cv::COLOR_Lab2BGR);
    
    // Apply bilateral filter to reduce noise while preserving edges
    // This helps remove shadows without blurring text
    if (bilateralD > 0)
    {
        cv::Mat filtered;
        cv::bilateralFilter(res, filtered, bilateralD, bilateralSigmaColor, bilateralSigmaSpace);
        res = filtered;
    }
}

// Fast document binarization for black and white documents
// Much faster than DoG-based approach and better for text-heavy documents
void documentBinarizeAdaptive(const cv::Mat &img, cv::Mat &res, 
                               int blockSize, double C)
{
    cv::Mat gray;
    if (img.channels() == 3)
    {
        cv::cvtColor(img, gray, cv::COLOR_BGR2GRAY);
    }
    else
    {
        gray = img;
    }
    
    // Ensure blockSize is odd
    if (blockSize % 2 == 0)
        blockSize++;
    
    // Apply adaptive thresholding with Gaussian weighting
    cv::adaptiveThreshold(gray, res, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, 
                         cv::THRESH_BINARY, blockSize, C);
    
    // Convert back to BGR if input was color
    if (img.channels() == 3)
    {
        cv::cvtColor(res, res, cv::COLOR_GRAY2BGR);
    }
}

void whiteboardEnhance(const cv::Mat &img, cv::Mat &res, const std::string &optionsJson)
{

    WhitePaperTransformOptions options;

    if (!optionsJson.empty())
    {
        jsoncons::json j = jsoncons::json::parse(optionsJson);

        if (j.contains("dogKSize"))
        {
            options.dogKSize = j["dogKSize"].as<int>();
        }
        if (j.contains("dogSigma1"))
        {
            options.dogSigma1 = j["dogSigma1"].as<int>();
        }
        if (j.contains("dogSigma2"))
        {
            options.dogSigma2 = j["dogSigma2"].as<int>();
        }
        if (j.contains("cbBlackPer"))
        {
            options.cbBlackPer = j["cbBlackPer"].as<int>();
        }
        if (j.contains("cbWhitePer"))
        {
            options.cbWhitePer = j["cbWhitePer"].as<int>();
        }
        if (j.contains("csBlackPer"))
        {
            options.csBlackPer = j["csBlackPer"].as<int>();
        }
        if (j.contains("csWhitePer"))
        {
            options.csWhitePer = j["csWhitePer"].as<int>();
        }
        if (j.contains("gaussKSize"))
        {
            options.gaussKSize = j["gaussKSize"].as<int>();
        }
        if (j.contains("gaussSigma"))
        {
            options.gaussSigma = j["gaussSigma"].as<int>();
        }
        if (j.contains("gammaValue"))
        {
            options.gammaValue = j["gammaValue"].as<int>();
        }
    }
//    auto t_start = std::chrono::high_resolution_clock::now();
    // Difference of Gaussian (DoG)
    dog(img, res, options.dogKSize, options.dogSigma1, options.dogSigma2); // 81% time (now optimized)
//    LOGD("WhitePaperTransform dog %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Negative of image
    negateImage(res, res); //0.3% time
//    LOGD("WhitePaperTransform negateImage %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Contrast Stretch (CS)
    contrastStretch(res, res, options.csBlackPer, options.csWhitePer); //10% time
//    LOGD("WhitePaperTransform contrastStretch %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Gaussian Blur
    if (options.gaussKSize > 0) {
        fastGaussianBlur(res, res, options.gaussKSize, options.gaussSigma); //1.6% time
    }
//    LOGD("WhitePaperTransform fastGaussianBlur %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Gamma Correction
    gamma(res, res, options.gammaValue); //0.3% time
//    LOGD("WhitePaperTransform gamma %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Color Balance (CB) (also Contrast Stretch)
    colorBalance(res, res, options.cbBlackPer, options.cbWhitePer); // 5% time
//    LOGD("WhitePaperTransform colorBalance %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
}