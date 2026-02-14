// Example usage of optimized document scanning algorithms
// This file demonstrates the new functions and optimizations

#include <opencv2/opencv.hpp>
#include "WhitePaperTransform.h"
#include "ColorSimplificationTransform.h"
#include <chrono>
#include <iostream>

using namespace cv;
using namespace std;

// Helper function to measure execution time
template<typename Func>
double measureTime(Func func, const string& name) {
    auto start = chrono::high_resolution_clock::now();
    func();
    auto end = chrono::high_resolution_clock::now();
    chrono::duration<double, milli> duration = end - start;
    cout << name << " took: " << duration.count() << " ms" << endl;
    return duration.count();
}

int main(int argc, char** argv) {
    if (argc < 2) {
        cout << "Usage: " << argv[0] << " <input_image>" << endl;
        return 1;
    }

    // Load input image
    Mat input = imread(argv[1]);
    if (input.empty()) {
        cerr << "Error: Could not load image " << argv[1] << endl;
        return 1;
    }

    cout << "Image size: " << input.cols << "x" << input.rows << endl;
    cout << "Running benchmarks..." << endl << endl;

    // Example 1: CLAHE-based enhancement (NEW - Recommended for color documents)
    Mat claheResult;
    measureTime([&]() {
        documentEnhanceCLAHE(input, claheResult, 2.0, 8, 9, 75.0, 75.0);
    }, "CLAHE Enhancement");
    imwrite("output_clahe.jpg", claheResult);
    cout << "  -> Saved to output_clahe.jpg" << endl << endl;

    // Example 2: Fast adaptive binarization (NEW - Recommended for text documents)
    Mat binarizedResult;
    measureTime([&]() {
        documentBinarizeAdaptive(input, binarizedResult, 11, 2);
    }, "Adaptive Binarization");
    imwrite("output_binarized.jpg", binarizedResult);
    cout << "  -> Saved to output_binarized.jpg" << endl << endl;

    // Example 3: Traditional whitepaper transform (OPTIMIZED)
    Mat whitepaperResult;
    measureTime([&]() {
        whiteboardEnhance(input, whitepaperResult, "{}");
    }, "Whitepaper Transform (Optimized)");
    imwrite("output_whitepaper.jpg", whitepaperResult);
    cout << "  -> Saved to output_whitepaper.jpg" << endl << endl;

    // Example 4: Color simplification (OPTIMIZED)
    Mat colorResult;
    measureTime([&]() {
        // Parameters: resizeThreshold=200, colorsFilterDistanceThreshold=20, 
        //             distanceThreshold=15, paletteNbColors=8, colorSpace=Lab
        colorSimplificationTransform(input, colorResult, false, 200, 20, 15, 8, ColorSpace::Lab);
    }, "Color Simplification (Optimized)");
    imwrite("output_colors.jpg", colorResult);
    cout << "  -> Saved to output_colors.jpg" << endl << endl;

    // Performance comparison with different image sizes
    cout << "Performance Scaling Test:" << endl;
    vector<Size> sizes = {
        Size(640, 480),   // VGA
        Size(1280, 960),  // 1.2MP
        Size(1920, 1440), // 2.8MP
        Size(2560, 1920)  // 4.9MP
    };

    for (const auto& size : sizes) {
        Mat resized;
        resize(input, resized, size);
        
        cout << "  Size " << size.width << "x" << size.height << ":" << endl;
        
        Mat result;
        double claheTime = measureTime([&]() {
            documentEnhanceCLAHE(resized, result, 2.0, 8, 9, 75.0, 75.0);
        }, "    CLAHE");
        
        double binarizeTime = measureTime([&]() {
            documentBinarizeAdaptive(resized, result, 11, 2);
        }, "    Binarize");
        
        double whitepaperTime = measureTime([&]() {
            whiteboardEnhance(resized, result, "{}");
        }, "    Whitepaper");
        
        cout << endl;
    }

    cout << "All benchmarks complete!" << endl;
    cout << endl;
    cout << "Recommendations:" << endl;
    cout << "  - For color documents with shadows: Use documentEnhanceCLAHE()" << endl;
    cout << "  - For text-heavy B&W documents: Use documentBinarizeAdaptive()" << endl;
    cout << "  - For whiteboards/complex cases: Use whiteboardEnhance() (now optimized)" << endl;
    cout << "  - For color palette extraction: Use colorSimplificationTransform() (now optimized)" << endl;

    return 0;
}
