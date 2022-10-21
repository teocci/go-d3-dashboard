/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-01
 */
import BaseInput from '../base/base-input.js'

export default class InputColor extends BaseInput {
    static TAG = 'color'

    static DEFAULT_COLORS = [
        {name: 'silver', color: '#CCCCDC'},
        {name: 'red', color: '#ff0000'},
        {name: 'purple', color: '#B877D9'},
        {name: 'green', color: '#008000'},
        {name: 'light-green', color: '#629E51'},
        {name: 'dark-green', color: '#1A7F4B'},
        {name: 'yellow', color: '#ffff00'},
        {name: 'light-blue', color: '#82B5D8'},
        {name: 'blue', color: '#33A2E5'},
        {name: 'teal', color: '#008080'},
        {name: 'dark-teal', color: '#5195CE'},
        {name: 'aqua', color: '#00ffff'},
        {name: 'light-aqua', color: '#70DBED'},
        {name: 'salmon', color: '#E14D42'},
        {name: 'sexy-red', color: '#F2495C'},
        {name: 'orange', color: '#FF780A'},
        {name: 'happy-yellow', color: '#EAB839'},
        {name: 'banana', color: '#F2C96D'},
        {name: 'vanilla', color: '#F9E2D2'},
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