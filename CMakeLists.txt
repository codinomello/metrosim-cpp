cmake_minimum_required(VERSION 3.20)
project(metrosim VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

file(GLOB_RECURSE METROSIM_SOURCES
    src/*.cpp
)

add_executable(metrosim ${METROSIM_SOURCES})

target_include_directories(metrosim PRIVATE src)

set_target_properties(metrosim PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)