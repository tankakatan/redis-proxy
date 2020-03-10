APP="Cached-Redis-Proxy-Service"
NAME="cached-redis-proxy"

all: run

build: ;@echo "Building a ${APP}"; \
docker-compose -p ${NAME} build;

run: ;@echo "Running ${APP}"; \
docker-compose -p ${NAME} up;

build-test: ;@echo "Building a ${APP} test app"; \
docker-compose -f docker-compose.yaml -f docker-compose-test.yaml -p ${NAME} build test;

test: ;@echo "Testing ${APP}"; \
docker-compose -f docker-compose.yaml -f docker-compose-test.yaml -p ${NAME} up test;

clean: ;@echo "Cleaning ${APP}"; \
docker-compose -p ${NAME} down --remove-orphans;

.PHONY: all build build-test test run clean
