# Cached Redis Proxy Service

## App configuration:
Estimate time: 2h / Actual time:
- Cache expiration time
- Cache capacity (max amount of stored keys)
- Redis host/port
- Service port

## Node app:
Estimate time: 3h / Actual time:
- Koa webserver
- Redis client
- LRU cache

## Docker app:
Estimate time: 1h / Actual time:
- Node app
- Redis

## Test:
Estimate time: 3h / Actual time:
- Populate redis storage with a dummy data
- Basic sanity checks (connection, data obtaining)
- Cache properties
- Storage cleanup

## Makefile:
Estimate time: 30m / Actual time: 10m
- Build
- Test

## Redis protocol:
Estimate time: ? / Actual time: ? (some research required)

## Docs:
Estimate time: 1h / Actual time: 10m
- Overview
- How it works
- Time/space complexity
- Build/test/run/etc instructions
- Implementation timing
- Unimplemented features
