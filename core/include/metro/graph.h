#ifndef METROSIM_METRO_GRAPH_H
#define METROSIM_METRO_GRAPH_H

#include <string>
#include <unordered_map>
#include <vector>

namespace metrosim {

class Graph {
 public:
  void add_station(const std::string& name);
  void add_connection(const std::string& from,
                      const std::string& to,
                      int weight);

  const std::unordered_map<std::string,
      std::vector<std::pair<std::string, int>>>&
  get_adjacency_list() const;

 private:
  std::unordered_map<std::string,
      std::vector<std::pair<std::string, int>>> adjacency_list_;
};

} // namespace metrosim

#endif // METROSIM_METRO_GRAPH_H