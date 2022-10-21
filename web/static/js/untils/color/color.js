/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-13
 */
import {b2n, n2b, round} from './byte.js'
import {hexParse, hexString} from './hex.js'
import {clone, fromObject, functionParse, modHSL} from './helper.js'
import {rgbString} from './rgb.js'
import {hslString, rotate} from './hue.js'

export default class Color {
    /**
     * constructor
     * @param {Color|RGBA|string|number[]} input
     */
    constructor(input) {
        if (input instanceof Color) {
            return input
        }
        const type = typeof input
        let v
        if (type === 'object') {
            v = fromObject(input)
        } else if (type === 'string') {
            v = hexParse(input) || functionParse(input)
        }

        /** @type {RGBA} */
        this._rgba = v
        /** @type {boolean} */
        this._valid = !!v
    }

    /**
     * `true` if this is a valid color
     *
     * @returns {boolean}
     */
    get valid() {
        return this._valid
    }

    /**
     * @returns {RGBA} - the color
     */
    get rgb() {
        const v = clone(this._rgba)
        if (v) {
            v.a = b2n(v.a)
        }
        return v
    }

    /**
     * @param {RGBA} obj - the color
     */
    set rgb(obj) {
        this._rgba = fromObject(obj)
    }

    /**
     * rgb(a) string
     *
     * @return {string|undefined}
     */
    rgbString = () => this._valid ? rgbString(this._rgba) : undefined

    /**
     * hex string
     *
     * @return {string|undefined}
     */
    hexString = () => this._valid ? hexString(this._rgba) : undefined

    /**
     * hsl(a) string
     *
     * @return {string|undefined}
     */
    hslString = () => this._valid ? hslString(this._rgba) : undefined

    /**
     * Mix another color to this color.
     *
     * @param {Color} color - Color to mix in
     * @param {number} weight - 0..1
     * @returns {Color}
     */
    mix(color, weight) {
        if (color) {
            const c1 = this.rgb
            const c2 = color.rgb
            let w2 // using instead of undefined in the next line
            const p = weight === w2 ? 0.5 : weight
            const w = 2 * p - 1
            const a = c1.a - c2.a
            const w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0
            w2 = 1 - w1
            c1.r = 0xFF & w1 * c1.r + w2 * c2.r + 0.5
            c1.g = 0xFF & w1 * c1.g + w2 * c2.g + 0.5
            c1.b = 0xFF & w1 * c1.b + w2 * c2.b + 0.5
            c1.a = p * c1.a + (1 - p) * c2.a
            this.rgb = c1
        }
        return this
    }

    /**
     * Interpolate a color value between this and `color`
     *
     * @param {Color} color
     * @param {number} t - 0..1
     * @returns {Color}
     */
    interpolate(color, t) {
        if (color) {
            this._rgb = interpolate(this._rgb, color._rgb, t)
        }
        return this
    }

    /**
     * Clone
     *
     * @returns {Color}
     */
    clone = () => new Color(this.rgb)

    /**
     * Set alpha
     *
     * @param {number} a - the alpha [0..1]
     * @returns {Color}
     */
    alpha(a) {
        this._rgba.a = n2b(a)
        return this
    }

    /**
     * Make clearer
     *
     * @param {number} ratio - ratio [0..1]
     * @returns {Color}
     */
    clearer(ratio) {
        const rgb = this._rgba
        rgb.a *= 1 - ratio
        return this
    }

    /**
     * Convert to grayscale
     *
     * @url http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
     * @returns {Color}
     */
    greyscale() {
        const rgb = this._rgba
        const val = round(rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11)
        rgb.r = rgb.g = rgb.b = val
        return this
    }

    /**
     * Opaquer
     * @param {number} ratio - ratio [0..1]
     * @returns {Color}
     */
    opaquer(ratio) {
        const rgb = this._rgba
        rgb.a *= 1 + ratio
        return this
    }

    /**
     * Negates the rgb value
     * @returns {Color}
     */
    negate() {
        const v = this._rgba
        v.r = 255 - v.r
        v.g = 255 - v.g
        v.b = 255 - v.b
        return this
    }

    /**
     * Lighten
     * @param {number} ratio - ratio [0..1]
     * @returns {Color}
     */
    lighten(ratio) {
        modHSL(this._rgba, 2, ratio)
        return this
    }

    /**
     * Darken
     * @param {number} ratio - ratio [0..1]
     * @returns {Color}
     */
    darken(ratio) {
        modHSL(this._rgba, 2, -ratio)
        return this
    }

    /**
     * Saturate
     * @param {number} ratio - ratio [0..1]
     * @returns {Color}
     */
    saturate(ratio) {
        modHSL(this._rgba, 1, ratio)
        return this
    }

    /**
     * Desaturate
     * @param {number} ratio - ratio [0..1]
     * @returns {Color}
     */
    desaturate(ratio) {
        modHSL(this._rgba, 1, -ratio)
        return this
    }

    /**
     * Rotate
     * @param {number} deg - degrees to rotate
     * @returns {Color}
     */
    rotate(deg) {
        rotate(this._rgba, deg)
        return this
    }
}