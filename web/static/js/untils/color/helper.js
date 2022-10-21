/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-13
 */
import {rgbParse} from './rgb.js'
import {hsl2rgb, hueParse, rgb2hsl} from './hue.js'
import {n2b} from './byte.js'

/**
 * Modify HSL properties
 *
 * @param {RGBA} v - the color
 * @param {number} i - index [0=h, 1=s, 2=l]
 * @param {number} ratio - ratio [0..1]
 * @hidden
 */
export const modHSL = (v, i, ratio) => {
    if (v) {
        let tmp = rgb2hsl(v)
        tmp[i] = Math.max(0, Math.min(tmp[i] + tmp[i] * ratio, i === 0 ? 360 : 1))
        tmp = hsl2rgb(tmp)
        v.r = tmp[0]
        v.g = tmp[1]
        v.b = tmp[2]
    }
}

/**
 * Clone color
 *
 * @param {RGBA} v - the color
 * @param {object} [proto] - prototype
 * @hidden
 */
export const clone = (v, proto) => v ? Object.assign(proto || {}, v) : v

/**
 * @param {RGBA|number[]} input
 * @hidden
 */
export const fromObject = input => {
    let v = {r: 0, g: 0, b: 0, a: 255}
    if (Array.isArray(input)) {
        if (input.length >= 3) {
            v = {r: input[0], g: input[1], b: input[2], a: 255}
            if (input.length > 3) {
                v.a = n2b(input[3])
            }
        }
    } else {
        v = clone(input, {r: 0, g: 0, b: 0, a: 1})
        v.a = n2b(v.a)
    }

    return v
}

/**
 * @param {string} str
 * @hidden
 */
export const functionParse = str => {
    if (str.charAt(0) === 'r') {
        return rgbParse(str)
    }
    return hueParse(str)
}