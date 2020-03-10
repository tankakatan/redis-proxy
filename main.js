"use strict";

const http   = require ('http')
const Url    = require ('url')
const Redis  = require ('./redis')
const Cache  = require ('./cache')
const { SERVER_PORT,
        REDIS_HOST,
        REDIS_PORT,
        CACHE_TTL,
        CACHE_CAPACITY,
        MAX_CONNECTIONS } = process.env

let cache = undefined
let redis = undefined

async function handleRequest (request, response) {

    const { method, url } = request
    const path = Url.parse (url).path
    const err = (message, code = 500) => {
        response.statusCode = code
        response.write (message)
        response.end ()
    }

    if (method !== 'GET') {
        return err ('HTTP Request method not supported')
    }

    let [, key] = path.split ('/')

    if (key === undefined) {
        return err ('Data key is not specified')
    }

    if (cache === undefined) {
        cache = Cache ({ capacity: CACHE_CAPACITY, ttl: CACHE_TTL })
    }

    if (redis === undefined) {
        redis = Redis ({ host: REDIS_HOST, port: REDIS_PORT })
        // require ('./populate') ()
    }

    try {

        key = decodeURI (key)
        let value = undefined

        if ((value = cache.get (key)) !== undefined) {

            // console.log (key, 'value restored from cache:', value)
            value = value.toString ()

        } else if ((value = await redis.get (key)) !== null) {

            // console.log (key, 'value retreived from redis:', value)
            cache.set (key, value)
        }

        response.statusCode = 200
        response.write (value)
        response.end ()

    } catch (e) {

        return err (e.message)
    }
}

http.createServer (handleRequest).listen (SERVER_PORT).maxConnections = MAX_CONNECTIONS

console.log ('\nServer is running on port:', SERVER_PORT, '\n')
