#include "metro/route_engine.h"

#include <iostream>

int main() {
    metrosim::RouteEngine engine;

    auto path =
        engine.calculate_route("Tucuruvi", "Barra Funda");

    for (const auto& station : path) {
        std::cout << station << " -> ";
    }

    std::cout << "fim\n";

    return 0;
}