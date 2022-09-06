/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseInput from '../base/base-input.js'

export default class InputCheckbox extends BaseInput {
    static TAG = 'checkbox'

    static DEFAULT_OPTIONS = {
        type: InputCheckbox.TAG,
        id: null,
        label: null,
        name: null,
        checked: false,
        value: null,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    initElement() {
        const options = this.options

        const field = document.createElement('div')

        const label = document.createElement('label')
        if (!isNull(options.id)) label.htmlFor = options.id
        if (!isNull(options.label)) label.textContent = options.label

        const input = document.createElement('input')
        input.type = this.tag
        if (!isNull(options.id)) input.id = options.id
        if (!isNull(options.checked)) input.checked = options.checked
        if (!isNull(options.value)) input.value = options.value
        if (!isNull(options.name)) input.name = options.name

        field.append(label, input)

        this.dom = field
        this.holder.append(field)
    }
}