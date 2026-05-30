#include <arpa/inet.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <unistd.h>

#include <cstring>
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

#include "metro/route_engine.h"

namespace {

std::string extract_query_param(
    const std::string& request,
    const std::string& key) {

  std::string token = key + "=";

  std::size_t pos = request.find(token);

  if (pos == std::string::npos) {
    return "";
  }

  pos += token.length();

  std::size_t end = request.find('&', pos);

  if (end == std::string::npos) {
    end = request.find(' ', pos);
  }

  return request.substr(pos, end - pos);
}

std::string BuildJsonResponse(
    const std::vector<std::string>& path) {

  std::ostringstream json;

  json << "{ \"path\": [";

  for (std::size_t i = 0; i < path.size(); ++i) {
    json << "\"" << path[i] << "\"";

    if (i + 1 < path.size()) {
      json << ",";
    }
  }

  json << "] }";

  return json.str();
}

std::string BuildHttpResponse(
    const std::string& body) {

  std::ostringstream response;

  response
      << "HTTP/1.1 200 OK\r\n"
      << "Content-Type: application/json\r\n"
      << "Access-Control-Allow-Origin: *\r\n"
      << "Content-Length: " << body.size() << "\r\n"
      << "\r\n"
      << body;

  return response.str();
}

}  // namespace

int main() {
    metrosim::RouteEngine engine;

    int server_fd = socket(AF_INET, SOCK_STREAM, 0);

    if (server_fd < 0) {
        std::cerr << "socket failed\n";
        return 1;
    }

    sockaddr_in address{};

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(8080);

    bind(
        server_fd,
        reinterpret_cast<sockaddr*>(&address),
        sizeof(address));

    listen(server_fd, 10);

    std::cout << "Metro API listening on :8080\n";

    while (true) {
        sockaddr_in client_addr{};
        socklen_t client_len = sizeof(client_addr);

        int client_socket =
            accept(
                server_fd,
                reinterpret_cast<sockaddr*>(&client_addr),
                &client_len);

        if (client_socket < 0) {
        continue;
        }

        char buffer[4096] = {0};

        recv(
            client_socket,
            buffer,
            sizeof(buffer),
            0);

        std::string request(buffer);

        std::string from =
            extract_query_param(request, "from");

        std::string to =
            extract_query_param(request, "to");

        auto path =
            engine.calculate_route(from, to);

        std::string body =
            BuildJsonResponse(path);

        std::string response =
            BuildHttpResponse(body);

        send(
            client_socket,
            response.c_str(),
            response.size(),
            0);

        close(client_socket);
    }

    close(server_fd);

    return 0;
}