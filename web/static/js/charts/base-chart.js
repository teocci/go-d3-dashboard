/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-18
 */

import ColorUtils from '../untils/color-utils.js'
import Dropdown from '../components/dropdown.js'

const DEFAULT_BG_COLOR = 'rgb(24, 27, 31)'
const DEFAULT_TITLE_COLOR = 'rgb(204, 204, 220)'
const DEFAULT_TICK_COLOR = 'rgb(204, 204, 220)'
const DEFAULT_GRID_COLOR = 'rgba(204, 204, 220, 0.07)'
const DEFAULT_LEGEND_LABEL_COLOR = 'rgb(204, 204, 220)'

const DEFAULT_TICK_FONT_SIZE = 14
const DEFAULT_LEGEND_LABEL_FONT_SIZE = 14
const DEFAULT_TITLE_FONT_SIZE = 16

const asDate = s => new Date(s).toISOString()
const asNumber = s => Number(s)

export default class BaseChart {
    constructor(canvas) {
        this.$canvas = canvas

        this.settings = null
    }

    parseLabel(axis) {
        const label = axis?.label || axis?.column || ''
        const unit = isEmptyString(axis?.unit || '') ? '' : ` (${axis.unit})`

        return `${label}${unit}`
    }

    parseDataset(xAxis, yAxis, raw) {
        const xKey = xAxis.column
        const xScale = xAxis.scale
        const xFnc = xScale === 'time' ? asDate : asNumber

        const yKey = yAxis.column
        const yScale = yAxis.scale
        const yFnc = yScale === 'time' ? asDate : asNumber
        const yWidth = asNumber(yAxis.width) ?? 1
        const yOpacity = asNumber(yAxis.opacity) ?? 1
        const yCurve = yAxis.curve

        const label = this.parseLabel(yAxis)
        const borderColor = ColorUtils.transparentize(yAxis.color, yOpacity)
        const backgroundColor = ColorUtils.transparentize(yAxis.color, yOpacity)
        const borderWidth = yWidth
        const values = raw.map(item => ({x: xFnc(item[xKey]), y: yFnc(item[yKey])}))

        const mapper = new Map()
        values.forEach(item => {
            if (mapper.has(item.x)) mapper.get(item.x).push(item.y)
            else mapper.set(item.x, [item.y])
        })

        const data = []
        for (const [x, a] of mapper.entries()) {
            const sum = a.reduce((sum, v) => sum + v, 0)
            const y = sum / a.length
            data.push({x, y})
        }

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

    parseData(config) {
        console.log({config})
        const data = config.data
        if (isNull(data)) return null

        const x = config.source.axis?.x ?? null
        const y = config.source.axis?.y ?? null
        const series = config.source?.series ?? null
        if (isNull(x) && isNull(y) && isNull(series)) return null

        // const xKey = x.column
        // const data = config.data.map(item => {
        //     const o = {}
        //     for (const key of Object.keys(item)) {
        //         o[key === xKey ? 'x' : key] = item[key]
        //     }
        //     console.log({o})
        //     return o
        // })

        const datasets = []
        const result = {
            datasets,
        }

        if (!isNull(y)) {
            const item = this.parseDataset(x, y, data)
            datasets.push(item)

            return result
        }

        if (!isNull(series)) {
            for (const raw of series) {
                const item = this.parseDataset(x, raw, data)
                datasets.push(item)
            }
        }

        return result
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
        if (isNull(axis)) return {
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
        if (isNull(config)) throw new Error('InvalidParameter: null config')

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