/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-05
 */
import BaseComponent from '../base/base-component.js'
import Modal from './modal.js'
import Fieldset from './fieldset.js'
import BaseForm from '../base/base-form.js'
import FieldsetRadio from './fieldset-radio.js'
import InputFile from './input-file.js'
import InputText from './input-text.js'
import Select from './select.js'
import Series from './series.js'
import ChartSettingManager from '../managers/chart-setting-manager.js'
import ObservableObject from '../base/observable-object.js'
import ChartPanel from './chart-panel.js'
import Dropdown from './dropdown.js'
import InputNumber from './input-number.js'
import InputColor from './input-color.js'
import FieldsetCheckbox from './fieldset-checkbox.js'
import Line from '../charts/line.js'
import Bar from '../charts/bar.js'
import Scatter from '../charts/scatter.js'
import Bubble from '../charts/bubble.js'

const FORM_STATE_INIT = BaseForm.STATE_INIT
const FORM_STATE_DATA_INPUT = BaseForm.STATE_DATA_INPUT
const FORM_STATE_DATA_SOURCE = BaseForm.STATE_DATA_SOURCE
const FORM_STATE_DATA_VALID = BaseForm.STATE_DATA_VALID

const LINE_CHART = Line.TAG
const BAR_CHART = Bar.TAG
const SCATTER_CHART = Scatter.TAG
const BUBBLE_CHART = Bubble.TAG

const FILE_MODE = 'file'
const REALTIME_MODE = 'realtime'

export default class Widget extends BaseComponent {
    static STATE_INIT = 0
    static STATE_DATA_LOADED = 1
    static STATE_DATA_RENDERED = 2

    constructor(element) {
        super(element)

        this.id = hashID()
        this.state = new ObservableObject()

        this.initWidget()

        this.state.value = Widget.STATE_INIT

        this.settingManager = new ChartSettingManager()
        this.chartPanel = new ChartPanel(this.$content)

        this.initListeners()
    }

    initWidget() {
        const $widget = document.createElement('div')
        $widget.classList.add('widget-holder')
        $widget.id = this.id

        const $content = document.createElement('div')
        $content.classList.add('widget-content', 'hidden')

        const $control = document.createElement('div')
        $control.classList.add('widget-control')

        const $btn = document.createElement('button')
        $btn.classList.add('add-widget')
        $btn.textContent = '차트 추가'

        $control.appendChild($btn)
        $widget.append($content, $control)

        this.$content = $content
        this.$control = $control
        this.$button = $btn

        this.dom = $widget
        if (!isNil(this.holder)) this.holder.append($widget)
    }

    initListeners() {
        this.$button.onclick = e => this.onAddWidgetClick(e)
        this.chartPanel.menuHandler = e => this.menuItemClick(e)
    }

    onAddWidgetClick(e) {
        this.openModal()
    }

    createConfig() {
        const id = this.id
        return {
            id,
            data: null,
            columns: null,
            input: {
                mode: FILE_MODE,
                info: null,
            },
            chart: {
                type: LINE_CHART,
                title: null,
            },
            source: {
                axis: {
                    x: null,
                    y: null,
                    r: null,
                },
                series: null,
            },
        }
    }

    initStructure() {
        this.structure = {
            options: cloner(DEFAULT_STRUCTURE_SETTINGS),
            edit: false,
            config: null,
            modal: null,
            form: null,
            input: {
                fieldset: null,
                mode: null,
                file: null,
                connect: null,
            },
            chart: {
                fieldset: null,
                type: null,
                title: null,
            },
            source: {
                fieldset: null,
                axis: {},
                datasets: {
                    fieldset: null,
                    series: null,
                },
            },
        }
    }

    initAxisIds(id, options) {
        const ID = id.toUpperCase()
        for (const key in options) {
            const option = options[key]
            switch (option.type) {
                case 'fieldset':
                    option.legend = `${ID}${option.legend}`

                    break
                case 'radios':
                case 'checkboxes':
                    option.group = `${id}-${option.group}`
                    for (const i in option.inputs) {
                        option.inputs[i].id = `${id}-${option.inputs[i].id}`
                    }

                    break
                default:
                    if (!isNil(option.id)) option.id = `${id}-${option.id}`
                    if (key === 'label') option.placeholder = `${ID}${option.placeholder}`
            }
        }

        return options
    }

