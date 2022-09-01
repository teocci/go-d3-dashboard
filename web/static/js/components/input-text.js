/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseField from '../base/base-field.js'

export default class InputText extends BaseField {
    static TAG = 'text'

    static DEFAULT_OPTIONS = {
        id: undefined,
        text: undefined,
        name: undefined,
        required: undefined,
        minLength: undefined,
        maxLength: undefined,
        size: undefined,
    }

    constructor(element, options) {
        super(element)

        this.options = Object.assign(InputText.DEFAULT_OPTIONS, options)
        this.initElement()
    }

    initElement() {
        const options = this.options
        console.log(options)
        const div = document.createElement('div')

        const label = document.createElement('label')
        options.id ? label.htmlFor = options.id : null
        options.text ? label.textContent = options.text : null

        const input = document.createElement('input')
        input.type = InputText.TAG
        options.minLength ? input.id = options.id : null
        options.maxLength ? input.name = options.name : null
        options.requiered ? input.requiered = options.requiered : null
        options.minLength ? input.minLength = options.minLength : null
        options.maxLength ? input.maxLength = options.maxLength : null
        options.size ? input.size = options.size : null

        div.append(label, input)
    }
}