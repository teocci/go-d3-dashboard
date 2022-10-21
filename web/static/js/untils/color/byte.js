/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-13
 */

/**
 * Rounds decimal to the nearest integer
 *
 * @param {number} v - the number to round
 */
export const round = v => {
    return v + 0.5 | 0
}

/**
 *
 * @param {number} v
 * @param {number} l
 * @param {number} h
 * @returns {number}
 */
export const lim = (v, l, h) => Math.max(Math.min(v, h), l)

/**
 * Convert percent to byte 0..255
 *
 * @param {number} v - 0..100
 */
export const p2b = v => {
    return lim(round(v * 2.55), 0, 255)
}

/**
 * Convert byte to percent 0..100
 *
 * @param {number} v - 0..255
 */
export const b2p = v => {
    return lim(round(v / 2.55), 0, 100)
}

/**
 * Convert normalized to byte 0..255
 *
 * @param {number} v - 0..1
 */
export const n2b = v => {
    return lim(round(v * 255), 0, 255)
}

/**
 * Convert byte to normalized 0..1
 *
 * @param {number} v - 0..255
 */
export const b2n = v => {
    return lim(round(v / 2.55) / 100, 0, 1)
}

/**
 * Convert normalized to percent 0..100
 *
 * @param {number} v - 0..1
 */
export const n2p = v => {
    return lim(round(v * 100), 0, 100)
}