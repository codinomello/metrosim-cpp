#include "metro/graph.h"

#include <string>
#include <unordered_map>
#include <utility>
#include <vector>

namespace metrosim {

void Graph::add_station(const std::string& name) {
    adjacency_list_[name];
}

void Graph::add_connection(const std::string& from,
                           const std::string& to,
                           int weight) {
    adjacency_list_[from].push_back({to, weight});
    adjacency_list_[to].push_back({from, weight});
}

const std::unordered_map<std::string, std::vector<std::pair<std::string, int>>>&
Graph::get_adjacency_list() const {
    return adjacency_list_;
}

} // namespace metrosim