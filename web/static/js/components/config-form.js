/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseComponent from '../base/base-component.js'

export default class ConfigForm extends BaseComponent {
    constructor(element) {
        super(element)

        this.initElements()
    }

    initElements() {
        const dataInput = document.createElement('fieldset')
        const legend = document.createElement('legend')
    }
}