/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-07
 */
import Fieldset from './fieldset.js'
import InputRadio from './input-radio.js'

export default class FieldsetRadio extends Fieldset {
    static TAG = 'radios'

    static DEFAULT_OPTIONS = {
        type: FieldsetRadio.TAG,
        legend: undefined,
        group: `${FieldsetRadio.TAG}-group`,
        classes: undefined,
        inputs: [],
        useFieldset: true,
        showLegend: true,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    set value(v) {
        this.checked = v
    }

    get value() {
        return this.checked
    }

    /**
     * Returns the checked field
     *
     * @return {InputRadio|null}
     */
    get checkedField() {
        const fields = this.fields.values()
        for (const field of fields) {
            if (field.input.checked) return field
        }

        return null
    }

    /**
     * Checks the radio input by id
     *
     * @param {string} id
     */
    set checked(id) {
        const field = this.fieldById(id)
        if (isNil(field)) throw new Error('InvalidParameter: null field')

        const event = new Event('change')
        field.input.checked = true
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

    initElement() {
        const content = this.content
        const inputs = this.options.inputs
        if (isNil(inputs) || inputs.length < 1) return

        const group = this.options.group
        inputs.forEach((input, idx) => {
            const field = new InputRadio(content, input)
            const id = input.id ?? `${group}-${idx}`
            this.fields.set(id, field)
        })
    }

    /**
     * Returns a field by ID
     * @param {string} id
     * @return {null|InputRadio}
     */
    fieldById(id) {
        const fields = this.fields.values()
        for (const field of fields) {
            if (field.input.id === id) return field
        }

        return null
    }
}