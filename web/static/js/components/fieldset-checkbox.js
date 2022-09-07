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
        const options = this.options
        if (!isNull(options.inputs) && options.inputs.length > 0) {
            options.inputs.forEach(inputOptions => {
                new InputCheckbox(content, inputOptions)
                this.fields.set(`${group}-${idx}`, fields)
            })
        }
    }
}