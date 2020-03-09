"use strict";

module.exports = function ({ capacity, ttl }) {

    const Node = (key, value, next = null, prev = null) => ({ key, value, next, prev, updated: Date.now () })
    const nodes = {}

    let head = Node ('_HEAD_')
    let tail = Node ('_TAIL_')
    let size = 0

    head.next = tail
    tail.prev = head

    function swap (node) {

        const first = head.next

        if (node === first) return

        if (node.prev !== null) node.prev.next = node.next
        if (node.next !== null) node.next.prev = node.prev

        head.next = node
        node.prev = head
        node.next = first

        first.prev = node
    }

    function invalidate (node) {
        node.prev.next = node.next
        node.next.prev = node.prev
        delete nodes[node.key]
        size -= 1
    }

    function evict () {
        if (size === 0) return
        invalidate (tail.prev)
    }

    function get (key) {

        const node = nodes[key]

        if (node === undefined) return
        if (Date.now () - node.updated > ttl) return invalidate (node)

        node.updated = Date.now ()
        swap (node)

        return node.value
    }

    const cache = { get, set }

    function set (key, value) {

        if (key in nodes) {

            nodes[key].value = value
            nodes[key].updated = Date.now ()

        } else {

            if (size >= capacity) evict ()

            nodes[key] = Node (key, value)
            size += 1
        }

        swap (nodes[key])

        return cache
    }

    return cache
}
