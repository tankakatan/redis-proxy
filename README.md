# Cached Redis Proxy Service

### Overview:

An HTTP server that provides an accass to a Redis storage preserving the stored values in a configurable LRU cache. The application is a composition of two containerized services - the Redis storage and the Node.js, app and optionally a test script that is run in a separate container. The Node.js application consists of the following parts:

- The web server based on the Node.js built-in `http` module
- The LRU cache implemented by the leverage of a doubly-linked list a hash table
- The Redis client wrapper based on the `redis` 3-rd party node module

The application configuration allows administrator to control the following parameters:

- The Redis storage host and port
- The HTTP server port
- The maximum number of simultaneous connections to the server
- The maximum amount of keys the cache will be able to store
- An amount of milliseconds the keys will be cached for

All of the above parameters can be set in the `.env` file.

The test script verifies the LRU cache properties, makes sure the cached keys lifitime limit works, and tests the sanity of the Redis client wrapper performing the basic CRUD operations with it.

### How it works

The webserver limits the number of connections using the Node.js http server `maxConnections` built-in property. The server only accepts `GET` requests and will return error for any other request method. It is assumed the requested key will be provided in the first segment of the request path (the rest of the segments will be ignored). If the path is undefined an error will be returned. Given the key the server will look up it's value in the cache and return it if it was found there. Otherwise the key request will be delegated to the Redis client who's response will returned to a user. If the response was not `null` (i.e. the key is present in the storage), the returned value will also be stored in the cache.

The cache is an object constructed in accordance to a provided `capacity` and `ttl` parameters that define the amount and the lifitime of the cache keys respectively. The object interface provides two methods - `get` and `set` - *both of a constant time complexity*. Whenever a user is about to cache a new key value pair, a new node is created at the head of a doubly-linked list, and the reference to that node is preserved in a dictionary under the provided key string. If the cache capacity then gets exceeded the node at the tail of the list is deleted and the corresponding key is invalidated. Every time a user requests a key from the cache the corresponding node is looked up in the hash table. If the node is found in the table it's lifetime will be checked first. If the lifetime exceeds the specified ttl the node gets deleted from the list and the corresponding key gets invalidated. Otherwise the node is being put at the head of the list before it's value gets returned to the user.

The overall space complexity of the cache object is `O(N)` at maximum where `N` is the cache capacity.

The redis client wrapper is a javascript `Proxy` object that provides a promisified access to a 3-rd party redis client (which later can be replaced with a simple Redis client implementation). It also defines a retry policy and some basic redis error handling. The client is configured with a host and a port through which the Redis storage can be accessed.

### Usage

The application is controlled via the standard `make` utility.

To run the application simply run the `make` command tha will install all the required dependencies, build the necessary docker images and then spin up the docker composed application.

To run the tests the `make test` command should be used. The command will run a containerized Node.js script that will perform unit-tests for the cache and the redis client wrapper modules.

If one need to just rebuild the app image (not running it) the `make build` command can be used. The same way the `make build-test` command can be used to rebuild the test container image without actually running it.

Finally `make clean` command can be run in order to stop and remove all the running containers and images relevant to the application.

All of the above commands use `docker` and `docker-compose` under the hood.

### Implementation details

#### App configuration:

Estimate time: 2h / Actual time: 40m

- [x] Cache expiration time
- [x] Cache capacity (max amount of stored keys)
- [x] Max simultaneous connections limit
- [x] Redis host/port
- [x] Service port

#### Node app:

Estimate time: 3h / Actual time: 4h30m

- [x] Webserver
- [x] Redis client
- [x] LRU cache

#### Docker app:

Estimate time: 1h / Actual time: 45m

- [x] Node app
- [x] Redis
- [x] Test

#### Test:

Estimate time: 3h / Actual time: 2h30m

- [x] CRUD operations over the Redis client wrapper
- [x] LRU Cache properties (update, eviction)
- [x] Cached keys lifetime

#### Makefile:

Estimate time: 30m / Actual time: 20m

- [x] Build
- [x] Test

#### Redis protocol:

Estimate time: 5h / Actual time: <b style="color:red;">Not implemented (need more time)...</b>

#### Docs:

Estimate time: 1h / Actual time: 1h40m

- [x] Overview
- [x] How it works
- [x] Time/space complexity
- [x] Build/test/run/etc instructions
- [x] Implementation timing
- [x] Unimplemented features
