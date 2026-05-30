#include "metro/route_engine.h"
#include "metro/dijkstra.h"

namespace metrosim {

RouteEngine::RouteEngine() {
    graph_.add_connection("Tucuruvi", "Santana", 4);
    graph_.add_connection("Santana", "Luz", 5);
    graph_.add_connection("Luz", "Sé", 3);
    graph_.add_connection("Sé", "Paraíso", 4);
    graph_.add_connection("Paraíso", "Jabaquara", 8);

    graph_.add_connection("Sé", "República", 3);
    graph_.add_connection("República", "Barra Funda", 6);
}

std::vector<std::string> RouteEngine::calculate_route(
    const std::string& start,
    const std::string& end) {
    return dijkstra(graph_, start, end);
}

} // namespace metrosim