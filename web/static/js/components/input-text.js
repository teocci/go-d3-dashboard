/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseInput from '../base/base-input.js'

export default class InputText extends BaseInput {
    static TAG = 'text'

    static DEFAULT_OPTIONS = {
        id: InputText.TAG,
        label: undefined,
        name: undefined,
        required: undefined,
        placeholder: undefined,
        minLength: undefined,
        maxLength: undefined,
        size: undefined,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    initElement() {
        const options = this.options
        console.log({options})

        const field = document.createElement('div')

        const label = document.createElement('label')
        if (options.id) label.htmlFor = options.id
        if (options.label) label.textContent = options.label

        const input = document.createElement('input')
        input.type = InputText.TAG
        input.id = options.id
        input.requiered = options.requiered
        if (options.name) input.name = options.name
        if (options.placeholder) input.placeholder = options.placeholder
        if (options.minLength) input.minLength = options.minLength
        if (options.maxLength) input.maxLength = options.maxLength
        if (options.size) input.size = options.size

        field.append(label, input)

        this.dom = field
        this.holder.appendChild(field)
    }
}