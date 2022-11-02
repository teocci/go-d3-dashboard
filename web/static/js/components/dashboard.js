/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseComponent from '../base/base-component.js'
import Widget from './widget.js'
import WidgetManager from '../managers/widget-manager.js'

export default class Dashboard extends BaseComponent {
    static TAG = 'dashboard'

    constructor(element) {
        super(element)

        this.widgetManager = new WidgetManager()

        this.initElements()
        this.initListeners()
    }

    initElements() {
        const $dashboard = document.createElement('div')
        $dashboard.classList.add('dashboard-holder')

        const widget = new Widget($dashboard)
        this.widgetManager.add(widget.id, widget)

        $dashboard.appendChild(widget.dom)

        widget.state.onchange = v => {
            console.log({v})
        }

        this.dom = $dashboard
        if (!isNil(this.holder)) this.holder.appendChild($dashboard)
    }

    initListeners() {

    }
}