APP="Cached-Redis-Proxy-Service"
IMAGE="cached-redis-proxy"

all: build test run

build: ;@echo "Building a ${APP}:"; \
docker-compose -p ${IMAGE} up;

test: ;@echo "Testing ${APP}"; \
docker-compose -f docker-compose.yaml -f docker-compose-test.yaml up test

run: ;@echo "Running ${APP}: ...";

update: ;@echo "Updating ${APP}: ...";

clean: ;@echo "Cleaning ${APP}: ..."; \
docker-compose rm; \
docker container rm ${IMAGE}; \
docker image rm ${IMAGE};

.PHONY: all build test run update clean
