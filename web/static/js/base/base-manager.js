/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */

export default class BaseManager {
    constructor() {
        this.items = new Map()
    }

    get(id) {
        return this.items.get(id) ?? null
    }

    add(id, setting) {
        return this.items.set(id, setting)
    }

    has(id) {
        return this.items.has(id)
    }

    delete(id) {
        this.items.delete(id)
    }

    clear() {
        this.items.clear()
    }

    keys() {
        return this.items.keys() ?? null
    }

    values() {
        return this.items.values() ?? null
    }

    entries() {
        return this.items.entries() ?? null
    }
}