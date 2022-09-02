/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseComponent from '../base/base-component.js'

export default class Dashboard extends BaseComponent {
    static TAG = 'dashboard'

    constructor(element) {
        super(element)

        this.initElements()
        this.initListeners()
    }

    initElements() {
        const dashboard = document.createElement('div')
        dashboard.classList.add('dashboard-holder')

        const widget = this.createEmptyWidget()
        dashboard.appendChild(widget)

        this.dom = dashboard
        this.holder.appendChild(dashboard)
    }

    createEmptyWidget() {
        const widget = document.createElement('section')
        widget.classList.add('widget-holder')

        const btn = document.createElement('button')
        btn.classList.add('add-widget')
        btn.textContent = '차트 추가'
        btn.onclick

        widget.appendChild(btn)

        return widget
    }

    initListeners() {

    }
}