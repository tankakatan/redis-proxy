"use strict";

const Redis = require ('./redis')
const Cache = require ('./cache')
const { expect } = require ('chai')

const dummy_data = [
    ['foo', 'bar'],
    ['answer', 42],
    ['hello', 'world'],
    ['test', 'test'],
    ['more', 'data'],
    ['dummy', 12345],
    ['baz', 'zoo'],
]

const { REDIS_HOST, REDIS_PORT } = process.env

describe ('LRU Cache', () => {

    const ttl = 1000
    const capacity = 4
    let cache = undefined

    beforeEach (() => {
        cache = Cache ({ capacity, ttl })
        for (let [key, value] of dummy_data) {
            cache.set (key, value)
        }
    })

    afterEach (() => {
        cache = undefined
    })

    it ('evicts the least recently used items', () => {

        const least_r_u_index = dummy_data.length - capacity

        for (let i = 0; i < dummy_data.length; i++) {
            const [key, value] = dummy_data[i]
            expect (cache.get (key)).to.equal (i < least_r_u_index ? undefined : value)
        }

        const [least_r_u_key, least_r_u_value] = dummy_data[least_r_u_index]
        const [evicted_key] = dummy_data[least_r_u_index + 1]

        cache.get (least_r_u_key)
        cache.set ('foo', 'bar')

        expect (cache.get (least_r_u_key)).to.equal (least_r_u_value)
        expect (cache.get (evicted_key)).to.equal (undefined)
    })

    it ('invalidates keys of the expired ttl', async () => {

        for (const [key, value] of dummy_data.slice (-capacity)) {
            expect (cache.get (key)).to.equal (value)
        }

        await new Promise (resolve => setTimeout (resolve, ttl))

        for (let [key] of dummy_data) {
            expect (cache.get (key)).to.equal (undefined)
        }
    })
})

describe ('Redis client', () => {

    let redis = undefined

    before (async () => {

        redis = Redis ({ host: REDIS_HOST, port: REDIS_PORT })

        const args = []
        for (let [key, value] of dummy_data) args.push (key, value)
        await redis.mset (...args)
    })

    after (async () => {

        const keys = []
        for (let [key] of dummy_data) keys.push (key)
        await redis.del (...keys)
        await redis.quit ()
    })

    it ('proxies requests to redis', async () => {

        const keys = []
        const values = []
        const key_to_be_deleted = dummy_data[3][0]

        for (let [key, value] of dummy_data) {
            keys.push (key)
            values.push (key === key_to_be_deleted ? null : value.toString ())
        }

        await redis.del (key_to_be_deleted)
        const response = await redis.mget (...keys)

        expect (response).to.deep.equal (values)
    })
})
