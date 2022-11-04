/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */
const DEFAULT_BG_COLOR = 'rgb(24, 27, 31)'
const DEFAULT_TITLE_COLOR = 'rgb(204, 204, 220)'
const DEFAULT_TICK_COLOR = 'rgb(204, 204, 220)'
const DEFAULT_GRID_COLOR = 'rgba(204, 204, 220, 0.07)'
const DEFAULT_LEGEND_LABEL_COLOR = 'rgb(204, 204, 220)'

const DEFAULT_TICK_FONT_SIZE = 14
const DEFAULT_LEGEND_LABEL_FONT_SIZE = 14
const DEFAULT_TITLE_FONT_SIZE = 16

export default class BaseChart {
    constructor(canvas) {
        this.$canvas = canvas

        this.settings = null
        this.groupedByX = true
    }

    get tag() {
        return this.constructor.TAG
    }

    asDate = s => new Date(s).toISOString()
    asNumber = s => {
        const n = Number(s)
        return isNumeric(n) ? n : null
    }
    scaleFnc = t => t === 'time' ? this.asDate : this.asNumber

    parseLabel(axis) {
        const label = axis?.label || axis?.column || ''
        const unit = isEmptyString(axis?.unit || '') ? '' : ` (${axis.unit})`

        return `${label}${unit}`
    }

    /**
     *
     * @param xAxis
     * @param yAxis
     * @param raw
     * @return {Object}
     */
    parseDataset(xAxis, yAxis, raw) {
        return undefined
    }

    parseAxisTitle(axis) {
        const text = this.parseLabel(axis)
        const color = DEFAULT_TITLE_COLOR
        const font = {
            size: DEFAULT_TITLE_FONT_SIZE,
        }

        return {
            display: !isEmptyString(text),
            text,
            color,
            font,
        }
    }

    parseAxisScale(raw) {
        const key = raw.column ?? null
        if (isNil(key)) return null

        const scale = raw.scale || 'linear'
        const fnc = this.scaleFnc(scale)
        if (isNil(fnc)) return null

        return {
            key,
            scale,
            fnc,
        }
    }

    parseXYDataset(x, y, raw) {
        return raw.map(item => ({x: x.fnc(item[x.key]), y: y.fnc(item[y.key])}))
    }

    groupXYByX(values) {
        const mapper = new Map()

        for (const value of values) {
            if (mapper.has(value.x)) mapper.get(value.x).push(value.y)
            else mapper.set(value.x, [value.y])
        }

        const data = []
        for (const [x, a] of mapper.entries()) {
            const sum = a.reduce((sum, v) => sum + v, 0)
            const y = sum / a.length
            data.push({x, y})
        }

        return data
    }

    parseScale(axis) {
        const font = {
            size: DEFAULT_TICK_FONT_SIZE,
        }

        const grid = {
            color: DEFAULT_GRID_COLOR,
            lineWidth: 2,
        }
        const ticks = {
            color: DEFAULT_TICK_COLOR,
            font,
        }
        if (isNil(axis)) return {
            grid,
            ticks,
        }

        const title = this.parseAxisTitle(axis)
        const type = axis.scale
        const time = {
            displayFormats: {
                datetime: 'yyyy-MM-d, HH:mm:ss',
                millisecond: 'HH:mm:ss.SSS',
                second: 'HH:mm:ss',
                minute: 'HH:mm',
                hour: 'HH',
                day: 'MM월 d일',
                month: 'yyyy년 MM월',
            },
        }

        return {
            title,
            type,
            time,
            grid,
            ticks,
        }
    }

    parseScales(config) {
        const xAxis = config.source.axis.x
        const yAxis = config.source.axis.y ?? null

        const x = this.parseScale(xAxis)
        const y = this.parseScale(yAxis)

        return {x, y}
    }

    parseLegend() {
        const color = DEFAULT_LEGEND_LABEL_COLOR
        const font = {
            size: DEFAULT_LEGEND_LABEL_FONT_SIZE,
        }

        return {
            display: true,
            position: 'bottom',
            labels: {
                color,
                font,
            },
        }
    }

    parseDataSeries(x, series, data) {
        const datasets = []
        for (const raw of series) {
            const item = this.parseDataset(x, raw, data)
            datasets.push(item)
        }

        return datasets
    }

    parseData(config) {
        // const xKey = x.column
        // const data = config.data.map(item => {
        //     const o = {}
        //     for (const key of Object.keys(item)) {
        //         o[key === xKey ? 'x' : key] = item[key]
        //     }
        //     console.log({o})
        //     return o
        // })
        return undefined
    }

    parseOptions(config) {
        const scales = this.parseScales(config)
        const legend = this.parseLegend()
        return {
            responsive: true,
            scales,
            plugins: {
                legend,
            },
        }
    }

    loadPlugins() {
        const plugin = {
            id: 'custom_canvas_background_color',
            beforeDraw: chart => {
                const {ctx} = chart
                ctx.save()
                ctx.globalCompositeOperation = 'destination-over'
                ctx.fillStyle = DEFAULT_BG_COLOR
                ctx.fillRect(0, 0, chart.width, chart.height)
                ctx.restore()
            },
        }
        return [plugin]
    }

    init(config) {
        if (isNil(config)) throw new Error('InvalidParameter: null config')

        const type = config.chart.type
        const data = this.parseData(config)
        const options = this.parseOptions(config)
        const plugins = this.loadPlugins()

        this.settings = {
            type,
            data,
            options,
            plugins,
        }
    }

    render() {
        console.log({settings: this.settings})
        this.chart = new Chart(this.$canvas, this.settings)
    }

    destroy() {
        if (this.chart) this.chart.destroy()
    }
}