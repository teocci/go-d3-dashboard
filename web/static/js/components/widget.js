/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-05
 */
import BaseComponent from '../base/base-component.js'
import Modal from './modal.js'
import Fieldset from './fieldset.js'
import BaseForm from '../base/base-form.js'
import FieldsetRadio from './fieldset-radio.js'
import InputFile from './input-file.js'
import InputText from './input-text.js'

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
        const content = this.modal.content

        const form = new BaseForm(content)
        const formContent = form.content
        const fs = new Fieldset(formContent, FS_CHART_SETTINGS)
        const dataInput = new Fieldset(fs.content, FS_DATA_INPUT)
        const type = new FieldsetRadio(dataInput.content, RF_TYPE)
        const file = new InputFile(dataInput.content, IF_FILE)
        const connect = new InputText(dataInput.content, IT_CONNECTION)
        file.show()
        connect.hide()

        type.fields.forEach(field => {
            field.input.onchange = e => {
                const type = e.target.id
                switch (type) {
                    case 'di-type-file':
                        file.show()
                        connect.hide()
                        break
                    case 'di-type-realtime':
                        file.hide()
                        connect.show()
                        break
                }
            }
        })

        file.input.onchange = e => { console.log(`${e.target.id} -> onchange`) }

        this.modal.show()
    }
}