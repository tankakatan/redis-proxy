"use strict";

const Koa    = require ('koa')
const Parser = require ('koa-bodyparser')
const redis  = require ('./redis')
const Cache  = require ('./cache')

const { SERVER_PORT, CACHE_TTL, CACHE_CAPACITY } = process.env

let cache = undefined

async function handleRequest (ctx) {

    // const { query, body } = ctx.request
    const { method, path } = ctx.request

    if (method !== 'GET') {
        ctx.throw (new Error ('HTTP Request method not supported'))
    }

    if (cache === undefined) {
        cache = Cache ({ capacity: CACHE_CAPACITY, ttl: CACHE_TTL })
        // require ('./populate') ()
    }

    const [, key]  = path.split ('/')

    let value = undefined

    try {

        if ((value = cache.get (key)) !== undefined) {

            // console.log (key, 'value restored from cache:', value)
            ctx.body = value.toString ()

        } else {

            value = await redis.get (key)
            // console.log (key, 'value retreived from redis:', value)

            if (value !== null) {
                cache.set (key, value)
            } 

            ctx.body = value
        }

    } catch (e) {

        ctx.throw (e)
    }
}

new Koa ().use (Parser ()).use (handleRequest).listen (SERVER_PORT)

console.log ('\nServer is running on port:', SERVER_PORT, '\n')
