cmake_minimum_required(VERSION 3.20)

project(metro_api LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(metro_api
    src/api_server.cpp
)

target_include_directories(metro_api PRIVATE
    ../core/include
)

target_link_libraries(metro_api PRIVATE
    pthread
)

set_target_properties(metro_api PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)