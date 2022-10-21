/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-13
 */

import {b2n, n2b} from './byte.js'

const to = v => v <= 0.0031308 ? v * 12.92 : Math.pow(v, 1.0 / 2.4) * 1.055 - 0.055
const from = v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)

/**
 * Interpolate rgb1 and rgb2
 *
 * @param {RGBA} rgb1 from color
 * @param {RGBA} rgb2 to color
 * @param {number} t 0..1
 * @returns {RGBA} interpolated
 */
export const interpolate = (rgb1, rgb2, t) => {
    const r = from(b2n(rgb1.r))
    const g = from(b2n(rgb1.g))
    const b = from(b2n(rgb1.b))

    return {
        r: n2b(to(r + t * (from(b2n(rgb2.r)) - r))),
        g: n2b(to(g + t * (from(b2n(rgb2.g)) - g))),
        b: n2b(to(b + t * (from(b2n(rgb2.b)) - b))),
        a: rgb1.a + t * (rgb2.a - rgb1.a),
    }
}