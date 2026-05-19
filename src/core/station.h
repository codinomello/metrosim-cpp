#pragma once

#include <string>

class Station {
private:
    int id_;
    std::string name_;
    int capacity_;
    int passengers_;

public:
    Station(int id, const std::string& name, int capacity);

    void add_passenger(int amount);
    void remove_passenger(int amount);

    bool is_full() const;

    int get_id() const;
    const std::string& get_name() const;
    int get_passengers() const;
};