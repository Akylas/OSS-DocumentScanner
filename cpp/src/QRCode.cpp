#include "./include/QRCode.h"
#include "BitMatrix.h"

using namespace std;

ZXing::ImageView ImageViewFromMat(const cv::Mat& image)
{
    using ZXing::ImageFormat;

    auto fmt = ImageFormat::None;
    switch (image.channels()) {
        case 1: fmt = ImageFormat::Lum; break;
        case 3: fmt = ImageFormat::BGR; break;
        case 4: fmt = ImageFormat::BGRX; break;
    }

    if (image.depth() != CV_8U || fmt == ImageFormat::None)
        return {nullptr, 0, 0, ImageFormat::None};

    return {image.data, image.cols, image.rows, fmt};
}



namespace jsoncons {
    template<class Json>
    struct json_type_traits<Json, ZXing::Position>
    {
        using allocator_type = typename Json::allocator_type;
        static Json to_json(const ZXing::Position& val,
                            allocator_type allocator=allocator_type())
        {
            Json j(json_array_arg);
            Json j1(json_array_arg);
            j1.push_back( val.topLeft().x);
            j1.push_back( val.topLeft().y);
            j.push_back(j1);
            j1.clear();
            j1.push_back( val.topRight().x);
            j1.push_back( val.topRight().y);
            j.push_back(j1);
            j1.clear();
            j1.push_back( val.bottomRight().x);
            j1.push_back( val.bottomRight().y);
            j.push_back(j1);
            j1.clear();
            j1.push_back( val.bottomLeft().x);
            j1.push_back( val.bottomLeft().y);
            j.push_back(j1);
            return j;
        }
    };
} // namespace jsoncons


std::string readQRCode(cv::Mat &srcMat, int jRotation, string options)
{
    auto hints = ZXing::DecodeHints().setFormats(ZXing::BarcodeFormat::Any).setMaxNumberOfSymbols(1);
    double scale = 1.0f;
    int rotation = jRotation;
    if (!options.empty()) {
        jsoncons::json j = jsoncons::json::parse(options);

        if (j.contains("tryHarder")) {
            hints = hints.setTryHarder(j["tryHarder"].as<bool>());
        }
        if (j.contains("rotation")) {
            rotation = j["rotation"].as<int>();
        }
        if (j.contains("resizeThreshold")) {
            double resizeThreshold = j["resizeThreshold"].as<double>();
            int width = srcMat.cols;
            int height = srcMat.rows;
            int size = max(width, height);
            if (size > resizeThreshold) {
                scale = 1.0f * size / resizeThreshold;
                cv::Size size(width / scale, height / scale);
                cv::Mat resizedBitmap(size, CV_8UC3);
                resize(srcMat, resizedBitmap, size);
                srcMat.release();
                srcMat  = resizedBitmap;
            }
        }
    }
    ZXing::Results results = ZXing::ReadBarcodes(ImageViewFromMat(srcMat).rotated(rotation), hints);
    for (int i = 0; i < results.size(); ++i) {
        auto position = results[i].position();
        auto topLeft = position.topLeft();
        auto topRight = position.topRight();
        auto bottomRight = position.bottomRight();
        auto bottomLeft = position.bottomLeft();
        results[i].setPosition(ZXing::QuadrilateralI(ZXing::PointI(topLeft.x * scale, topLeft.y * scale),
                                                     ZXing::PointI(topRight.x * scale, topRight.y * scale),
                                                     ZXing::PointI(bottomRight.x * scale, bottomRight.y * scale),
                                                     ZXing::PointI(bottomLeft.x * scale, bottomLeft.y * scale)));
    }
    
    string s;
    encode_json(results, s, jsoncons::indenting::no_indent);
    return s;
}

cv::Mat generateQRCode(std::string text, std::string format, int width, int height, std::string options)
{
    auto writer = ZXing::MultiFormatWriter(ZXing::BarcodeFormatFromString(format));
    if (!options.empty()) {
        jsoncons::json j = jsoncons::json::parse(options);

        if (j.contains("encoding")) {
            writer = writer.setEncoding(ZXing::CharacterSetFromString(j["encoding"].as<string>()));
        }
        if (j.contains("ecclevel")) {
            writer = writer.setEccLevel(j["ecclevel"].as<int>());
        }
        if (j.contains("margin")) {
            writer = writer.setMargin(j["margin"].as<int>());
        }
    }
    auto matrix = writer.encode(text, width, height);
    auto bitmap = ToMatrix<uint8_t>(matrix);
    const unsigned char *buffer = bitmap.data();
    cv::Mat resultMat(height,width,CV_8UC1,(unsigned char*)buffer);
    return resultMat;
}