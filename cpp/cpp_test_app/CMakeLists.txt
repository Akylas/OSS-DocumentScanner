cmake_minimum_required(VERSION 3.25)
project( scanner )
find_package( OpenCV REQUIRED )
find_package(Tesseract 4)
if (NOT Tesseract_FOUND)
    find_package(PkgConfig REQUIRED)

    pkg_check_modules(Tesseract REQUIRED IMPORTED_TARGET tesseract)
    add_library(Tesseract::libtesseract ALIAS PkgConfig::Tesseract)
endif ()

# adjust the debug options to output more details on stdout
add_definitions( -DVP_DEBUG -DVP_DEBUG_MODE=0 )
add_definitions(-std=c++17)

IF(CMAKE_COMPILER_IS_GNUCC)
  SET(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -fmessage-length=0")
ENDIF(CMAKE_COMPILER_IS_GNUCC)
IF(CMAKE_COMPILER_IS_GNUCXX)
  SET(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -fmessage-length=0")
ENDIF(CMAKE_COMPILER_IS_GNUCXX)

add_executable( scanner scanner.cpp src/DocumentDetector.cpp  src/WhitePaperTransform.cpp )
target_link_libraries( scanner ${OpenCV_LIBS} Tesseract::libtesseract)
target_include_directories(scanner PRIVATE src/include)