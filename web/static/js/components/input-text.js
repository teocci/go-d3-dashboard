/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseInput from '../base/base-input.js'

export default class InputText extends BaseInput {
    static TAG = 'text'

    static DEFAULT_OPTIONS = {
        type: InputText.TAG,
        id: InputText.TAG,
        label: undefined,
        name: undefined,
        required: undefined,
        placeholder: undefined,
        minLength: undefined,
        maxLength: undefined,
        size: undefined,
        labelFirst: true,
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
        if (options.minLength) input.minLength = options.minLength
        if (options.maxLength) input.maxLength = options.maxLength
        if (options.size) input.size = options.size
    }
}