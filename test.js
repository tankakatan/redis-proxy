"use strict";

const redis = require ('./redis')
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

describe ('Cached Redis Proxy', () => {

    before (async () => {

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