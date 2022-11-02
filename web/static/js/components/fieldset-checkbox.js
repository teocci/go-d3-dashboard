/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-06
 */
import InputCheckbox from './input-checkbox.js'
import Fieldset from './fieldset.js'

export default class FieldsetCheckbox extends Fieldset {
    static TAG = 'checkboxes'

    static DEFAULT_OPTIONS = {
        type: FieldsetCheckbox.TAG,
        legend: undefined,
        group: `${FieldsetCheckbox.TAG}-group`,
        classes: undefined,
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
        if (!isNil(inputs) && inputs.length > 0) {
            inputs.forEach((input, idx) => {
                const field = new InputCheckbox(content, input)
                const id = input.id ?? `${group}-${idx}`
                this.fields.set(id, field)
            })
        }
    }
}