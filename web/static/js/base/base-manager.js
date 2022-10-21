/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */

export default class BaseManager {
    constructor() {
        this.settings = new Map()
    }

    get(id) {
        return this.settings.get(id) ?? null
    }

    add(id, setting) {
        return this.settings.set(id, setting)
    }

    has(id) {
        return this.settings.has(id)
    }

    delete(id) {
        this.settings.delete(id)
    }

    clear() {
        this.settings.clear()
    }

    keys() {
        return this.settings.keys() ?? null
    }

    values() {
        return this.settings.values() ?? null
    }

    entries() {
        return this.settings.entries() ?? null
    }
}