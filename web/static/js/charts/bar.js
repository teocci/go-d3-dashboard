/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */
import BaseChart from './base-chart.js'
import ColorUtils from '../untils/color-utils.js'

export default class Bar extends BaseChart {
    static TAG = 'bar'

    /**
     *
     * @param rawX
     * @param rawY
     * @param raw
     * @return {Object|null}
     */
    parseDataset(rawX, rawY, raw) {
        const {data} = super.parseDataset(rawX, rawY, raw)

        const yWidth = this.asNumber(rawY.width) || 1
        const yOpacity = this.asNumber(rawY.opacity) || 1
        const yColor = rawY.color || '#F2495C'
        const yBackground = rawY.background || '#d2858d'

        const label = this.parseLabel(rawY)
        const borderWidth = yWidth
        const borderColor = ColorUtils.transparentize(yColor, yOpacity)
        const backgroundColor = ColorUtils.transparentize(yBackground, yOpacity)

        const pointRadius = data.length > 100 ? 0 : yWidth + 1

        return {
            data,
            label,
            borderColor,
            backgroundColor,
            borderWidth,
            pointRadius,
        }
    }
}