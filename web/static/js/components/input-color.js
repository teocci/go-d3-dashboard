/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseInput from '../base/base-input.js'

export default class InputColor extends BaseInput {
    static TAG = 'color'

    static DEFAULT_COLORS = [
        {name: 'black', color: '#000000'},
        {name: 'silver', color: '#c0c0c0'},
        {name: 'gray', color: '#808080'},
        {name: 'maroon', color: '#800000'},
        {name: 'red', color: '#ff0000'},
        {name: 'purple', color: '#800080'},
        {name: 'green', color: '#008000'},
        {name: 'yellow', color: '#ffff00'},
        {name: 'navy', color: '#000080'},
        {name: 'blue', color: '#0000ff'},
        {name: 'teal', color: '#008080'},
        {name: 'aqua', color: '#00ffff'},
    ]

    static DEFAULT_OPTIONS = {
        type: InputColor.TAG,
        id: InputColor.TAG,
        label: undefined,
        name: undefined,
        required: undefined,
        labelFirst: true,
        showLabel: true,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
    }

    initElement() {
        const options = this.options

        const input = this.input
        if (isNull(options.value)) input.value = this.randomColor()
        input.requiered = options.requiered
    }

    randomColor() {
        const len = InputColor.DEFAULT_COLORS.length
        return InputColor.DEFAULT_COLORS[Math.floor((Math.random() * len))].color
    }
}