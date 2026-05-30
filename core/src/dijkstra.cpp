#include "metro/dijkstra.h"

#include <algorithm>
#include <climits>
#include <queue>
#include <unordered_map>

namespace metrosim {

std::vector<std::string> dijkstra(
    const Graph& graph,
    const std::string& start,
    const std::string& end) {

    std::unordered_map<std::string, int> dist;
    std::unordered_map<std::string, std::string> parent;

    for (const auto& node : graph.get_adjacency_list()) {
        dist[node.first] = INT_MAX;
    }

    dist[start] = 0;

    using Node = std::pair<int, std::string>;

    std::priority_queue<Node,
        std::vector<Node>,
        std::greater<Node>> pq;

    pq.push({0, start});

    while (!pq.empty()) {
        auto [current_dist, current] = pq.top();
        pq.pop();

        if (current == end) break;

        for (const auto& [neighbor, weight]
            : graph.get_adjacency_list().at(current)) {

        int new_dist = current_dist + weight;

        if (new_dist < dist[neighbor]) {
            dist[neighbor] = new_dist;
            parent[neighbor] = current;
            pq.push({new_dist, neighbor});
        }
        }
    }

    std::vector<std::string> path;

    std::string current = end;

    while (current != start) {
        path.push_back(current);
        current = parent[current];
    }

    path.push_back(start);

    std::reverse(path.begin(), path.end());
        return path;
    }
}