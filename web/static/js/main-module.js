/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-8월-29
 */
import Dashboard from './components/dashboard.js'
import BaseComponent from './base/base-component.js'

export default class MainModule extends BaseComponent {
    static get instance() {
        this._instance = this._instance ?? new MainModule()

        return this._instance
    }

    constructor() {
        super()

        this.initElement()
        this.initListeners()
    }

    initElement() {
        this.dom = document.getElementById('main')
        this.dashboard = new Dashboard(this.dom)
    }

    initListeners() {}
}