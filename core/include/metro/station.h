#ifndef METROSIM_METRO_STATION_H
#define METROSIM_METRO_STATION_H

#include <string>

namespace metrosim {

struct Station {
    std::string name;
    std::string line;
};

} // namespace metrosim

#endif // METROSIM_METRO_STATION_H