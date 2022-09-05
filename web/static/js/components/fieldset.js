/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-02
 */
import BaseComponent from '../base/base-component.js'

export default class Fieldset extends BaseComponent {
    static TAG = 'fieldset'

    static DEFAULT_OPTIONS = {
        type : Fieldset.TAG,
        legend : undefined,
        group : Fieldset.TAG,
    }

    constructor(element, options) {
        super(element)

        this.fields = new Map()
        this.options = Object.assign(Fieldset.DEFAULT_OPTIONS, options)

        this.initElements()
        this.initListeners()
    }

    initElements() {
        const options = this.options

        const fieldset = document.createElement('fieldset')
        const legend = document.createElement('legend')
        if (!isNull(options.legend)) legend.textContent = this.options.legend
        fieldset.appendChild(legend)

        this.dom = fieldset
        this.holder.appendChild(fieldset)
    }

    initListeners() {

    }

    addField(...fields) {
        const group = this.options.group
        if (isNull(fields)) throw Error('Invalid fields : null fields')
        if (fields.length === 0) throw Error('Invalid fields : empty fields')

        fields.forEach((fields, idx) => {
            this.fields.set(`${group}-${idx}`, fields)
            this.dom.appendChild(fields)
        })
    }
}