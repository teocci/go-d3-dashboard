/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseField from '../base/base-field.js'

export default class InputCheckbox extends BaseField {
    static TAG = 'checkbox'

    static DEFAULT_OPTIONS = {
        legend: undefined,
        ckbName: undefined,
        checkboxes: undefined,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    initElement() {
        const options = this.options
        if (isNull(options.checkboxes)) throw Error('invalidParameter: null checkboxes')
        if (options.checkboxes.length === 0) throw Error('invalidParameter: empty checkboxes')

        const field = document.createElement('div')
        if (!isNull(options.legend)) field.textContent = options.title

        options.checkboxes.forEach(checkbox => {
            const label = document.createElement('label')
            if (!isNull(checkbox.id)) label.htmlFor = checkbox.id
            if (!isNull(checkbox.label)) label.textContent = checkbox.label

            const input = document.createElement('input')
            input.type = InputCheckbox.TAG
            if (!isNull(checkbox.id)) input.id = checkbox.id
            if (!isNull(checkbox.checked)) input.checked = checkbox.checked
            if (!isNull(options.ckbName)) input.name = options.ckbName

            field.append(label, input)
        })

        this.dom = field
        this.holder.append(field)
    }
}