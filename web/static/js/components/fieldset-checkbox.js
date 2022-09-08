/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-06
 */
import InputCheckbox from './input-checkbox.js'
import Fieldset from './fieldset.js'

export default class FieldsetCheckbox extends Fieldset {
    static TAG = 'checkbox'

    static DEFAULT_OPTIONS = {
        type: FieldsetCheckbox.TAG,
        legend: undefined,
        group: `${FieldsetCheckbox.TAG}-group`,
        inputs: [],
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
                const field = new InputCheckbox(content, input)
                const id = input.id ?? `${group}-${idx}`
                this.fields.set(id, field)
            })
        }
    }
}