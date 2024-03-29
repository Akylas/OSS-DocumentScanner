#include <DocumentDetector.h>
#include <WhitePaperTransform.h>
#include <ColorSimplificationTransform.h>
#include <Utils.h>
#include <jsoncons/json.hpp>
using namespace detector;
using namespace cv;
using namespace std;

// JSONCONS_ALL_MEMBER_TRAITS(cv::Point, x, y);

typedef std::pair<std::vector<cv::Point>, double> PointAndArea;
DocumentDetector::DocumentDetector(cv::Mat &bitmap, int resizeThreshold, int imageRotation, double scale)
{
    image = bitmap;
    DocumentDetector::resizeThreshold = resizeThreshold;
    DocumentDetector::imageRotation = imageRotation;
    DocumentDetector::scale = scale;
}
DocumentDetector::DocumentDetector(cv::Mat &bitmap, int resizeThreshold, int imageRotation)
{
    image = bitmap;
    DocumentDetector::resizeThreshold = resizeThreshold;
    DocumentDetector::imageRotation = imageRotation;
}

DocumentDetector::DocumentDetector(int resizeThreshold, int imageRotation, double scale)
{
    DocumentDetector::resizeThreshold = resizeThreshold;
    DocumentDetector::imageRotation = imageRotation;
    DocumentDetector::scale = scale;
}
DocumentDetector::DocumentDetector(int resizeThreshold, int imageRotation)
{
    DocumentDetector::resizeThreshold = resizeThreshold;
    DocumentDetector::imageRotation = imageRotation;
}

DocumentDetector::DocumentDetector()
{
}

DocumentDetector::~DocumentDetector()
{
}

void sortPoints(std::vector<cv::Point> &points)
{
    // sort by Y
    std::sort(points.begin(), points.end(),
              [](Point const &a, Point const &b)
              { return a.y < b.y; });
    // sort by X
    std::sort(points.begin(), points.begin() + 2,
              [](Point const &a, Point const &b)
              { return a.x < b.x; });
    // sort second half by  X descending
    std::sort(points.begin() + 2, points.end(),
              [](Point const &a, Point const &b)
              { return a.x > b.x; });
}

double angle(cv::Point pt1, cv::Point pt2, cv::Point pt0)
{
    double dx1 = pt1.x - pt0.x;
    double dy1 = pt1.y - pt0.y;
    double dx2 = pt2.x - pt0.x;
    double dy2 = pt2.y - pt0.y;
    return (dx1 * dx2 + dy1 * dy2) /
           sqrt((dx1 * dx1 + dy1 * dy1) * (dx2 * dx2 + dy2 * dy2) + 1e-10);
}
bool sortByArea(PointAndArea contour1, PointAndArea contour2)
{
    return (contour1.second > contour2.second);
}

// Function to compute the intersection point of two line segments defined by Vec4i
bool computeIntersection(const Vec4i &line1, const Vec4i &line2, Point &r)
{
    Point o1(line1[0], line1[1]);
    Point p1(line1[2], line1[3]);
    Point o2(line2[0], line2[1]);
    Point p2(line2[2], line2[3]);

    float angle1 = abs(atan2(o1.y - p1.y, o1.x - p1.x));
    float angle2 = abs(atan2(o2.y - p2.y, o2.x - p2.x));
    if (abs(angle1 - angle2) < 0.4)
    {
        return false;
    }
    Point x = o2 - o1;
    Point d1 = p1 - o1;
    Point d2 = p2 - o2;

    float cross = d1.x * d2.y - d1.y * d2.x;

    double t1 = (x.x * d2.y - x.y * d2.x) / cross;
    r = o1 + d1 * t1;
    if (r.x >= 0 && r.y >= 0)
    {
        return true;
    }
    return false;
}

