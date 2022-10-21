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

    openConfig() {
        return this.settingManager.get(this.id)
    }

    saveConfig(config) {
        this.settingManager.add(this.id, config)
    }

    deleteConfig() {
        this.settingManager.delete(this.id)
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
        if (!isNull(this.holder)) this.holder.append($widget)
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

    initAxis(id) {
        const options = cloner(DEFAULT_AXIS)
        options.label.id = `${id}-${options.label.id}`
        options.unit.id = `${id}-${options.unit.id}`
        options.column.id = `${id}-${options.column.id}`
        options.scale.group = `${id}-${options.scale.group}`

        for (const i in options.scale.inputs) {
            options.scale.inputs[i].id = `${id}-${options.scale.inputs[i].id}`
        }

        const ID = id.toUpperCase()
        options.fieldset.legend = `${ID}${options.fieldset.legend}`
        options.label.placeholder = `${ID}${options.label.placeholder}`

        return options
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
        const options = this.structure.options.chart

        const $holder = this.structure.fieldset.content
        const fieldset = new Fieldset($holder, options.fieldset)
        fieldset.hide()

        const source = this.structure.source
        source.fieldset = fieldset
    }

    createAxisSection(id) {
        const options = this.initAxis(id)
        console.log({options})

        const $holder = this.structure.source.fieldset.content
        const fieldset = new Fieldset($holder, options.fieldset)

        const $content = fieldset.content
        const label = new InputText($content, options.label)
        const unit = new InputText($content, options.unit)
        const column = new Select($content, options.column)
        const scale = new FieldsetRadio($content, options.scale)

        this.structure.source.axis[id] = {
            fieldset,
            label,
            unit,
            column,
            scale,
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

    updateColumns() {
        const config = this.structure.config
        const columns = config.columns

        const source = this.structure.source
        const axis = source.axis

        for (const v of Object.values(axis)) {
            v.column.destroy()
            v.column.addItems(columns)
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

        switch (type) {
            case 'line':
                ctx.createAxisSection('x')
                ctx.createSeriesSection(LINE_SERIES)
                break
            case 'bar':
                ctx.createAxisSection('x')
                ctx.createAxisSection('y')
                break
            case 'bubble':
                break
            case 'scatter':
                break
            case 'contour':
                break
        }

        ctx.updateColumns()
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
        ctx.initStructure()
        ctx.structure.config = ctx.openConfig() ?? ctx.createConfig()
        const config = ctx.structure.config
        console.log({config})

        const modal = new Modal(this.$control)
        const $modal = modal.$content

        const form = new BaseForm($modal)
        const $form = form.content

        const options = ctx.structure.options
        const fieldset = new Fieldset($form, options.fieldset)

        ctx.structure.modal = modal
        ctx.structure.form = form
        ctx.structure.fieldset = fieldset

        ctx.createDataInputSection()
        ctx.createChartSection()
        ctx.createDataSourceSection()

        const showChecked = mode => {
            const input = ctx.structure.input
            input.file.hide()
            input.connect.hide()

            const chart = this.structure.chart
            chart.type.reset()

            const datasets = this.structure.source.datasets
            datasets.series?.destroy()

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

        const showChartSelected = type => {
            ctx.updateDataSourceSection(type)
        }

        const validateForm = () => {
            if (FORM_STATE_DATA_SOURCE > form.state) return {
                valid: false,
                error: new Error(`InvalidState: ${form.state}`),
            }

            const mode = this.structure.input.mode.value
            config.input.mode = mode
            config.chart.type = chart.type.selected
            config.chart.title = chart.title.value

            switch (mode) {
                case 'file':
                    const chart = this.structure.chart
                    const x = this.structure.source.axis.x
                    config.source.axis.x.label = x.label.value
                    config.source.axis.x.unit = x.unit.value
                    config.source.axis.x.column = x.column.value
                    config.source.axis.x.scale = x.scale.value

                    switch (config.chart.type) {
                        case 'line':
                            const series = this.structure.source.datasets.series
                            config.source.axis.y = null
                            config.source.series = series.values
                            break
                        case 'bar':
                            break
                        case 'bubble':
                            break
                        case 'scatter':
                            break
                        case 'contour':
                            break
                    }
                    break
                case 'realtime':
                    break
                default:
            }

            ctx.settingManager.add(this.id, config)
        }

        const input = this.structure.input
        input.mode.fields.forEach(field => {
            field.input.onchange = e => {
                const mode = e.target.value
                showChecked(mode)
            }
        })
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
            validateForm()

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
}
