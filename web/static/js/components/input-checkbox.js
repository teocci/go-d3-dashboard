/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseInput from '../base/base-input.js'

export default class InputCheckbox extends BaseInput {
    static TAG = 'checkbox'

    static DEFAULT_OPTIONS = {
        type: InputCheckbox.TAG,
        id: undefined,
        label: undefined,
        name: undefined,
        value: undefined,
        checked: false,
        indeterminate: undefined,
        labelFirst: false,
        showLabel: true,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    initElement() {
        const options = this.options
        const input = this.input
        if (!isNull(options.checked)) input.checked = options.checked
        if (!isNull(options.indeterminate)) input.indeterminate = options.indeterminate
    }
}