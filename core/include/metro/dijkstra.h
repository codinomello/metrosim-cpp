#ifndef METROSIM_METRO_DIJKSTRA_H
#define METROSIM_METRO_DIJKSTRA_H

#include "metro/graph.h"

#include <string>
#include <vector>

namespace metrosim {

std::vector<std::string> dijkstra(
    const Graph& graph,
    const std::string& start,
    const std::string& end);

} // namespace metrosim

#endif // METROSIM_METRO_DIJKSTRA_H