cmake_minimum_required(VERSION 3.20)
project(metrosim VERSION 0.1.0 LANGUAGES CXX)

set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)

# ==================== Sources ====================
set(METROSIM_SOURCES
    src/main.cpp
    src/graph.cpp
    src/dijkstra.cpp
    src/astar.cpp
    src/route_engine.cpp
)

add_executable(metrosim ${METROSIM_SOURCES})

# ==================== Includes ====================
target_include_directories(metrosim PRIVATE
    ${CMAKE_CURRENT_SOURCE_DIR}/include    # Para incluir "metro/xxx.h"
    ${CMAKE_CURRENT_SOURCE_DIR}/src        # Caso precise incluir algo dentro de src
)

# ==================== C++ Standard ====================
target_compile_features(metrosim PRIVATE cxx_std_20)

# ==================== Warnings ====================
if (MSVC)
    target_compile_options(metrosim PRIVATE /W4 /WX)
else()
    target_compile_options(metrosim PRIVATE
        -Wall
        -Wextra
        -Wpedantic
        -Wconversion
        -Wsign-conversion
        -Werror
    )
endif()

# Output directory
set_target_properties(metrosim PROPERTIES
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_BINARY_DIR}/bin"
)