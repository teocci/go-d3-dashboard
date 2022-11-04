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

const FORM_STATE_INIT = BaseForm.STATE_INIT
const FORM_STATE_DATA_INPUT = BaseForm.STATE_DATA_INPUT
const FORM_STATE_DATA_SOURCE = BaseForm.STATE_DATA_SOURCE
const FORM_STATE_DATA_VALID = BaseForm.STATE_DATA_VALID

export default class Widget extends BaseComponent {
    static STATE_INIT = 0
    static STATE_DATA_INPUT = 1
    static STATE_DATA_SOURCE = 2
    static STATE_DATA_VALID = 4

    constructor(element) {
        super(element)

        this.id = hashID()

        this.modal = null
        this.state = new ObservableObject()

        this.initWidget()

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
        this.loadModal(e)
    }

    createConfig() {
        const id = this.id
        return {
            id,
            data: null,
            columns: null,
            input: {
                mode: 'file',
                info: null,
            },
            chart: {
                type: 'line',
                title: null,
            },
            source: {
                axis: {
                    x: {},
                    y: null,
                },
                radius: null,
                series: null,
            },
        }
    }

    initStructure() {
        this.structure = {
            options: cloner(DEFAULT_STRUCTURE_SETTINGS),
            config: null,
            modal: null,
            form: null,
            fieldset: null,
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
                radius: null,
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

        const $holder = this.structure.fieldset.content
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

        const $holder = this.structure.fieldset.content
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

        const $holder = this.structure.fieldset.content
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

        const datasets = this.structure.source.datasets
        datasets.series?.destroy()

        const config = this.structure.config
        switch (mode) {
            case 'file':
                input.file.show()
                chart.type.enable()
                config.input.mode = mode

                break
            case 'realtime':
                input.connect.show()
                chart.type.disable()
                config.input.mode = mode

                break
        }
    }

    updateColumns() {
        const ctx = this

        const source = ctx.structure.source
        const columns = ctx.structure.config.columns

        const axis = source.axis
        for (const v of Object.values(axis)) {
            if (v?.column) {
                v.column.destroy()
                v.column.addItems(columns)
            }
        }

        const series = source.datasets.series
        if (series) {
            series.destroy()
            series.updateColumnValues(columns)
        }
    }

    updateDataSourceSection(type) {
        const ctx = this
        ctx.structure.source.fieldset.clear()

        ctx.createAxisSection('x')
        switch (type) {
            case 'line':
                ctx.createSeriesSection(LINE_SERIES)
                break
            case 'bar':
                ctx.createAxisSection('y')
                break
            case 'bubble':
                ctx.createAxisSection('y')
                ctx.createAxisSection('r', EXTEND_BUBBLE_RADIUS)
                break
            case 'scatter':
                ctx.createAxisSection('y', EXTEND_SCATTER_AXIS)
                break
            case 'contour':
                break
        }

        ctx.updateColumns()
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
        if (FORM_STATE_DATA_SOURCE > form.state) return {
            valid: false,
            error: new Error(`InvalidState: ${form.state}`),
        }

        const config = this.structure.config
        const mode = this.structure.input.mode.value
        const chart = this.structure.chart

        config.input.mode = mode
        config.chart.type = chart.type.selected
        config.chart.title = chart.title.value

        ctx.processConfigAxis('x')

        switch (mode) {
            case 'file':
                switch (config.chart.type) {
                    case 'line':
                        ctx.processConfigSeries('y')

                        config.source.axis.y = null
                        config.source.axis.radius = null

                        break
                    case 'bar':
                        // ctx.processConfigSeries()
                        ctx.processConfigAxis('y')

                        // config.source.axis.y = null
                        config.source.axis.radius = null
                        config.source.axis.series = null
                        break
                    case 'bubble':
                        ctx.processConfigAxis('y')
                        ctx.processConfigAxis('r')

                        config.source.axis.series = null
                        break
                    case 'scatter':
                        ctx.processConfigAxis('y')

                        config.source.axis.radius = null
                        config.source.axis.series = null
                        break
                    case 'contour':
                        break
                }
                break
            case 'realtime':
                break
            default:
        }

        ctx.saveConfig(config)
    }

    loadData(d) {
        const config = this.structure.config
        config.data = d
        config.columns = d.columns
        config.input.info = d.file

        const chart = this.structure.chart
        chart.fieldset.show()
        chart.title.value = config.data.file.name || null
        chart.type.selected = 'line'

        const source = this.structure.source
        source.fieldset.show()

        this.updateColumns()

        const form = this.structure.form
        form.state = FORM_STATE_DATA_SOURCE
    }

    loadModal(e) {
        const ctx = this

        const modal = new Modal(this.$control)
        const $modal = modal.$content

        const form = new BaseForm($modal)
        const $form = form.content

        ctx.initStructure()

        const options = ctx.structure.options
        const fieldset = new Fieldset($form, options.fieldset)

        ctx.structure.modal = modal
        ctx.structure.form = form
        ctx.structure.fieldset = fieldset

        ctx.createDataInputSection()
        ctx.createChartSection()
        ctx.createDataSourceSection()

        ctx.hasConfig()
        ctx.structure.config = ctx.openConfig() ?? ctx.createConfig()
        const config = ctx.structure.config
        console.log({config})

        const showChecked = mode => {
            ctx.updateMode(mode)
        }

        const showChartSelected = type => {
            ctx.updateDataSourceSection(type)
        }

        const process = () => {
            ctx.processConfig(config)
        }

        const input = this.structure.input
        const fields = input.mode.fields
        for (const field of fields.values()) {
            field.input.onchange = e => {
                const mode = e.target.value
                showChecked(mode)
            }
        }
        input.mode.checked = 'di-type-file'

        const chart = this.structure.chart
        chart.type.input.onchange = e => {
            const type = e.target.value
            showChartSelected(type)
        }

        input.file.onload = d => {
            ctx.loadData(d)
        }

        form.cancelBtn.onclick = e => {
            e.preventDefault()
            modal.close(e)
        }

        form.submitBtn.onclick = e => {
            e.preventDefault()
            process()

            form.state = FORM_STATE_DATA_VALID
            modal.close()

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

        // file.input.onchange = e => { console.log(`${e.target.id} -> onchange`) }
        form.state = FORM_STATE_DATA_INPUT
        ctx.modal = modal

        modal.show()
    }

    removeWidget() {
        this.chartPanel.clear()
        this.deleteConfig()

        this.hideContent()
        this.showControl()
    }

    renderChart(state) {
        const config = this.openConfig()
        this.chartPanel.load(config)

        if (state === FORM_STATE_DATA_VALID) {
            this.showContent()
            this.hideControl()
            this.chartPanel.render()
        }
    }

    menuItemClick(e) {
        const $target = e.currentTarget
        const action = $target.dataset.action
        const type = $target.dataset.type

        if (type === 'item') {
            switch (action) {
                case Dropdown.MENU_ITEM_EDIT:
                    console.log({action})

                    break
                case Dropdown.MENU_ITEM_REMOVE:
                    this.removeWidget()

                    break
                default:
                    throw new Error(`InvalidAction: ${action} not supported.`)
            }
        }
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
