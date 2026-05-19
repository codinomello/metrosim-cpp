#pragma once

#include <vector>

#include "network/metro_graph.h"

class Pathfinder {
public:
    static std::vector<int> shortest_path(
        const MetroGraph& graph,
        int start,
        int end
    );
};