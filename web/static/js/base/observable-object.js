import BaseListener from './base-listener.js'

/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-05
 */
export default class ObservableObject extends BaseListener {
    constructor(v) {
        super()

        this._value = v ?? null
    }

    set onchange(fn) {
        this.addListener('change', fn)
    }

    set value(newValue) {
        const oldValue = this._value
        if (oldValue === newValue) return

        this._value = newValue
        this.emit('change', newValue, oldValue)
    }

    get value() { return this._value }
}