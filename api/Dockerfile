FROM gcc:15

WORKDIR /app

COPY ./core ./core
COPY ./api ./api
COPY ./data ./data

WORKDIR /app/api

RUN mkdir build && cd build && \
    cmake .. && \
    make

CMD ["./build/bin/metro_api"]