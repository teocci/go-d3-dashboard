/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-8월-29
 */
import Dashboard from './components/dashboard.js'

export default class MainModule {
    static get instance() {
        this._instance = this._instance ?? new MainModule()

        return this._instance
    }

    constructor() {
        this.initElement()
        this.initListeners()
    }

    initElement() {
        this.placeholder = document.getElementById('main')
        this.dashboard = new Dashboard(this.placeholder)
    }

    initListeners() {}
}