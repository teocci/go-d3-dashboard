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
                this.fields.set(`${group}-${idx}`, field)
            })
        }
    }
}