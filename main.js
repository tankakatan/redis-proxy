"use strict";

const Koa    = require ('koa')
const Router = require ('koa-router')
const port   = process.env.SERVER_PORT

new Koa ().use (new Router ().get ('/', ctx => { ctx.body = 'Hello world!' }).routes ())
          .listen (port)

console.log ('\nServer is running on port:', port, '\n')
