/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-06
 */
import BaseComponent from './base-component.js'

export default class BaseInput extends BaseComponent {
    static DEFAULT_INPUT_OPTIONS = {
        id: undefined,
        label: undefined,
        value: undefined,
    }

    constructor(element, options) {
        super(element)

        this.options = Object.assign(this.defaultOptions, options)
    }

    get defaultOptions () {
        return this.constructor.DEFAULT_OPTIONS
    }
}