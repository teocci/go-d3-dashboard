/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-04
 */
export default class ChartSettingManager {
    constructor() {
        this.settings = new Map()
        settings = this.settings
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
}