// Function to cluster intersection points based on distance
vector<vector<Point>> clusterIntersectionPoints(const vector<Vec4i> &lines, float maxDistance)
{
    vector<vector<Point>> clusters;
    size_t numLines = lines.size();

    // Compute intersection points for each pair of line segments
    for (size_t i = 0; i < numLines; ++i)
    {
        for (size_t j = i + 1; j < numLines; ++j)
        {
            Point intersection;
            if (computeIntersection(lines[i], lines[j], intersection))
            {
                // Check if the intersection point is close to any existing cluster
                bool clustered = false;
                for (auto &cluster : clusters)
                {
                    for (const auto &point : cluster)
                    {
                        if (norm(point - intersection) < maxDistance)
                        {
                            cluster.push_back(intersection);
                            clustered = true;
                            break;
                        }
                    }
                    if (clustered)
                        break;
                }
                // If not close to any existing cluster, create a new cluster
                if (!clustered)
                {
                    clusters.push_back({intersection});
                }
            }
        }
    }

    return clusters;
}

bool DocumentDetector::findSquares(cv::Mat srcGray, double scaledWidth, double scaledHeight,
                                   std::vector<std::pair<std::vector<cv::Point>, double>> &squares, cv::Mat drawImage, bool drawContours, float weight)
{
    int marge = static_cast<int>(scaledWidth * 0.01);
    // Contours search
    std::vector<std::vector<cv::Point>> contours;
    vector<Vec4i> hierarchy;
    cv::findContours(srcGray, contours, hierarchy, cv::RETR_TREE, cv::CHAIN_APPROX_SIMPLE);
    std::sort(contours.begin(), contours.end(), compareContourAreas);
    // if (drawContours) {
    //     cv::drawContours(drawImage, contours, -1, (0,255,0), 2);
    // }
    std::vector<Point> approx;
    // std::vector<std::vector<Point>> approxs;
    for (size_t i = 0; i < contours.size(); i++)
    {
        std::vector<Point> contour = contours[i];
        double arcLength = cv::arcLength(contour, true);
        double area = cv::contourArea(contour);
        if (arcLength < 100 || area < 1000)
        {
            continue;
        }

        // Detection of geometric shapes
        double epsilon = arcLength * contoursApproxEpsilonFactor;
        cv::approxPolyDP(contour, approx, epsilon, true);
        // approxs.push_back(approx);

        // Detection of quadrilaterals among geometric shapes
        if (approx.size() == 4 && cv::isContourConvex(approx))
        {
            // cv::RotatedRect boundingRect = cv::minAreaRect(contour);
            // Point2f rectPoints[4];
            // boundingRect.points(rectPoints);
            // approx={rectPoints[0], rectPoints[1],rectPoints[2],rectPoints[3]};

            bool shouldIgnore = false;
            for (const cv::Point &p : approx)
            {
                if (p.x < marge || p.x >= scaledWidth - marge || p.y < marge || p.y >= scaledHeight - marge)
                {
                    shouldIgnore = true;
                    break;
                }
            }
            if (shouldIgnore)
            {
                continue;
            }

            // const double area = std::abs(contourArea(approx));
            if (area > scaledWidth / areaScaleMinFactor * (scaledHeight / areaScaleMinFactor))
            {

                double maxCosine = 0.0;
                double minCosine = 100.0;
                double meanCosine = 0;
                for (int j = 2; j < 6; j++)
                {
                    double cosine = std::abs(angle(approx[j % 4], approx[j - 2], approx[(j - 1) % 4]));
                    maxCosine = std::max(maxCosine, cosine);
                    minCosine = std::min(minCosine, cosine);
                    meanCosine += cosine;
                }
                // Selection of quadrilaterals with large enough angles
                // std::printf("found contour %f %zu %f %f\n", area, approx.size(), minCosine, maxCosine);
                if (maxCosine < 0.4)
                {
                    // Mat houghLines;
                    if (houghLinesThreshold > 0)
                    {
                        Mat houghLines = Mat(srcGray.rows, srcGray.cols, CV_8U, cv::Scalar(0, 0, 0));
                        cv::polylines(houghLines, contour, true, Scalar(255, 0, 0), 5, 8);

                        // std::printf("HoughLinesP %f %f %f\n", houghLinesThreshold, houghLinesMinLineLength, houghLinesMaxLineGap);
                        vector<Vec4i> lineSegments;
                        // will hold the results of the detection
                        cv::HoughLinesP(houghLines, lineSegments, 1, CV_PI / 180, houghLinesThreshold, houghLinesMinLineLength, houghLinesMaxLineGap); // runs the actual detection
                        // Draw the lines

                        if (drawContours)
                        {
                            int distance = 1000;
                            for (const auto &l : lineSegments)
                            {
                                // lines.push_back(convertToPolar(l));
                                double diff = atan2(l[1] - l[3], l[0] - l[2]);
                                int x3 = l[0] + distance * cos(diff);
                                int y3 = l[1] + distance * sin(diff);
                                int x4 = l[0] - distance * cos(diff);
                                int y4 = l[1] - distance * sin(diff);
                                cv::line(drawImage, Point(x3, y3), Point(x4, y4), Scalar(255, 255, 255), 1, cv::LINE_8);
                            }
                        }
                        int maxDistance = min(scaledWidth, scaledHeight) / 10.0;
                        vector<vector<Point>> intersectionClusters = clusterIntersectionPoints(lineSegments, maxDistance); // Adjust distance threshold as needed

                        // // Print the clustered intersection points
                        if (drawContours) {
                            for (size_t i = 0; i < intersectionClusters.size(); ++i)
                            {
                                // cout << "Cluster " << i + 1 << ": ";
                                // for (const auto& point : intersectionClusters[i]) {
                                //     // cout << "(" << point.x << ", " << point.y << ") ";
                                // }
                                circle(drawImage, intersectionClusters[i][0], 4, Scalar(0, 255, 0), FILLED);
                                // cout << endl;
                            }
                        }
                        if (intersectionClusters.size() == 4)
                        {

                            approx[0] = intersectionClusters[0][0];
                            approx[1] = intersectionClusters[1][0];
                            approx[2] = intersectionClusters[2][0];
                            approx[3] = intersectionClusters[3][0];
                            if (drawContours)
                            {
                                sortPoints(approx);
                            }
                        }
                    }
                    // we give more weight for low cosinus (closer to 90d angles)
                    squares.push_back(std::pair<std::vector<cv::Point>, double>(approx, area * weight * (1 - meanCosine)));

                    if (drawContours)
                    {
                        cv::polylines(drawImage, approx, true, Scalar(0, 255, 0), 1, 8);
                        cv::polylines(drawImage, contour, true, Scalar(255, 0, 0), 1, 8);
                        // cv::drawContours(drawImage, [approx], -1, Scalar(0, 255, 0), 1);
                    }
                    if (maxCosine < 0.3 && area > (scaledWidth * scaledHeight / 4))
                    {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

std::string DocumentDetector::scanPointToJSON()
{
    vector<vector<cv::Point>> result = scanPoint();
    jsoncons::json jsonResult(jsoncons::json_array_arg);
    for (const auto &points : result)
    {
        jsoncons::json jsonResult1(jsoncons::json_array_arg);
        for (const auto &point : points)
        {
            jsonResult1.push_back(jsoncons::json(jsoncons::json_array_arg, {point.x, point.y}));
        }
        jsonResult.push_back(jsonResult1);
    }
    std::string s;
    encode_json(jsonResult, s, jsoncons::indenting::no_indent);
    return s;
}

vector<vector<cv::Point>> DocumentDetector::scanPoint()
{
    Mat edged;
    vector<vector<cv::Point>> result = scanPoint(edged);
    return result;
}
vector<vector<cv::Point>> DocumentDetector::scanPoint(Mat &edged)
{
    resizedImage = resizeImageMax();
    return scanPoint(edged, resizedImage, false);
}
vector<vector<cv::Point>> DocumentDetector::scanPoint(Mat &edged, Mat &image)
{
    return scanPoint(edged, image, false);
}

void correctGamma(const Mat &img, const Mat &dest, const double gamma_)
{
    CV_Assert(gamma_ >= 0);
    //! [changing-contrast-brightness-gamma-correction]
    Mat lookUpTable(1, 256, CV_8U);
    uchar *p = lookUpTable.ptr();
    for (int i = 0; i < 256; ++i)
        p[i] = saturate_cast<uchar>(pow(i / 255.0, gamma_) * 255.0);

    Mat res = img.clone();
    LUT(img, lookUpTable, dest);
    //! [changing-contrast-brightness-gamma-correction]
}

vector<vector<cv::Point>> DocumentDetector::scanPoint(Mat &edged, Mat &image, bool drawContours)
{
    // auto t_start = std::chrono::high_resolution_clock::now();
    if (image.empty())
    {
        resizedImage = resizeImageMax();
        image = resizedImage;
    }

    if (imageRotation != 0)
    {
        switch (imageRotation)
        {
        case 90:
            rotate(image, image, ROTATE_90_CLOCKWISE);
            break;
        case 180:
            rotate(image, image, ROTATE_180);
            break;
        default:
            rotate(image, image, ROTATE_90_COUNTERCLOCKWISE);
            break;
        }
    }

    Size size = image.size();
    double width = size.width;
    double height = size.height;
    std::vector<PointAndArea> foundSquares;
    int iterration = 0;
    cv::Mat temp1;
    cv::Mat temp2;
    medianBlur(image, temp1, medianBlurValue);

    cv::Mat dilateStruct = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(dilateAnchorSize, dilateAnchorSize));
    cv::Mat morphologyStruct = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(morphologyAnchorSize, morphologyAnchorSize));
    int channelsCount = std::min(image.channels(), 3);
    int i = channelsCount - 1;
    int minI = 0;
    if (useChannel >= 0)
    {
        channelsCount = 1;
        i = useChannel;
        minI = useChannel;
    }
    // cvtColor(temp1, temp2, COLOR_BGR2GRAY);
    // we give more weight to contours found with threshod then with higher canny
    float weight = 30;
    bool shoudlBreak = false;
    for (i = i; i >= minI; i--)
    {
        //  std::printf("testing on channel %i %i\n", i, iterration);
        cv::extractChannel(temp1, temp2, i);

        Mat out;
        // bilateralFilter is really slow so for now we dont use it
        cv::bilateralFilter(temp2, out, 15, bilateralFilterValue, bilateralFilterValue);
        cv::threshold(temp2, edged, thresh, threshMax, cv::THRESH_BINARY);
        cv::morphologyEx(edged, edged, cv::MORPH_CLOSE, morphologyStruct);
        cv::dilate(edged, edged, dilateStruct);
        shoudlBreak = findSquares(edged, width, height, foundSquares, image, drawContours, (weight--) / 100);
        if (shoudlBreak)
        {
            break;
        }
        iterration++;
        // we test over all channels to find the best contour
        int t = 60;
        while (t >= 10)
        {
            cv::Canny(temp2, edged, t * cannyFactor, cannyFactor * t * 2);
            cv::dilate(edged, edged, dilateStruct);
            shoudlBreak = findSquares(edged, width, height, foundSquares, image, drawContours, (weight--) / 100);
            if (shoudlBreak)
            {
                break;
            }
            iterration++;
            t -= 10;
            // break;
        }
    }

    // if (useChannel > 0 && (useChannel <= image.channels()))
    // {
    //     extractChannel(image, edged, useChannel - 1);
    // }
    // else
    // {
    //     cvtColor(image, edged, COLOR_BGR2GRAY);
    // }

    // if (bilateralFilterValue > 0)
    // {
    //     Mat out;
    //     std::printf("bilateralFilter %f\n", bilateralFilter);
    //     bilateralFilter(edged, out, 15, bilateralFilterValue, bilateralFilterValue);
    //     out.copyTo(edged);
    // }

    // if (medianBlurValue > 0)
    // {
    //     std::printf("medianBlur %f\n", medianBlurValue);
    //     medianBlur(edged, edged, medianBlurValue);
    // }

    // if (adapThresholdBlockSize > 1 && adapThresholdC > 0)
    // {
    //     std::printf("adaptiveThreshold %f %f\n", adapThresholdBlockSize, adapThresholdC);
    //     cv::adaptiveThreshold(edged, edged, 255, cv::ADAPTIVE_THRESH_GAUSSIAN_C, cv::THRESH_BINARY, adapThresholdBlockSize, adapThresholdC);
    // }

    // if (gaussianBlur > 0)
    // {
    //     std::printf("gaussianBlur %f\n", gaussianBlur);
    //     GaussianBlur(edged, edged, cv::Size(gaussianBlur, gaussianBlur), cannySigmaX);
    // }

    // if (thresh > 0 && threshMax > 0)
    // {
    //     std::printf("threshold %f %f\n", thresh, threshMax);
    //     cv::threshold(edged, edged, thresh, threshMax, cv::THRESH_BINARY);
    // }
    // if (morphologyAnchorSize > 2)
    // {
    //     std::printf("morphologyEx %f\n", morphologyAnchorSize);
    //     cv::Mat structuringElmt = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(morphologyAnchorSize, morphologyAnchorSize));
    //     morphologyEx(edged, edged, cv::MORPH_CLOSE, structuringElmt);
    // }

    // if (dilateAnchorSizeBefore > 0)
    // {
    //     std::printf("dilate %f\n", dilateAnchorSizeBefore);
    //     cv::Mat structuringElmt = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(dilateAnchorSizeBefore, dilateAnchorSizeBefore));
    //     dilate(edged, edged, structuringElmt);
    // }

    // if (gammaCorrection > 0)
    // {
    //     std::printf("gammaCorrection %f\n", gammaCorrection);
    //     correctGamma(edged, edged, gammaCorrection);
    // }

    // if (shouldNegate == 1)
    // {
    //     bitwise_not(edged, edged);
    // }
    // if (cannyThreshold1 > 0 || cannyThreshold2 > 0)
    // {
    //     std::printf("Canny %f %f\n", cannyThreshold1, cannyThreshold2);
    //     Canny(edged, edged, cannyThreshold1, cannyThreshold2);
    // }

    // if (dilateAnchorSize > 0)
    // {
    //     std::printf("dilate after %f\n", dilateAnchorSize);
    //     cv::Mat structuringElmt = cv::getStructuringElement(cv::MORPH_RECT, cv::Size(dilateAnchorSize, dilateAnchorSize));
    //     dilate(edged, edged, structuringElmt);
    // }

    // // Probabilistic Line Transform
    // Mat houghLines;
    // if (houghLinesThreshold > 0)
    // {
    //     houghLines = Mat(edged.rows, edged.cols, CV_8U, cv::Scalar(0, 0, 0));
    //     std::printf("HoughLinesP %f %f %f\n", houghLinesThreshold, houghLinesMinLineLength, houghLinesMaxLineGap);
    //     vector<Vec4i> lines;
    //     // will hold the results of the detection
    //     cv::HoughLinesP(edged, lines, 1, CV_PI / 180, houghLinesThreshold, houghLinesMinLineLength, houghLinesMaxLineGap); // runs the actual detection
    //     // Draw the lines
    //     int distance = 1000;

    //     for (size_t i = 0; i < lines.size(); i++)
    //     {
    //         Vec4i l = lines[i];
    //         double diff = atan2(l[1] - l[3], l[0] - l[2]);
    //         int x3 = l[0] + distance * cos(diff);
    //         int y3 = l[1] + distance * sin(diff);
    //         int x4 = l[0] - distance * cos(diff);
    //         int y4 = l[1] - distance * sin(diff);
    //         cv::line(houghLines, Point(x3, y3), Point(x4, y4), Scalar(255, 255, 255), 2, cv::LINE_8);
    //     }
    //     imshow("HoughLinesP", houghLines);
    // }
    // if (houghLines.empty())
    // {
    //     findSquares(edged, width, height, foundSquares, image, drawContours);
    // }
    // else
    // {
    //     findSquares(houghLines, width, height, foundSquares, image, drawContours);
    // }

    if (foundSquares.size() > 0)
    {
        std::sort(foundSquares.begin(), foundSquares.end(), sortByArea);
        // auto t_end = std::chrono::high_resolution_clock::now();

        // auto elapsed_time_ms = duration_cast<std::chrono::milliseconds>(t_end - t_start);
        // std::printf("found square %i %d ms\n", iterration, elapsed_time_ms.count());
        std::vector<std::vector<Point>> result;
        // for now we return only one. Need to see how to prevent overlapping squares
        for (int i = 0; i < 1; i++)
        {
            std::vector<Point> points = foundSquares[i].first;
            for (int j = 0; j < points.size(); j++)
            {
                if (borderSize > 0)
                {
                    points[j] -= Point(borderSize, borderSize);
                }
                points[j] *= resizeScale * scale;
            }
            sortPoints(points);
            result.push_back(points);
        }

        return result;
    }
    return vector<vector<Point>>();
}
Mat DocumentDetector::resizeImageToSize(int size)
{

    int width = image.cols;
    int height = image.rows;
    if (resizeThreshold > 0 && size > resizeThreshold)
    {
        resizeScale = 1.0f * size / resizeThreshold;
        width = static_cast<int>(width / resizeScale);
        height = static_cast<int>(height / resizeScale);
        Size size(width, height);
        Mat resizedBitmap(size, CV_8UC3);
        resize(image, resizedBitmap, size);
        if (borderSize > 0)
        {
            copyMakeBorder(resizedBitmap, resizedBitmap, borderSize, borderSize, borderSize, borderSize, BORDER_REPLICATE);
        }
        return resizedBitmap;
    }
    if (borderSize > 0)
    {
        Mat resizedBitmap;
        copyMakeBorder(image, resizedBitmap, borderSize, borderSize, borderSize, borderSize, BORDER_REPLICATE);
        return resizedBitmap;
    }
    return image;
}
Mat DocumentDetector::resizeImage()
{
    // add borders to image
//    if (resizeThreshold <= 0)
//    {
//        return image;
//    }

    int width = image.cols;
    int height = image.rows;
    int minSize = min(width, height);
    return resizeImageToSize(minSize);
}
Mat DocumentDetector::resizeImageMax()
{
    // add borders to image
//    if (resizeThreshold <= 0)
//    {
//        return image;
//    }
    int width = image.cols;
    int height = image.rows;
    int maxSize = max(width, height);
    return resizeImageToSize(maxSize);
}
// auto splitString(std::string in, char sep)
// {
//     std::vector<std::string> r;
//     r.reserve(std::count(in.begin(), in.end(), sep) + 1); // optional
//     for (auto p = in.begin();; ++p)
//     {
//         auto q = p;
//         p = std::find(p, in.end(), sep);
//         r.emplace_back(q, p);
//         if (p == in.end())
//             return r;
//     }
// }

void splitString(const string &str, const string &delimiters, vector<string> &tokens)
{
    // Skip delimiters at beginning.
    string::size_type lastPos = str.find_first_not_of(delimiters, 0);
    // Find first "non-delimiter".
    string::size_type pos = str.find_first_of(delimiters, lastPos);

    while (string::npos != pos || string::npos != lastPos)
    {
        // Found a token, add it to the vector.
        tokens.push_back(str.substr(lastPos, pos - lastPos));
        // Skip delimiters.  Note the "not_of"
        lastPos = str.find_first_not_of(delimiters, pos);
        // Find next "non-delimiter"
        pos = str.find_first_of(delimiters, lastPos);
    }
}

void DocumentDetector::applyTransforms(Mat &srcMat, std::string transforms, bool useRGB)
{
    // cout << "applyTransforms = " << transforms << endl;
    std::vector<std::string> transformArray;
    splitString(transforms, "|", transformArray);
    for (size_t i = 0; i < transformArray.size(); i++)
    {
        std::string transform = transformArray[i];
        if (transform.starts_with("whitepaper"))
        {
            std::vector<std::string> options;
            splitString(transform, "_", options);
            if (options.size() > 1)
            {
                whiteboardEnhance(srcMat, srcMat, options[1]);
            }
            else
            {
                whiteboardEnhance(srcMat, srcMat, "");
            }
        }
        else if (transform.starts_with("enhance"))
        {
            cv::detailEnhance(srcMat, srcMat, 10, 0.15);
        }
        else if (transform.starts_with("color"))
        {
            int resizeThreshold = 100;
            int colorsFilterDistanceThreshold = 20;
            int distanceThreshold = 40;
            ColorSpace colorSpace = ColorSpace::HSV;
            ColorSpace paletteColorSpace = ColorSpace::BGR;
            int paletteNbColors = 5;
            std::vector<std::string> options;
            splitString(transform, "_", options);
            if (options.size() > 1)
            {
                resizeThreshold = std::stoi(options[1]);

                if (options.size() > 2)
                {
                    distanceThreshold = std::stoi(options[2]);

                    if (options.size() > 3)
                    {
                        paletteNbColors = std::stoi(options[3]);

                        if (options.size() > 4)
                        {
                            colorSpace = (ColorSpace)std::stoi(options[4]);
                        }
                    }
                }
            }
            colorSimplificationTransform(srcMat, srcMat, useRGB, resizeThreshold, colorsFilterDistanceThreshold, distanceThreshold, paletteNbColors, colorSpace, paletteColorSpace);
        }
    }
}
