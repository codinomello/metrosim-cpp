#pragma once

#include <vector>

#include "core/connection.h"

class MetroGraph {
private:
    std::vector<std::vector<Connection>> adjacency_;

public:
    MetroGraph(int station_count);

    void add_connection(int from, int to, int weight);

    const std::vector<Connection>& get_connections(int station_id) const;

    int size() const;
};