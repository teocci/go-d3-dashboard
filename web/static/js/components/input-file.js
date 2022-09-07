/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-07
 */

import BaseInput from '../base/base-input.js'

export default class InputFile extends BaseInput {
    static TAG = 'file'

    static DEFAULT_OPTIONS = {
        type: InputFile.TAG,
        id: InputFile.TAG,
        label: undefined,
        name: undefined,
        required: undefined,
        accept: undefined,
        capture: undefined,
        multiple: undefined,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    initElement() {
        const options = this.options

        const input = this.input
        input.requiered = options.requiered
        if (options.accept) input.accept = options.accept
        if (options.capture) input.capture = options.capture
        if (options.multiple) input.multiple = options.multiple
    }
}