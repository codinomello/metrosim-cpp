#include "network/metro_graph.h"

MetroGraph::MetroGraph(int station_count)
    : adjacency_(station_count) {}

void MetroGraph::add_connection(int from, int to, int weight) {
    adjacency_[from].push_back({to, weight});
    adjacency_[to].push_back({from, weight});
}

const std::vector<Connection>& MetroGraph::get_connections(int station_id) const {
    return adjacency_[station_id];
}

int MetroGraph::size() const {
    return adjacency_.size();
}