/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-06
 */
import BaseComponent from './base-component.js'

export default class BaseInput extends BaseComponent {
    static DEFAULT_INPUT_OPTIONS = {
        id: undefined,
        label: undefined,
        name: undefined,
        value: undefined,
        required: undefined,
        labelFirst: true,
        showLabel: true,
    }

    constructor(element, options) {
        super(element)

        this.label = null
        this.input = null

        this.options = merger(true, this.defaultOptions, options)

        this.initInput()
    }

    get defaultOptions() {
        return merger(true, BaseInput.DEFAULT_INPUT_OPTIONS, this.constructor.DEFAULT_OPTIONS)
    }

    get value() {
        const input = this.input
        if (isNull(input)) throw new Error('InvalidAttribute: input is null')
        return input.value
    }

    set value(v) {
        const input = this.input
        if (isNull(input)) throw new Error('InvalidAttribute: input is null')
        input.value = v

        const event = new Event('change')
        input.dispatchEvent(event)
    }

    initInput() {
        const options = this.options

        const field = document.createElement('div')
        field.classList.add('field', `${this.tag}-input`)

        const label = document.createElement('label')
        label.classList.add('label')
        if (!isNull(options.id)) label.htmlFor = options.id
        if (!isNull(options.label)) label.textContent = options.label
        if (!options.showLabel) label.classList.add('hidden')

        const input = document.createElement('input')
        input.type = options.type

        if (!isNull(options.id)) input.id = options.id
        if (!isNull(options.name)) input.name = options.name
        if (!isNull(options.value)) input.value = options.value
        if (!isNull(options.required)) input.required = options.required

        if (options.labelFirst) field.append(label, input)
        else {
            label.classList.add('ender')
            field.append(input, label)
        }

        this.label = label
        this.input = input

        this.dom = field
        if (!isNull(this.holder)) this.holder.appendChild(field)
    }

    enable() {
        this.input.disabled = false
    }

    disable() {
        this.input.disabled = true
    }
}