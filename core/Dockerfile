FROM gcc:15

WORKDIR /app

COPY ./core ./core

WORKDIR /app/core

RUN mkdir build && cd build && \
    cmake .. && \
    make