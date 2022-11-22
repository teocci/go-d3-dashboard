/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */
import Line from './line.js'

export default class Scatter extends Line {
    static TAG = 'scatter'

    /**
     *
     * @param axes
     * @param data
     * @param id
     * @return {Object}
     */
    parseDatasetParams(axes, data, id){
        const p = super.parseDatasetParams(axes, data)
        p.bgOpacity = 0.1
        p.radius = this.asNumber(axes.y.radius) || 2

        return p
    }
}