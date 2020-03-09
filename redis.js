"use strict";

const Redis = require ('redis')
const util  = require ('util')

module.exports = function ({ host, port }) {

    const promisified = {}

    let client = undefined

    return new Proxy ({}, { get: function (_, property) {

        if (client === undefined) {
            client = Redis.createClient ({ host, port })
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

        return promisified[property]
    }})
}