    createField(options, $holder) {
        const type = options.type ?? null
        $holder = $holder ?? null

        let field = null
        switch (type) {
            case InputText.TAG:
                field = new InputText($holder, options)
                break
            case InputNumber.TAG:
                field = new InputNumber($holder, options)
                break
            case Select.TAG:
                field = new Select($holder, options)
                break
            case InputColor.TAG:
                field = new InputColor($holder, options)
                break
            case Fieldset.TAG:
                field = new Fieldset($holder, options)
                break
            case FieldsetRadio.TAG:
                field = new FieldsetRadio($holder, options)
                break
            case FieldsetCheckbox.TAG:
                field = new FieldsetCheckbox($holder, options)
                break
            default:
                throw new Error(`InvalidType: type ${type} not supported`)
        }

        return field
    }

    createDataInputSection() {
        const options = this.structure.options.input

        const $holder = this.structure.form.content
        const fieldset = new Fieldset($holder, options.fieldset)

        const $content = fieldset.content
        const mode = new FieldsetRadio($content, options.mode)
        const file = new InputFile($content, options.file)
        const connect = new InputText($content, options.connect)

        const input = this.structure.input
        input.fieldset = fieldset
        input.mode = mode
        input.file = file
        input.connect = connect
    }

    createChartSection() {
        const options = this.structure.options.chart

        const $holder = this.structure.form.content
        const fieldset = new Fieldset($holder, options.fieldset)
        fieldset.hide()

        const $chart = fieldset.content
        const type = new Select($chart, options.type)
        const title = new InputText($chart, options.title)

        const chart = this.structure.chart
        chart.fieldset = fieldset
        chart.type = type
        chart.title = title
    }

    createDataSourceSection() {
        const options = this.structure.options.source

        const $holder = this.structure.form.content
        const fieldset = new Fieldset($holder, options.fieldset)
        fieldset.hide()

        const source = this.structure.source
        source.fieldset = fieldset
    }

    createAxisSection(id, extend) {
        const base = cloner(simpleMerge(DEFAULT_AXIS, extend))
        const options = this.initAxisIds(id, base)

        const $holder = this.structure.source.fieldset.content
        const fieldset = new Fieldset($holder, options.fieldset)
        this.structure.source.axis[id] = {
            fieldset,
        }

        const axis = this.structure.source.axis[id]
        const $content = fieldset.content
        for (const key in options) {
            if (key === Fieldset.TAG) continue

            const option = options[key]
            axis[key] = this.createField(option, $content)
        }
    }

    createSeriesSection(options) {
        const $holder = this.structure.source.fieldset.content
        const fieldset = new Fieldset($holder, options.fieldset)

        const $content = fieldset.content
        const series = new Series($content, options.series)

        const datasets = this.structure.source.datasets
        datasets.fieldset = fieldset
        datasets.series = series
    }

    extendAxisSection(id, extend) {
        const options = this.initAxisIds(id, extend)
        const axis = this.structure.source.axis[id]
        const $content = axis.fieldset.content
        for (const key in options) {
            const option = options[key]
            axis[key] = this.createField(option, $content)
        }
    }

    updateMode(mode) {
        const ctx = this

        const input = ctx.structure.input
        input.file.hide()
        input.connect.hide()

        const chart = this.structure.chart
        chart.type.reset()

        const source = this.structure.source
        source.datasets.series?.destroy()

        const config = this.structure.config
        switch (mode) {
            case FILE_MODE:
                input.file.show()
                chart.type.enable()

                break
            case REALTIME_MODE:
                input.connect.show()
                chart.type.disable()

                config.chart.type = LINE_CHART

                break
        }

        config.input.mode = mode
        chart.type.value = config.chart.type
    }

