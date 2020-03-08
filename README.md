# Cached Redis Proxy Service

## App configuration:
Estimate time: 2h / Actual time: 10m
- Cache expiration time
- Cache capacity (max amount of stored keys)
- Max simultaneous connections limit
- Redis host/port
- Service port

## Node app:
Estimate time: 3h / Actual time: 2h30m
- Koa webserver
- Redis client ✅
- LRU cache ✅

## Docker app:
Estimate time: 1h / Actual time: 45m
- Node app ✅
- Redis ✅

## Test:
Estimate time: 3h / Actual time: 2h30m
- Populate redis storage with a dummy data ✅
- Basic sanity checks (connection, data obtaining) ✅
- Cache properties ✅
- Storage cleanup ✅

## Makefile:
Estimate time: 30m / Actual time: 20m
- Build
- Test ✅

## Redis protocol:
Estimate time: ? / Actual time: ? (some research required)

## Docs:
Estimate time: 1h / Actual time: 15m
- Overview
- How it works
- Time/space complexity
- Build/test/run/etc instructions
- Implementation timing
- Unimplemented features
