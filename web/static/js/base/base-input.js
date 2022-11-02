/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-06
 */
import BaseComponent from './base-component.js'

export default class BaseInput extends BaseComponent {
    static DEFAULT_INPUT_OPTIONS = {
        type: undefined,
        id: undefined,
        classes: undefined,
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
        if (isNil(input)) throw new Error('InvalidAttribute: input is null')
        return input.value
    }

    set value(v) {
        const input = this.input
        if (isNil(input)) throw new Error('InvalidAttribute: input is null')
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
        if (!isNil(options.id)) label.htmlFor = options.id
        if (!isNil(options.label)) label.textContent = options.label
        if (!options.showLabel) label.classList.add('hidden')

        const input = document.createElement('input')
        input.type = options.type

        if (!isNil(options.id)) input.id = options.id
        if (!isNil(options.name)) input.name = options.name
        if (!isNil(options.value)) input.value = options.value
        if (!isNil(options.required)) input.required = options.required

        if (options.labelFirst) field.append(label, input)
        else {
            label.classList.add('ender')
            field.append(input, label)
        }

        this.label = label
        this.input = input

        this.dom = field
        if (!isNil(this.holder)) this.holder.appendChild(field)
    }

    loadClasses() {
        const classes = this.options.classes
        if (!isArray(classes)) return

        this.addClass(...classes)
    }

    enable() {
        this.input.disabled = false
    }

    disable() {
        this.input.disabled = true
    }
}