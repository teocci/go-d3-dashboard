/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */
import BaseChart from './base-chart.js'
import ColorUtils from '../untils/color-utils.js'

export default class Line extends BaseChart {
    static TAG = 'line'

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

        if (isNil(x)) return null
        if (isNil(y)) return null

        const values = this.parseXYDataset(x, y, raw)
        const data = this.groupedByX ? this.groupXYByX(values) : values

        const yWidth = this.asNumber(rawY.width) || 1
        const yOpacity = this.asNumber(rawY.opacity) || 1
        const yCurve = rawY.curve || 'linear'
        const yColor = rawY.color || '#F2495C'

        const label = this.parseLabel(rawY)
        const borderWidth = yWidth
        const borderColor = ColorUtils.transparentize(yColor, yOpacity)
        const backgroundColor = ColorUtils.transparentize(yColor, yOpacity)

        const pointRadius = data.length > 100 ? 0 : yWidth + 1

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

    /**
     *
     * @param config
     * @return {Object|null}
     */
    parseData(config) {
        console.log({config})
        const data = config.data
        if (isNil(data)) return null

        const x = config.source.axis?.x ?? null
        const series = config.source?.series ?? null
        if (isNil(x) || isNil(series)) return null

        const datasets = this.parseDataSeries(x, series, data)

        return {
            datasets,
        }
    }
}