APP="Cached Redis Proxy Service" #

all: build test run

build: ;@echo "Building a ${APP}: ...";

test: ;@echo "Testing ${APP}: ...";

run: ;@echo "Running ${APP}: ...";

update: ;@echo "Updating ${APP}: ...";

clean: ;@echo "Cleaning ${APP}: ...";

.PHONY: all build test run update clean
