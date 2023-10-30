cmake_minimum_required(VERSION 3.25)
project( scanner )
find_package( OpenCV REQUIRED )

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
target_link_libraries( scanner ${OpenCV_LIBS} )
