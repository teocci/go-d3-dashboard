/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */
import Line from './line.js'

export default class LineSeries extends Line {
    get axisKeys() {
        return ['x']
    }

    /**
     *
     * @param config
     * @return {Object|null}
     */
    parseDatasets(config) {
        const {x} = this.parseAxisConfig(config.source.axis)
        const series = config.source?.series ?? null
        if (isNil(x) || isNil(series)) return null

        const {data} = config

        return this.parseDataSeries(x, series, data)
    }
}