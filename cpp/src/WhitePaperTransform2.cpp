#include "./include/Log.h"
#include "./include/WhitePaperTransform2.h"
#include <jsoncons/json.hpp>

cv::Mat normalizeKernel2(cv::Mat kernel, int kWidth, int kHeight, double scalingFactor = 1.0)
{
    const double K_EPS = 1.0e-12;
    double posRange = 0, negRange = 0;
    
    // Use direct pointer access for better performance
    double* kernelData = kernel.ptr<double>(0);
    const int totalSize = kWidth * kHeight;

    // First pass: zero small values and accumulate ranges
    for (int i = 0; i < totalSize; ++i)
    {
        double val = kernelData[i];
        if (std::abs(val) < K_EPS)
        {
            kernelData[i] = 0.0;
            continue;
        }
        if (val < 0)
            negRange += val;
        else
            posRange += val;
    }

    // Compute scales
    double posScale = (std::abs(posRange) >= K_EPS) ? scalingFactor / posRange : scalingFactor;
    double negScale = (std::abs(negRange) >= K_EPS) ? scalingFactor / (-negRange) : scalingFactor;

    // Second pass: apply scaling
    for (int i = 0; i < totalSize; ++i)
    {
        double val = kernelData[i];
        if (!std::isnan(val))
        {
            kernelData[i] = val * ((val >= 0) ? posScale : negScale);
        }
    }

    return kernel;
}

void dog2(const cv::Mat &img, cv::Mat &dst, int kSize, double sigma1, double sigma2)
{
    // Custom DoG implementation with kernel normalization
    // This normalization is CRITICAL for document quality - do not replace with simple GaussianBlur
    // The separate positive/negative scaling ensures proper contrast enhancement
    int kWidth = kSize, kHeight = kSize;
    int x = (kWidth - 1) / 2;
    int y = (kHeight - 1) / 2;
    cv::Mat kernel(kWidth, kHeight, CV_64F, cv::Scalar(0.0));
    
    // Use direct pointer access for better performance
    double* kernelData = kernel.ptr<double>(0);

    // First Gaussian kernel
    if (sigma1 > 0)
    {
        const double co1 = 1.0 / (2.0 * sigma1 * sigma1);
        const double co2 = 1.0 / (2.0 * M_PI * sigma1 * sigma1);
        int i = 0;
        for (int v = -y; v <= y; ++v)
        {
            const int vv = v * v;
            for (int u = -x; u <= x; ++u)
            {
                kernelData[i++] = exp(-(u * u + vv) * co1) * co2;
            }
        }
    }
    // Unity kernel
    else
    {
        kernelData[x + y * kWidth] = 1.0;
    }

    // Subtract second Gaussian from the kernel
    if (sigma2 > 0)
    {
        const double co1 = 1.0 / (2.0 * sigma2 * sigma2);
        const double co2 = 1.0 / (2.0 * M_PI * sigma2 * sigma2);
        int i = 0;
        for (int v = -y; v <= y; ++v)
        {
            const int vv = v * v;
            for (int u = -x; u <= x; ++u)
            {
                kernelData[i++] -= exp(-(u * u + vv) * co1) * co2;
            }
        }
    }
    // Unity kernel
    else
    {
        kernelData[x + y * kWidth] -= 1.0;
    }

    // Zero-normalize scaling kernel with a scaling factor of 1.0
    cv::Mat normKernel = normalizeKernel2(kernel, kWidth, kHeight, 1.0);

    cv::filter2D(img, dst, -1, normKernel);
}

void negateImage2(const cv::Mat &img, const cv::Mat &res)
{
    cv::bitwise_not(img, res);
}

std::vector<int> getBlackWhiteIndices2(const cv::Mat &hist, int totCount, int blackCount, int whiteCount)
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

void contrastStretch2(const cv::Mat &img, cv::Mat &res, int blackPoint, int whitePoint)
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
        
        std::vector<int> indices = getBlackWhiteIndices2(hist, totCount, blackCount, whiteCount);
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

void fastGaussianBlur2(const cv::Mat &img, const cv::Mat &res, int kSize, double sigma)
{
    cv::Mat kernel1D = cv::getGaussianKernel(kSize, sigma);
    cv::sepFilter2D(img, res, -1, kernel1D, kernel1D);
}

void gamma2(const cv::Mat &img, const cv::Mat &res, double gammaValue)
{
    double iGamma = 1.0 / gammaValue;
    cv::Mat lut(1, 256, CV_8U);
    uchar* lutData = lut.ptr<uchar>(0);
    for (int i = 0; i < 256; ++i)
    {
        lutData[i] = static_cast<uchar>(pow(i / 255.0, iGamma) * 255.0 + 0.5);
    }
    cv::LUT(img, lut, res);
}
int findLowerBound2(const cv::Mat &hist, int lowCount)
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

int findUpperBound2(const cv::Mat &hist, int highCount)
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

void colorBalance2(const cv::Mat &img, const cv::Mat &res, double lowPer, double highPer)
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

        int li = findLowerBound2(hist, lowCount);
        int hi = findUpperBound2(hist, highCount);

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

void whiteboardEnhance2(const cv::Mat &img, cv::Mat &res, const std::string &optionsJson)
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
    dog2(img, res, options.dogKSize, options.dogSigma1, options.dogSigma2); // 81% time (now optimized)
//    LOGD("WhitePaperTransform dog %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Negative of image
    negateImage2(res, res); //0.3% time
//    LOGD("WhitePaperTransform negateImage2 %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Contrast Stretch (CS)
    contrastStretch2(res, res, options.csBlackPer, options.csWhitePer); //10% time
//    LOGD("WhitePaperTransform contrastStretch2 %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Gaussian Blur
    if (options.gaussKSize > 0) {
        fastGaussianBlur2(res, res, options.gaussKSize, options.gaussSigma); //1.6% time
    }
//    LOGD("WhitePaperTransform fastGaussianBlur2 %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Gamma Correction
    gamma2(res, res, options.gammaValue); //0.3% time
//    LOGD("WhitePaperTransform gamma %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
    // Color Balance (CB) (also Contrast Stretch)
    colorBalance2(res, res, options.cbBlackPer, options.cbWhitePer); // 5% time
//    LOGD("WhitePaperTransform colorBalance2 %d ms", (duration_cast<std::chrono::milliseconds>(std::chrono::high_resolution_clock::now() - t_start).count()));
}