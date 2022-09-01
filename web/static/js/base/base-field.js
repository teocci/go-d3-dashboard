/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseComponent from './base-component.js'

export default class BaseField extends BaseComponent {
    constructor(element, options) {
        super(element)

        this.options = Object.assign(this.defaultOptions, options)
    }

    get defaultOptions () {
        return this.constructor.DEFAULT_OPTIONS
    }
}