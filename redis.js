"use strict";

const Redis = require ('redis')
const util  = require ('util')

const { REDIS_HOST, REDIS_PORT, MAX_CONCURRENCY } = process.env
const promisified = {}
const queue = []

let client = undefined

module.exports = new Proxy ({}, { get: function (_, property) {

    if (client === undefined) {
        client = Redis.createClient ({ host: REDIS_HOST, port: REDIS_PORT })
    }

    if (!(property in client)) {
        throw new Error ('Redis client does not have property: ' + property)
    }

    if (typeof client[property] !== 'function') {
        return client[property]
    }

    if (!(property in promisified)) {
        promisified[property] = util.promisify (client[property]).bind (client)
    }

    return function (...args) {
        return new Promise ((resolve, reject) => {
            queue.push (() => promisified[property] (...args).then (resolve).catch (reject))
            execute ()
        })
    }
}})

let executing = false

const next = () => queue.length ? queue.shift () ().then (next) : undefined

const execute = () => {
    return executing || (executing = Promise.all (Array.from ({ length: MAX_CONCURRENCY }).map (next)).then (() => { executing = false }))
}
