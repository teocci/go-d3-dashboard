/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */
import BaseChart from './base-chart.js'
import ColorUtils from '../untils/color-utils.js'

export default class Scatter extends BaseChart {
    static TAG = 'scatter'

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
        const yRadius = this.asNumber(rawY.radius) || 2
        const yCurve = rawY.curve || 'linear'
        const yColor = rawY.color || '#F2495C'

        const label = this.parseLabel(rawY)
        const borderWidth = yWidth
        const borderColor = ColorUtils.transparentize(yColor, yOpacity)
        const backgroundColor = ColorUtils.transparentize(yColor, 0.1)

        const pointRadius = yRadius

        const cubicInterpolationMode = yCurve === 'linear' ? 'default' : 'monotone'
        const stepped = yCurve === 'step'
        const tension = yCurve === 'smooth' ? 0.2 : 0

        return {
            data,
            label,
            borderColor,
            backgroundColor,
            borderWidth,
            pointRadius,
            tension,
            stepped,
            cubicInterpolationMode,
        }
    }
}