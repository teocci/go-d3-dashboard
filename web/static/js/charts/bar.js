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
        const x = this.parseAxisScale(rawX)
        const y = this.parseAxisScale(rawY)

        if (isNil(x)) throw new TypeError('x is null')
        if (isNil(y)) throw new TypeError('y is null')

        const values = this.parseXYDataset(x, y, raw)
        const data = this.groupedByX ? this.groupXYByX(values) : values

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

    parseData(config) {
        console.log({config})
        const data = config.data
        if (isNil(data)) return null

        const x = config.source.axis?.x ?? null
        const y = config.source.axis?.y ?? null
        if (isNil(x) || isNil(y)) return null

        const datasets = [this.parseDataset(x, y, data)]

        return {
            datasets,
        }
    }
}