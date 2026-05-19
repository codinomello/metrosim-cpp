#include <iostream>
#include <vector>

#include "core/station.h"
#include "network/metro_graph.h"
#include "network/pathfinder.h"

int main() {
    std::vector<Station> stations = {
        Station(0, "Sé", 5000),
        Station(1, "Paraíso", 3000),
        Station(2, "Ana Rosa", 2500),
        Station(3, "Consolação", 4000)
    };

    MetroGraph graph(4);

    graph.add_connection(0, 1, 4);
    graph.add_connection(1, 2, 2);
    graph.add_connection(0, 3, 3);
    graph.add_connection(3, 2, 10);

    std::vector<int> path =
        Pathfinder::shortest_path(graph, 0, 2);

    std::cout << "Melhor rota:\n";

    for (int station_id : path) {
        std::cout
            << stations[station_id].get_name()
            << "\n";
    }

    return 0;
}