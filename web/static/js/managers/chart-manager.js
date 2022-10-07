import ChartSettingManager from './chart-setting-manager.js'

/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-04
 */
export default class ChartManager {
    constructor(holder) {
        this.$holder = holder
        this.settings = null
    }

    parseTitle(label, unit) {
        label = label ?? ''
        unit = isEmptyString(unit) ? '' : ` (${unit})`

        return `${label}${unit}`
    }

    loadSetting(config) {
        console.log({config})
        const xTitle = this.parseTitle(config.source.axis.x.label, config.source.axis.x.unit)
        const yTitle = this.parseTitle(config.source.axis.y.label, config.source.axis.y.unit)

        this.settings = {
            type: config.chart.type,
            data: {},
            options: {
                scales: {
                    x: {
                        title: {
                            display: !isEmptyString(xTitle),
                            text: xTitle,
                        }
                    },
                    y: {
                        title: {
                            display: !isEmptyString(yTitle),
                            text: yTitle,
                        }
                    }
                },
                plugins: {
                    title: {
                        display: !isEmptyString(config.chart.title),
                        text: config.chart.title,
                    },
                },
            },
            plugins: [],
        }



    }

    render() {

    }
}