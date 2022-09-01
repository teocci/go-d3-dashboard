/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseField from '../base/base-field.js'

export default class InputCheckbox extends BaseField {
    static TAG = 'checkbox'

    static DEFAULT_OPTIONS = {
        title: undefined,
        groupName: undefined,
        checkboxes: undefined,
    }

    constructor(element, options) {
        super(element, options)
        this.initElement()
    }

    initElement() {
        const options = this.options
        if (options.checkboxes == null) throw Error('invalidCheckboxes: null checkboxes')
        if (options.checkboxes.length === 0) throw Error('invalidCheckboxes: empty checkboxes')

        const div = document.createElement('div')
        options.text ? div.textContent = options.title : null

        options.checkboxes.forEach(checkbox => {
            const label = document.createElement('label')
            checkbox.id ? label.htmlFor = checkbox.id : null
            checkbox.label ? label.textContent = checkbox.label : null

            const input = document.createElement('input')
            input.type = InputCheckbox.TAG
            checkbox.id ? input.id = checkbox.id : null
            checkbox.checked ? input.checked = checkbox.checked : null

            options.groupName ? input.name = options.groupName : null

            div.append(label, input)
        })
    }
}