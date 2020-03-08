"use strict";

const Redis = require ('redis')
const util  = require ('util')

const { REDIS_HOST, REDIS_PORT } = process.env
const promisified = {}

let client = undefined

module.exports = new Proxy ({}, { get: function (_, property) {

    if (client === undefined) {
        client = Redis.createClient ({ host: REDIS_HOST, port: REDIS_PORT })
    }

    if (!(property in client)) {
        throw new Error ('Redis client does not have property: ' + property)
    }

    if (property in promisified) {
        return promisified[property]
    }

    return promisified[property] = typeof client[property] === 'function' ? util.promisify (client[property]).bind (client) : client[property]
}})
