/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-07
 */
import BaseInput from '../base/base-input.js'

export default class InputRadio extends BaseInput {
    static TAG = 'radio'

    static DEFAULT_OPTIONS = {
        type: InputRadio.TAG,
        id: undefined,
        label: undefined,
        name: undefined,
        value: undefined,
        checked: false,
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
        if (!isNil(options.checked)) input.checked = options.checked
    }
}