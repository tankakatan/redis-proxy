"use strict";

const Koa    = require ('koa')
const Parser = require ('koa-bodyparser')
const redis  = require ('./redis')

const { SERVER_PORT } = process.env

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
