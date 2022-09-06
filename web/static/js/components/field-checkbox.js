import BaseField from '../base/base-field.js'
import InputCheckbox from './input-checkbox.js'

export default class FieldCheckbox extends BaseField {
    static TAG = 'checkbox'

    static DEFAULT_OPTIONS = {
        type: FieldCheckbox.TAG,
        legend: null,
        group: `${FieldCheckbox.TAG}-group`,
        inputs: [],
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    initElement() {
        const options = this.options

        const fieldset = document.createElement('fieldset')
        const legend = document.createElement('legend')
        if (!isNull(options.legend)) legend.textContent = options.legend
        fieldset.appendChild(legend)

        if (!isNull(options.inputs) && options.inputs.length > 0) {
            options.inputs.forEach(inputOptions => {
                new InputCheckbox(fieldset, inputOptions)
            })
        }

        this.dom = fieldset
        this.holder.append(fieldset)
    }
}