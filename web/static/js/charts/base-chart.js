import ColorUtils from '../untils/color-utils.js'

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

        this.config = null
        this.binders = []

        this.groupedByX = true
        this.mode = null
        this.scales = null
    }

    get tag() {
        return this.constructor.TAG
    }

    get axisKeys() {
        return ['x', 'y']
    }

    init(config) {
        if (isNil(config)) throw new Error('InvalidParameter: null config')

        const type = config.chart.type
        const data = this.parseMainData(config)
        const options = this.parseOptions(config)
        const plugins = this.loadPlugins()

        this.config = {
            type,
            data,
            options,
            plugins,
        }
    }

    parseMainData(config) {
        console.log({config})
        this.mode = config.input.mode || INPUT_MODE_FILE

        const datasets = this.parseDatasets(config)
        return {datasets}
    }

    parseOptions(config) {
        const scales = this.parseScales(config)
        const hover = {
            mode: 'index',
            intersect: false,
        }
        const legend = this.loadLegend()
        const plugins = {
            legend,
        }

        return {
            responsive: true,
            maintainAspectRatio: false,
            scales,
            hover,
            plugins,
        }
    }

    loadLegend() {
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

    loadPlugins() {
        const bg = {
            id: 'custom_canvas_bg_color',
            beforeDraw: chart => {
                const {ctx} = chart
                ctx.save()
                ctx.globalCompositeOperation = 'destination-over'
                ctx.fillStyle = DEFAULT_BG_COLOR
                ctx.fillRect(0, 0, chart.width, chart.height)
                ctx.restore()
            },
        }
        const corsair = {
            id: 'corsair',
            defaults: {
                width: 1,
                color: '#f0f0f0',
                dash: [3, 3],
            },
            afterInit: chart => {
                chart.corsair = {
                    x: 0,
                    y: 0,
                }
            },
            afterEvent: (chart, args) => {
                const {inChartArea} = args
                const {x, y} = args.event

                chart.corsair = {x, y, draw: inChartArea}
                chart.draw()
            },
            afterDraw: (chart, args, opts) => {
                const {ctx} = chart
                const {top, bottom, left, right} = chart.chartArea
                const {x, y, draw} = chart.corsair
                if (!draw) return

                ctx.save()

                ctx.beginPath()
                ctx.lineWidth = opts.width
                ctx.strokeStyle = opts.color
                ctx.setLineDash(opts.dash)
                ctx.moveTo(x, bottom)
                ctx.lineTo(x, top)
                ctx.moveTo(left, y)
                ctx.lineTo(right, y)
                ctx.stroke()

                ctx.restore()
            },
        }
        return [bg, corsair]
    }

    /**
     *
     * @param config
     * @return {Object|null}
     */
    parseDatasets(config) {
        const axes = this.parseAxisConfig(config.source.axis)
        if (isNil(axes.x) || isNil(axes.y)) return null

        const {data} = config
        return [this.parseDataset(axes, data)]
    }

    parseDataSeries(x, series, data) {
        const datasets = []
        for (const y of series) {
            const axes = {x, y}
            const item = this.parseDataset(axes, data)
            console.log('parseDataSeries', {item})
            datasets.push(item)
        }

        return datasets
    }

    parseDataset(axes, raw) {
        console.log('parseDataset', {axes})
        const data = this.parseDatasetData(axes, raw)
        const params = this.parseDatasetParams(axes, data)
        const properties = this.parseDatasetProperties(params)
        console.log('parseDataset', {properties})

        return {data, ...properties}
    }

    /**
     *
     * @param axes
     * @param raw
     * @return {Object}
     */
    parseDatasetData(axes, raw) {
        const scales = this.parseAxesScales(axes)
        if (isNil(scales)) return null
        console.log('parseDatasetData', {scales})

        this.loadBlinder(axes)

        if (this.isFileMode() && isNil(raw)) return null
        if (this.isRTMode()) return null

        const values = this.parseAxesData(scales, raw)
        console.log('parseDatasetData', {values})

        return this.groupedByX ? this.groupByX(values) : values
    }

    /**
     *
     * @param axes
     * @param data
     * @param id
     * @return {Object}
     */
    parseDatasetParams(axes, data, id) {
        const axis = axes[id || 'y']
        const label = this.parseLabel(axis)
        const width = this.asNumber(axis.width) || 1
        const opacity = this.asNumber(axis.opacity) || 1
        const bgOpacity = opacity

        const color = axis.color || '#2f7878'
        const bg = axis.background || '#4bc0c0'

        return {
            label,
            width,
            opacity,
            bgOpacity,
            color,
            bg,
        }
    }

    /**
     *
     * @param params
     * @return {Object|null}
     */
    parseDatasetProperties(params) {
        console.log('parseDatasetProperties', {params})

        const label = params.label
        const borderWidth = params.width
        const borderColor = ColorUtils.transparentize(params.color, params.opacity)
        const backgroundColor = ColorUtils.transparentize(params.bg, params.bgOpacity)

        return {
            label,
            borderWidth,
            borderColor,
            backgroundColor,
        }
    }

    parseAxisConfig(axes) {
        const config = {}
        const keys = this.axisKeys
        for (const key of keys) {
            config[key] = axes[key] ?? null
        }
        return config
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

    parseLabel(axis) {
        const label = axis?.label || axis?.column || ''
        const unit = isEmptyString(axis?.unit || '') ? '' : ` (${axis.unit})`

        return `${label}${unit}`
    }

    parseAxesScales(axes) {
        if (isNil(axes)) return new Error('null axes')

        const scales = {}
        for (const key in axes) {
            const scale = this.parseAxisScale(axes[key])
            if (isNil(scale)) throw new Error(`${key} is null`)

            scales[key] = scale
        }

        return scales
    }

    parseAxisScale(raw) {
        console.log('parseAxisScale', {raw})
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

    parseScales(config) {
        const xAxis = config.source.axis.x
        const yAxis = config.source.axis.y ?? null

        const x = this.parseScale(xAxis)
        const y = this.parseScale(yAxis)

        return {x, y}
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
                millisecond: 'mm:ss.SSS',
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

    parseAxesData(axes, data) {
        return data.map(item => {
            const row = {}
            for (const key in axes) {
                const axis = axes[key]
                row[key] = axis.fnc(item[axis.key])
            }
            return row
        })
    }

    groupByX(values) {
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

    loadBlinder(axes) {
        const b = {}
        for (const key in axes) {
            const axis = axes[key]
            b[key] = axis.column
        }
        this.binders.push(b)
    }

    render() {
        console.log({settings: this.config})
        this.chart = new Chart(this.$canvas, this.config)
    }

    resize() {
        if (this.chart) this.chart.resize()
    }

    addData(data) {
        const {x} = this.binders[0]
        if (this.chart) {
            this.chart.data.labels.push(data[x])
            this.chart.data.datasets.forEach((dataset, i) => {
                const {y} = this.binders[i]
                dataset.data.push(data[y])
            })
            this.chart.update()
        }
    }

    destroy() {
        if (this.chart) this.chart.destroy()
    }

    asDate = s => new Date(s).toISOString()
    asNumber = s => {
        const n = Number(s)
        return isNumeric(n) ? n : null
    }

    scaleFnc = type => {
        switch (type) {
            case SCALE_TYPE_LINEAR:
            case SCALE_TYPE_LOGARITHMIC:
                return this.asNumber

            case SCALE_TYPE_TIME:
            case SCALE_TYPE_TIMESERIES:
                return this.asDate

            case SCALE_TYPE_CATEGORICAL:
                return String

            default:
                throw new Error(`InvalidAction: ${type} file not supported.`)
        }
    }

    isRTMode() {
        return this.mode === INPUT_MODE_RT
    }

    isFileMode() {
        return this.mode === INPUT_MODE_FILE
    }
}