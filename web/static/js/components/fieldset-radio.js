/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-07
 */
import Fieldset from './fieldset.js'
import InputRadio from './input-radio.js'

export default class FieldsetRadio extends Fieldset {
    static TAG = 'radio'

    static DEFAULT_OPTIONS = {
        type: FieldsetRadio.TAG,
        legend: undefined,
        group: `${FieldsetRadio.TAG}-group`,
        inputs: [],
        useFieldset: true,
        showLegend: true,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    initElement() {
        const content = this.content
        const inputs = this.options.inputs
        const group = this.options.group
        if (!isNull(inputs) && inputs.length > 0) {
            inputs.forEach((input, idx) => {
                const field = new InputRadio(content, input)
                const id = input.id ?? `${group}-${idx}`
                this.fields.set(id, field)
            })
        }
    }

    fieldById(id) {
        for (const field of this.fields.values()) {
            if (field.input.id === id) return field
        }

        return null
    }

    set value(v) {
        this.checked = v
    }

    get value() {
        return this.checked
    }

    get checkedField() {
        for (const field of this.fields.values()) {
            if (field.input.checked) return field
        }

        return null
    }

    /**
     * Checks the radio input by id
     *
     * @param id
     */
    set checked(id) {
        const field = this.fieldById(id)
        if (isNull(field)) throw new Error('InvalidParameter: null field')

        field.input.checked = true
        const event = new Event('change')
        field.input.dispatchEvent(event)
    }

    /**
     * Returns the value of the radio checked
     *
     * @returns {String}
     */
    get checked() {
        return this.checkedField.value
    }
}