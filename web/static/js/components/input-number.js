/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseInput from '../base/base-input.js'

export default class InputNumber extends BaseInput {
    static TAG = 'number'

    static DEFAULT_OPTIONS = {
        type: InputNumber.TAG,
        id: InputNumber.TAG,
        label: undefined,
        name: undefined,
        required: undefined,
        placeholder: undefined,
        step: undefined,
        min: undefined,
        max: undefined,
        size: undefined,
        list: undefined,
        labelFirst: true,
        showLabel: true,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    initElement() {
        const options = this.options

        const input = this.input
        input.requiered = options.requiered
        if (options.placeholder) input.placeholder = options.placeholder
        if (options.step) input.step = options.step
        if (options.min) input.min = options.min
        if (options.max) input.max = options.max
        if (options.size) input.size = options.size
        if (options.list) input.list = options.list
    }
}