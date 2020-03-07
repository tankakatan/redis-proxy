"use strict";

const Koa    = require ('koa')
const Parser = require ('koa-bodyparser')
const Redis  = require ('redis')
const util   = require ('util')

const { REDIS_HOST, REDIS_PORT, SERVER_PORT } = process.env

const client = Redis.createClient ({ host: REDIS_HOST, port: REDIS_PORT })
const redis  = new Proxy ({}, { get: function (_, property) {

    if (!(property in client)) {
        throw new Error ('Redis client does not have property: ' + property)
    }

    return typeof client[property] === 'function' ? util.promisify (client[property]).bind (client) : client[property]
}})

async function handleRequest (ctx) {

    // const { method, query } = ctx.request
    const { body, path } = ctx.request

    try {

        const [, method, key, value]  = path.split ('/')
        const args = []

        if (key) args.push (key)
        if (value) args.push (value)

        console.log ({ method, key, value, body })

        ctx.body = await redis[method] (...args, ...(Array.isArray (body) ? body : []))

    } catch (e) {

        ctx.throw (e)
    }
}

new Koa ().use (Parser ()).use (handleRequest).listen (SERVER_PORT)

console.log ('\nServer is running on port:', SERVER_PORT, '\n')
