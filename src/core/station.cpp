#include "station.h"

Station::Station(int id, const std::string& name, int capacity)
    : id_(id), name_(name), capacity_(capacity), passengers_(0) {}

void Station::add_passenger(int amount) {
    passengers_ += amount;
}

void Station::remove_passenger(int amount) {
    if (passengers_ >= amount) {
        passengers_ -= amount;
    }
}

bool Station::is_full() const {
    return passengers_ >= capacity_;
}

int Station::get_id() const {
    return id_;
}

const std::string& Station::get_name() const {
    return name_;
}

int Station::get_passengers() const {
    return passengers_;
}