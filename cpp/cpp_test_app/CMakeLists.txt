cmake_minimum_required(VERSION 3.25)
project( scanner )
find_package( OpenCV REQUIRED PATHS ../../opencv/linux NO_DEFAULT_PATH)
find_package(Tesseract PATHS ../../tesseract/linux NO_DEFAULT_PATH)
if (NOT Tesseract_FOUND)
    find_package(PkgConfig REQUIRED)

    pkg_check_modules(Tesseract REQUIRED IMPORTED_TARGET tesseract lept)
    add_library(Tesseract::libtesseract ALIAS PkgConfig::Tesseract)
endif ()

# adjust the debug options to output more details on stdout
add_definitions( -DVP_DEBUG -DVP_DEBUG_MODE=0 )

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_EXTENSIONS NO)
set(CMAKE_CXX_STANDARD_REQUIRED YES)

set(CMAKE_CXX_SCAN_FOR_MODULES FALSE)
set(CMAKE_CXX_COMPILER "clang++")
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -stdlib=libstdc++ -std=c2x")


IF(CMAKE_COMPILER_IS_GNUCC)
  SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fmessage-length=0")
ENDIF(CMAKE_COMPILER_IS_GNUCC)
IF(CMAKE_COMPILER_IS_GNUCXX)
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fmessage-length=0")
ENDIF(CMAKE_COMPILER_IS_GNUCXX)

add_executable( scanner scanner.cpp src/DocumentDetector.cpp  src/WhitePaperTransform.cpp  src/Utils.cpp  src/ColorSimplificationTransform.cpp )
target_link_libraries( scanner ${OpenCV_LIBS} Tesseract::libtesseract)
target_include_directories(scanner PRIVATE src/include)