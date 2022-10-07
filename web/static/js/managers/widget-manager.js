/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-04
 */
export default class WidgetManager {
    constructor() {
        this.widgets = new Map()
    }

    get(id) {
        return this.widgets.get(id) ?? null
    }

    add(id, setting) {
        return this.widgets.set(id, setting)
    }
}