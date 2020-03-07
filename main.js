"use strict";

const Koa    = require ('koa')
const Router = require ('koa-router')
const port   = process.env.SERVER_PORT
const redis  = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
}

function handleGet (ctx) {
    ctx.body = JSON.stringify ({ port, redis })
}

new Koa ().use (new Router ().get ('/', handleGet).routes ()).listen (port)

console.log ('\nServer is running on port:', port, '\n')
