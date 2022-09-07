/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-02
 */
import BaseField from '../base/base-field.js'

export default class Fieldset extends BaseField {
    static TAG = 'fieldset'

    static DEFAULT_OPTIONS = {
        type: Fieldset.TAG,
        legend: undefined,
        group: `${Fieldset.TAG}-group`,
        useFieldset: true,
    }

    constructor(element, options) {
        super(element, options)

        this.fields = new Map()

        this.content = null

        this.initField()
    }

    get defaultOptions() {
        return simpleMerge(Fieldset.DEFAULT_OPTIONS, this.constructor.DEFAULT_OPTIONS)
    }

    initField() {
        const options = this.options

        const fieldset = this.createElement(options.useFieldset)

        const content = document.createElement('div')
        content.classList.add('fieldset-content')
        fieldset.append(content)

        this.content = content
        this.dom = fieldset
        this.holder.appendChild(fieldset)
    }

    createElement(useFieldset) {
        let element, legend
        const options = this.options
        if (useFieldset) {
            element = document.createElement('fieldset')
            legend = document.createElement('legend')
            if (!isNull(options.legend)) legend.textContent = this.options.legend
        } else {
            element = document.createElement('div')
            element.classList.add('fieldset', options.group)

            legend = document.createElement('div')
            legend.classList.add('fieldset-legend')
            if (!isNull(options.legend)) legend.textContent = this.options.legend
        }

        element.appendChild(legend)

        return element
    }

    addField(...fields) {
        const group = this.options.group
        if (isNull(fields)) throw Error('Invalid fields : null fields')
        if (fields.length === 0) throw Error('Invalid fields : empty fields')

        fields.forEach((field, idx) => {
            this.fields.set(`${group}-${idx}`, field)
            this.content.appendChild(field)
        })
    }
}