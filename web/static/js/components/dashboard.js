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

        const fs = new Fieldset(dashboard, TEST_FIELDS.fieldset)
        const it = new InputText(dashboard, TEST_FIELDS.text)
        const cbGroup = new InputCheckbox(dashboard, TEST_FIELDS.checkbox)
        fs.addField(it.dom, cbGroup.dom)

        dashboard.appendChild(widget.dom)

        this.dom = dashboard
        this.holder.appendChild(dashboard)
    }

    initListeners() {

    }
}