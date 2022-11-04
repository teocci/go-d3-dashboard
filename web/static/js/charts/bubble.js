/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */
import BaseChart from './base-chart.js'
import ColorUtils from '../untils/color-utils.js'

export default class Bubble extends BaseChart {
    static TAG = 'bubble'

    parseXYRDataset(x, y, r, raw) {
        return raw.map(item => ({
            x: x.fnc(item[x.key]),
            y: y.fnc(item[y.key]),
            r: r.fnc(item[r.key]),
        }))
    }

    groupXYRByX(values) {
        const mapper = new Map()
        for (const value of values) {
            const axis = {
                y: value.y,
                r: value.r,
            }
            if (mapper.has(value.x)) mapper.get(value.x).push(axis)
            else mapper.set(value.x, [axis])
        }

        const data = []
        for (const [x, a] of mapper.entries()) {
            const sums = a.reduce((sums, v) => {
                sums[0] += v.y
                sums[1] += v.r
                return sums
            }, [0, 0])
            const y = sums[0] / a.length
            const r = sums[1] / a.length
            data.push({x, y, r})
        }

        return data
    }

    /**
     *
     * @param rawX
     * @param rawY
     * @param rawR
     * @param raw
     * @return {Object|null}
     */
    parseDatasetXYR(rawX, rawY, rawR, raw) {
        const x = this.parseAxisScale(rawX)
        const y = this.parseAxisScale(rawY)
        const r = this.parseAxisScale(rawR)

        if (isNil(x)) throw new TypeError('x is null')
        if (isNil(y)) throw new TypeError('y is null')
        if (isNil(r)) throw new TypeError('r is null')

        const values = this.parseXYRDataset(x, y, r, raw)
        const data = this.groupedByX ? this.groupXYRByX(values) : values

        const label = this.parseLabel(rawY)

        const rWidth = this.asNumber(rawR.width) || 1
        const rOpacity = this.asNumber(rawR.opacity) || 1
        const rColor = rawR.color || '#F2495C'
        const rBackground = rawR.background || '#d2858d'

        const borderWidth = rWidth
        const borderColor = ColorUtils.transparentize(rColor, rOpacity)
        const backgroundColor = ColorUtils.transparentize(rBackground, rOpacity)

        return {
            data,
            label,
            borderColor,
            backgroundColor,
            borderWidth,
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
        const y = config.source.axis?.y ?? null
        const r = config.source.axis?.r ?? null
        if (isNil(x) || isNil(y) || isNil(r)) return null

        const datasets = [this.parseDatasetXYR(x, y, r, data)]

        return {
            datasets,
        }
    }

}