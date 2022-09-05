/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseComponent from './base-component.js'

export default class BaseField extends BaseComponent {
    static DEFAULT_INPUT_OPTIONS = {
        id: undefined,
        label: undefined,
        checked: undefined,
        value: undefined,
    }

    constructor(element, options) {
        super(element)

        this.options = Object.assign(this.defaultOptions, options)
        if (this.options.inputs) {
            const inputs = []
            for (const input of this.options.inputs) {
                inputs.push(simpleMerge(BaseField.DEFAULT_INPUT_OPTIONS, input))
            }
            this.options.inputs = inputs
        }
        console.log({options: this.options})
    }

    get defaultOptions () {
        return this.constructor.DEFAULT_OPTIONS
    }
}