    updateDSourceSection(type) {
        const ctx = this
        ctx.structure.source.fieldset.clear()

        ctx.createAxisSection('x')
        switch (type) {
            case LINE_CHART:
                const mode = ctx.structure.config.input.mode
                if (mode === FILE_MODE) ctx.createSeriesSection(LINE_SERIES)
                else ctx.createAxisSection('y', EXTEND_LINE_Y_AXIS)

                break
            case BAR_CHART:
                ctx.createAxisSection('y')
                break
            case SCATTER_CHART:
                ctx.createAxisSection('y', EXTEND_SCATTER_Y_AXIS)
                break
            case BUBBLE_CHART:
                ctx.createAxisSection('y')
                ctx.createAxisSection('r', EXTEND_BUBBLE_RADIUS)
                break
            case 'contour':
                break
        }

        ctx.updateDSourceColumns()
        ctx.updateDSourceValue()
    }

    updateDSourceColumns() {
        const ctx = this
        const columns = ctx.structure.config.columns
        if (isNil(columns)) return

        const source = ctx.structure.source
        const axes = source.axis
        for (const id in axes) {
            const column = axes[id].column
            if (isNil(column)) continue

            column.destroy()
            column.addItems(columns)
        }

        const series = source.datasets.series
        if (isNil(series)) return

        series.destroy()
        series.updateColumnValues(columns)
    }

    updateDSourceValue() {
        const ctx = this
        const source = ctx.structure.source

        const configAxes = ctx.structure.config.source.axis
        for (const id in configAxes) {
            const configAxis = configAxes[id]
            const axis = ctx.structure.source.axis[id]
            if (isNil(configAxis) || isNil(axis)) continue

            for (const key in configAxis) {
                axis[key].value = configAxis[key]
            }
        }

        const configSeries = ctx.structure.config.source.series
        if (isNil(configSeries)) return

        const series = source.datasets.series
        if (isNil(series)) return

        series.destroy()
        series.values = configSeries
    }

    processConfigAxis(id) {
        const configAxis = {}

        const axis = this.structure.source.axis[id]
        for (const key in axis) {
            if (key === 'fieldset') continue
            configAxis[key] = axis[key].value
        }

        this.structure.config.source.axis[id] = configAxis
    }

    processConfigSeries() {
        const series = this.structure.source.datasets.series
        this.structure.config.source.series = series.values
    }

    processConfig() {
        const ctx = this

        const form = ctx.structure.form
        if (FORM_STATE_DATA_SOURCE > form.state) throw new Error(`InvalidState: ${form.state}`)

        const config = this.structure.config
        const mode = this.structure.input.mode.value
        const chart = this.structure.chart

        config.input.mode = mode
        config.chart.type = chart.type.selected
        config.chart.title = chart.title.value

        ctx.processConfigAxis('x')

        switch (mode) {
            case FILE_MODE:
                switch (config.chart.type) {
                    case LINE_CHART:
                        ctx.processConfigSeries('y')

                        config.source.axis.y = null
                        config.source.axis.r = null

                        break
                    case BAR_CHART:
                        // ctx.processConfigSeries()
                        ctx.processConfigAxis('y')

                        // config.source.axis.y = null
                        config.source.axis.r = null
                        config.source.axis.series = null
                        break
                    case SCATTER_CHART:
                        ctx.processConfigAxis('y')

                        config.source.axis.r = null
                        config.source.axis.series = null
                        break
                    case BUBBLE_CHART:
                        ctx.processConfigAxis('y')
                        ctx.processConfigAxis('r')

                        config.source.axis.series = null
                        break
                    case 'contour':
                        break
                }
                break
            case REALTIME_MODE:
                break
            default:
        }

        ctx.saveConfig(config)

        form.state = FORM_STATE_DATA_VALID
    }

    loadData(d) {
        const config = this.structure.config
        config.data = d
        config.columns = d.columns
        config.input.info = d.file

        const form = this.structure.form
        form.state = FORM_STATE_DATA_SOURCE

        const chart = this.structure.chart
        chart.title.value = config.chart.title || d.file.name || null
        chart.type.value = config.chart.type
        chart.fieldset.show()

        const source = this.structure.source
        source.fieldset.show()
    }

