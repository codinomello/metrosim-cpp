#include "pathfinder.h"

#include <queue>
#include <limits>
#include <algorithm>

std::vector<int> Pathfinder::shortest_path(
    const MetroGraph& graph,
    int start,
    int end
) {
    std::vector<int> distances(
        graph.size(),
        std::numeric_limits<int>::max()
    );

    std::vector<int> previous(
        graph.size(),
        -1
    );

    using Node = std::pair<int, int>;

    std::priority_queue<
        Node,
        std::vector<Node>,
        std::greater<Node>
    > queue;

    distances[start] = 0;
    queue.push({0, start});

    while (!queue.empty()) {
        int current = queue.top().second;
        queue.pop();

        for (const auto& connection : graph.get_connections(current)) {
            int next = connection.target_;
            int new_distance =
                distances[current] + connection.weight_;

            if (new_distance < distances[next]) {
                distances[next] = new_distance;
                previous[next] = current;

                queue.push({new_distance, next});
            }
        }
    }

    std::vector<int> path;

    for (int at = end; at != -1; at = previous[at]) {
        path.push_back(at);
    }

    std::reverse(path.begin(), path.end());

    return path;
}