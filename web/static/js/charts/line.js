/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */
import BaseChart from './base-chart.js'

export default class Line extends BaseChart {
    static TAG = 'line'

    /**
     *
     * @param axes
     * @param data
     * @param id
     * @return {Object}
     */
    parseDatasetParams(axes, data, id) {
        console.log('parseDatasetParams', {axes})
        const p = super.parseDatasetParams(axes, data)
        p.curve = axes.y.curve || 'linear'
        p.radius = data.length < 101 ? p.width : 0
        console.log('parseDatasetParams', {p})

        return p
    }

    /**
     *
     * @param params
     * @return {Object|null}
     */
    parseDatasetProperties(params) {
        const p = super.parseDatasetProperties(params)
        p.cubicInterpolationMode = params.curve === 'linear' ? 'default' : 'monotone'
        p.stepped = params.curve === 'step'
        p.tension = params.curve === 'smooth' ? 0.2 : 0
        p.pointRadius = params.radius

        return p
    }
}