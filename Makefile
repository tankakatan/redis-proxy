APP="Cached-Redis-Proxy-Service"
IMAGE="cached-redis-proxy"

all: build run

build: ;@echo "Building a ${APP}"; \
docker-compose build;

build-test: ;@echo "Building a ${APP} test app"; \
docker-compose -f docker-compose.yaml -f docker-compose-test.yaml build test;

test: ;@echo "Testing ${APP}"; \
docker-compose -f docker-compose.yaml -f docker-compose-test.yaml up test;

run: ;@echo "Running ${APP}"; \
docker-compose up;

clean: ;@echo "Cleaning ${APP}"; \
docker-compose rm; \
docker container rm ${IMAGE}; \
docker image rm ${IMAGE};

.PHONY: all build build-test test run clean
