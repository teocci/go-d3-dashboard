/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseComponent from './base-component.js'

export default class BaseField extends BaseComponent {
    constructor(element, options) {
        super(element)

        this.loadOptions(options)
    }

    get defaultOptions() {
        return cloner(this.constructor.DEFAULT_OPTIONS)
    }

    loadOptions(options) {
        const base = this.defaultOptions
        const merged = simpleMerge(base, options)
        this.options = merged

        if (merged && !isNil(merged.inputs) && merged.inputs.length > 0) {
            const inputs = []
            for (const raw of merged.inputs) {
                const input = simpleMerge(super.DEFAULT_INPUT_OPTIONS, raw)
                input.label = input.label ?? this.tag
                input.name = input.name ?? `${merged.group}`
                inputs.push(input)
            }
            merged.inputs = [...inputs]
        }
    }

    loadClasses() {
        const classes = this.options.classes
        if (!isArray(classes)) return

        this.addClass(...classes)
    }
}