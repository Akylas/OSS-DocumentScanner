# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html

# Sets the minimum version of CMake required to build the native library.

cmake_minimum_required(VERSION 3.4.1)

set(TARGET document_detector)
set(SRC_DIR ./)
set(SRC_DIR2 ./src)
set(ZXING_SRC ./zxingcpp/core)
set(OPENCV_LIB_DIR opencv/staticlibs/${ANDROID_ABI}/)
set(OPENCV_3RD_LIB_DIR opencv/3rdparty/libs/${ANDROID_ABI}/)
set(TESSERACT_LIB_DIR tesseract/staticlibs/${ANDROID_ABI}/)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -Wno-deprecated-anon-enum-enum-conversion")

include_directories(opencv/include
                    ./include
                    ./src/include
                    tesseract/include
#                    ${ZXING_SRC}
                    )


link_directories(${OPENCV_LIB_DIR}
                 ${OPENCV_3RD_LIB_DIR}
                 ${TESSERACT_LIB_DIR})

# ZXing
set(BUILD_READERS ON)
set(BUILD_WRITERS ON)

add_subdirectory(${ZXING_SRC} ZXing EXCLUDE_FROM_ALL)


# Creates and names a library, sets it as either STATIC
# or SHARED, and provides the relative paths to its source code.
# You can define multiple libraries, and CMake builds them for you.
# Gradle automatically packages shared libraries with your APK.

aux_source_directory(${SRC_DIR} DIR_LIB_SOURCE)
aux_source_directory(${SRC_DIR2} DIR_LIB_SOURCE2)
#aux_source_directory(${ZXING_SRC} DIR_LIB_SOURCE_ZXING)

add_library(${TARGET} SHARED ${DIR_LIB_SOURCE} ${DIR_LIB_SOURCE2})

# Searches for a specified prebuilt library and stores the path as a
# variable. Because CMake includes system libraries in the search path by
# default, you only need to specify the name of the public NDK library
# you want to add. CMake verifies that the library exists before
# completing its build.

 target_link_libraries(${TARGET} log jnigraphics z ZXing::ZXing)

# Specifies libraries CMake should link to your target library. You
# can link multiple libraries, such as libraries you define in this
# build script, prebuilt third-party libraries, or system libraries.

if(${ANDROID_ABI} STREQUAL x86_64)
    target_link_libraries(${TARGET} opencv_photo opencv_imgproc opencv_core cpufeatures libprotobuf ade tbb ittnotify libjpeg-turbo libwebp libpng libtiff libopenjp2 IlmImf quirc)
elseif(${ANDROID_ABI} STREQUAL x86)
        target_link_libraries(${TARGET} opencv_photo opencv_imgproc opencv_core cpufeatures libprotobuf ade tbb ittnotify libjpeg-turbo libwebp libpng libtiff libopenjp2 IlmImf quirc ippiw ippicv)
else()
    target_link_libraries(${TARGET} opencv_photo opencv_imgproc opencv_core cpufeatures libprotobuf ade tbb ittnotify libjpeg-turbo libwebp libpng libtiff libopenjp2 IlmImf quirc tegra_hal)
endif()

target_link_libraries(${TARGET} tesseract leptonica pngx jpeg -fopenmp -static-openmp)