    loadModal() {
        const ctx = this

        ctx.initStructure()

        const modal = new Modal(ctx.$control)
        const form = new BaseForm(modal.$content)

        ctx.structure.modal = modal
        ctx.structure.form = form

        ctx.createDataInputSection()
        ctx.createChartSection()
        ctx.createDataSourceSection()

        const hasConfig = ctx.hasConfig()
        ctx.structure.edit = hasConfig
        ctx.structure.config = hasConfig ? ctx.openConfig() : ctx.createConfig()

        ctx.initFormListeners()
        ctx.initDIListeners()
        ctx.initDChartListeners()

        form.state = FORM_STATE_DATA_INPUT

        ctx.loadConfigValues()

        // file.input.onchange = e => { console.log(`${e.target.id} -> onchange`) }
    }

    loadConfigValues() {
        const ctx = this
        const config = ctx.structure.config

        const input = ctx.structure.input
        input.mode.value = config.input.mode

        if (ctx.structure.edit) {
            switch (config.input.mode) {
                case FILE_MODE:
                    ctx.loadData(config.data)

                    break
                case REALTIME_MODE:
                    // TODO: add connection handler
                    console.log('Connect to device')

                    break
            }
        }

        this.state.value = Widget.STATE_DATA_LOADED
    }

    initFormListeners() {
        const ctx = this
        const form = ctx.structure.form

        form.cancelBtn.onclick = e => {
            e.preventDefault()

            ctx.deleteConfig()
            ctx.hideModal(e)
        }

        form.submitBtn.onclick = e => {
            e.preventDefault()

            ctx.processConfig()
            ctx.hideModal()

            ctx.renderChart(form.state)
        }

        form.onStateChange = value => {
            switch (value) {
                case FORM_STATE_DATA_SOURCE:
                    form.enableSubmitBtn()
                    break

                default:
                    form.disableSubmitBtn()
            }
        }
    }

    initDIListeners() {
        const ctx = this
        const input = ctx.structure.input

        const showChecked = mode => {
            ctx.updateMode(mode)
        }

        const fields = input.mode.fields
        for (const field of fields.values()) {
            field.input.onchange = e => {
                const mode = e.target.value
                showChecked(mode)
            }
        }

        input.file.onload = d => {
            ctx.loadData(d)
        }
    }

    initDChartListeners() {
        const ctx = this
        const chart = this.structure.chart

        const showChartSelected = type => {
            ctx.updateDSourceSection(type)
        }

        chart.type.input.onchange = e => {
            const type = e.target.value
            showChartSelected(type)
        }
    }

    openModal() {
        this.loadModal()
        this.showModal()
    }

    removeWidget() {
        this.clearChart()
        this.deleteConfig()
    }

    clearChart() {
        this.chartPanel.clear()

        this.hideContent()
        this.showControl()
    }

    loadChartConfig() {
        const config = this.openConfig()
        this.chartPanel.load(config)
    }

    renderChart(state) {
        this.clearChart()
        this.loadChartConfig()

        if (state === FORM_STATE_DATA_VALID) {
            this.showContent()
            this.hideControl()
            this.chartPanel.render()

            this.state.value = Widget.STATE_DATA_RENDERED
        }
    }

    menuItemClick(e) {
        const ctx = this
        const $target = e.currentTarget
        const action = $target.dataset.action
        const type = $target.dataset.type

        if (type === 'item') {
            switch (action) {
                case Dropdown.MENU_ITEM_EDIT:
                    ctx.openModal()

                    break
                case Dropdown.MENU_ITEM_REMOVE:
                    ctx.removeWidget()

                    break
                default:
                    throw new Error(`InvalidAction: ${action} not supported.`)
            }
        }
    }

    showModal() {
        this.hideContent()
        this.showControl()

        const modal = this.structure.modal
        modal.show()
    }

    hideModal(e) {
        const modal = this.structure.modal
        modal.close(e)
    }

    hideContent() {
        this.$content.classList.add('hidden')
    }

    showContent() {
        this.$content.classList.remove('hidden')
    }

    hideControl() {
        this.$control.classList.add('hidden')
    }

    showControl() {
        this.$control.classList.remove('hidden')
    }

    openConfig() {
        return this.settingManager.get(this.id)
    }

    saveConfig(config) {
        this.settingManager.add(this.id, config)
    }

    deleteConfig() {
        this.settingManager.delete(this.id)
    }

    hasConfig() {
        return this.settingManager.has(this.id)
    }
}
