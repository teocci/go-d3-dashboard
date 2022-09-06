/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-05
 */
import BaseComponent from '../base/base-component.js'
import Modal from './modal.js'
import Fieldset from './fieldset.js'
import InputText from './input-text.js'
import InputCheckbox from './input-checkbox.js'
import FieldCheckbox from './field-checkbox.js'

export default class Widget extends BaseComponent {
    constructor(element) {
        super(element)
        this.modal = null

        this.initElements()
    }

    initElements() {
        const widget = document.createElement('div')
        widget.classList.add('widget-holder')

        const btn = document.createElement('button')
        btn.classList.add('add-widget')
        btn.textContent = '차트 추가'
        btn.onclick = e => this.onAddWidgetClick(e)

        widget.appendChild(btn)

        this.dom = widget
        this.holder.appendChild(widget)
    }

    onAddWidgetClick(e) {
        this.modal = new Modal(this.dom)
        const modalBody = this.modal.body
        const fs = new Fieldset(modalBody, TEST_FIELDS.fieldset)
        const it = new InputText(modalBody, TEST_FIELDS.text)
        const cbGroup = new FieldCheckbox(modalBody, TEST_FIELDS.checkbox)
        fs.addField(it.dom, cbGroup.dom)
        this.modal.show()
    }
}