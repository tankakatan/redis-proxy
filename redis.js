"use strict";

const Redis = require ('redis')
const util  = require ('util')

const { REDIS_HOST, REDIS_PORT } = process.env

const client = Redis.createClient ({ host: REDIS_HOST, port: REDIS_PORT })

module.exports = new Proxy ({}, { get: function (_, property) {

    if (!(property in client)) {
        throw new Error ('Redis client does not have property: ' + property)
    }

    return typeof client[property] === 'function' ? util.promisify (client[property]).bind (client) : client[property]
}})
