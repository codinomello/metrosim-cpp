#ifndef METROSIM_METRO_ROUTE_ENGINE_H
#define METROSIM_METRO_ROUTE_ENGINE_H

#include "metro/graph.h"

#include <string>
#include <vector>

namespace metrosim {

class RouteEngine {
public:
  	RouteEngine();
  	std::vector<std::string> calculate_route(
    	const std::string& start,
      	const std::string& end
	);

private:
  	Graph graph_;
};

} // namespace metrosim

#endif // METROSIM_METRO_ROUTE_ENGINE_H