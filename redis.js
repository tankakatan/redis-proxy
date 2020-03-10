'use strict';

const Redis = require ('redis')
const util  = require ('util')

module.exports = function ({ host, port, maxRetries = 10, maxRetryTime = 1000 * 60 * 5, minRetryDelay = 500 }) {

    const promisified = {}
    const clientConfig = { host, port, retry_strategy: function (options) {

        if (options.error && options.error.code === 'ECONNREFUSED') {
            return new Error ('The server refused the connection')
        }

        if (options.total_retry_time > maxRetryTime) {
            return new Error ('Retry time exhausted')
        }

        if (options.attempt > maxRetries) {
            return undefined
        }

        return Math.min (options.attempt * minRetryDelay, 3000)
    }}

    let client = undefined

    return new Proxy ({}, { get: function (_, property) {

        if (client === undefined) {

            client = Redis.createClient (clientConfig)

            client.on ('error', error => {
                switch (error.code) {
                    case 'NR_CLOSED': // clients connection dropped
                        client = Redis.createClient (clientConfig)
                        break
                    case 'UNCERTAIN_STATE': // unresolved command got rejected
                    case 'CONNECTION_BROKEN': // Node Redis gives up to reconnect
                    default:
                        throw error
                }
            })
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
