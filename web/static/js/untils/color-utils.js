/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-13
 */

import Color from './color/color.js'

export default class ColorUtils {
    static transparentize(value, opacity) {
        const alpha = isNil(opacity) ? 0.5 : opacity
        return new Color(value).alpha(alpha).rgbString()
    }
}