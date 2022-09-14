/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-13
 */
import BaseComponent from '../base/base-component.js'

export default class Select extends BaseComponent {
    static TAG = 'select'
    static DEFAULT_ITEM_OPTIONS = {
        value: undefined,
        label: undefined,
        selected: undefined,
    }

    static DEFAULT_OPTIONS = {
        type: Select.TAG,
        id: undefined,
        legend: undefined,
        name: `${Select.TAG}-name`,
        disabled: undefined,
        required: undefined,
        multiple: undefined,
        size: undefined,
        items: [],
    }

    constructor(element, options) {
        super(element)

        this.items = new Map()

        this.options = Object.assign(this.constructor.DEFAULT_OPTIONS, options)
        if (this.options && !isNull(this.options.items) && this.options.items.length > 0) {
            const items = []
            for (const raw of this.options.items) {
                const input = simpleMerge(Select.DEFAULT_ITEM_OPTIONS, raw)
                input.label = input.label ?? this.tag
                items.push(input)
            }
            this.options.items = [...items]
        }

        this.initElement()
    }

    initElement() {
        const options = this.options

        const field = document.createElement('div')
        field.classList.add('field')

        const label = document.createElement('label')
        if (!isNull(options.id)) label.htmlFor = options.id
        if (!isNull(options.legend)) label.textContent = options.legend

        const select = document.createElement('select')
        if (!isNull(options.id)) select.id = options.id
        if (!isNull(options.name)) select.name = options.name
        if (!isNull(options.disabled)) select.disabled = options.disabled
        if (!isNull(options.required)) select.required = options.required
        if (!isNull(options.multiple)) select.multiple = options.multiple
        if (!isNull(options.size)) select.size = options.size

        options.items.forEach((item, idx) => {
            const option = this.createOption(item)

            const id = option.value ?? `${options.name}-${idx}`
            this.items.set(id, option)

            select.appendChild(option)
        })

        field.append(label, select)

        this.label = label
        this.input = select

        this.dom = field
        this.holder.append(field)
    }

    get selected() {
        for (const item of this.items.values()) if (item.selected) return item

        return null
    }

    createOption(item) {
        const option = document.createElement('option')
        if (!isNull(item.value)) option.value = item.value
        if (!isNull(item.label)) option.textContent = item.label
        if (!isNull(item.selected)) option.selected = item.selected

        return option
    }

    addItems(...values) {
        const name = this.options.name
        if (isNull(values)) throw Error('Invalid Parameter: null values')
        if (values.length === 0) throw Error('Invalid Parameter: empty values')

        values.forEach((value, idx) => {
            const item = {
                value: toKebabCase(value),
                label: toPascalCase(value),
                selected: idx === 0 ?? undefined,
            }
            const option = this.createOption(item)

            const id = value ?? `${name}-${idx}`
            this.items.set(id, option)

            this.input.appendChild(option)
        })
    }
}
