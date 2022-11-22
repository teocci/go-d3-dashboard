/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */
import BaseChart from './base-chart.js'

export default class Bubble extends BaseChart {
    static TAG = 'bubble'

    get axisKeys() {
        return ['x', 'y', 'r']
    }

    /**
     *
     * @param config
     * @return {Object|null}
     */
    parseDatasets(config) {
        const axes = this.parseAxisConfig(config.source.axis)
        if (isNil(axes.x) || isNil(axes.y) || isNil(axes.r)) return null

        const {data} = config
        return [this.parseDataset(axes, data)]
    }

    groupByX(values) {
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
     * @param axes
     * @param data
     * @param id
     * @return {Object}
     */
    parseDatasetParams(axes, data, id) {
        id = id || 'r'
        const p = super.parseDatasetParams(axes, data, id)
        p.label = this.parseLabel(axes.y)

        return p
    }
}