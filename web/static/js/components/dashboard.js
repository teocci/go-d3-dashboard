/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseComponent from '../base/base-component.js'
import Fieldset from './fieldset.js'
import InputText from './input-text.js'
import InputCheckbox from './input-checkbox.js'
import Widget from './widget.js'

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

        const widget = new Widget(dashboard)

        dashboard.appendChild(widget.dom)

        this.dom = dashboard
        if (!isNull(this.holder)) this.holder.appendChild(dashboard)
    }

    initListeners() {

    }
}