/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseComponent from './base-component.js'

export default class BaseField extends BaseComponent {
    constructor(element, options) {
        super(element, options)

        const oldOptions = this.defaultOptions
        this.options = Object.assign(oldOptions, options)

        if (this.options && !isNull(this.options.inputs) && this.options.inputs.length > 0) {
            const inputs = []
            for (const raw of this.options.inputs) {
                const input = simpleMerge(BaseField.DEFAULT_INPUT_OPTIONS, raw)
                input.label = input.label ?? this.tag
                input.name = input.name ?? `${this.options.group}`
                inputs.push(input)
            }
            this.options.inputs = [...inputs]
        }
        console.log({options: this.options})
    }

    get defaultOptions() {
        return Object.assign(null, this.constructor.DEFAULT_OPTIONS)
    }
}