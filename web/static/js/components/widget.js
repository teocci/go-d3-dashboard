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
import ChartManager from '../managers/chart-manager.js'

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

        this.initElements()

        this.settingManager = new ChartSettingManager()
        this.chartManager = new ChartManager(this.content)
    }

    initElements() {
        const widget = document.createElement('div')
        widget.classList.add('widget-holder')
        widget.id = this.id

        const content = document.createElement('div')
        content.classList.add('widget-content')

        const btn = document.createElement('button')
        btn.classList.add('add-widget')
        btn.textContent = '차트 추가'
        btn.onclick = e => this.onAddWidgetClick(e)

        widget.append(content, btn)

        this.content = content

        this.dom = widget
        if (!isNull(this.holder)) this.holder.append(widget)
    }

    onAddWidgetClick(e) {
        const ctx = this

        const modal = new Modal(this.dom)
        const content = modal.content

        let data
        let columns

        const form = new BaseForm(content)
        const formContent = form.content
        const csFS = new Fieldset(formContent, FS_CHART_SETTINGS)
        const cs = csFS.content
        const dataInput = new Fieldset(cs, FS_DATA_INPUT)
        const type = new FieldsetRadio(dataInput.content, RF_DATA_INPUT_TYPE)
        const file = new InputFile(dataInput.content, IF_FILE)
        const connect = new InputText(dataInput.content, IT_CONNECTION)

        const chartFS = new Fieldset(cs, FS_CHART)
        const chart = chartFS.content
        const chartType = new Select(chart, S_CHART_TYPE)
        const chartTitle = new InputText(chart, IT_CHART_TYPE)
        chartFS.hide()

        const dsFS = new Fieldset(cs, FS_DATA_SOURCE)
        const dataSource = dsFS.content
        dsFS.hide()

        const xaFS = new Fieldset(dataSource, FS_X_AXIS)
        const xAxis = xaFS.content
        const xaLabel = new InputText(xAxis, IT_X_AXIS_LABEL)
        const xaUnit = new InputText(xAxis, IT_X_AXIS_UNIT)
        const xaColumn = new Select(xAxis, S_X_AXIS_COLUMN)
        const xaScaleType = new FieldsetRadio(xAxis, RF_X_AXIS_SCALE_TYPE)

        const sFS = new Fieldset(dataSource, FS_SERIES)
        const s = sFS.content
        const series = new Series(s)

        const showChecked = type => {
            file.hide()
            connect.hide()
            chartType.reset()
            series.destroy()
            switch (type) {
                case 'di-type-file':
                    file.show()
                    chartType.enable()
                    break
                case 'di-type-realtime':
                    connect.show()
                    chartType.disable()
                    break
            }
        }

        const showChartSelected = type => {
            switch (type) {
                case 'line':
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
            // dataSource.textContent = type
        }

        const validateForm = () => {
            if (BaseForm.STATE_DATA_SOURCE > form.state ) return {
                valid: false,
                error: new Error(`InvalidState: ${form.state}`),
            }

            const id = ctx.id
            const config = {
                uid: id,
                data: null,
                columns: null,
                input: {},
                chart: {},
                source: {
                    axis: {
                        x: {},
                        y: {},
                    },
                    series: {},
                },
            }
            console.log({type: type.checked})
            if (type.checked === 'di-type-file') {
                config.input.type = type.checked.replace('di-type-','')
                config.data = data
                config.columns = columns
                config.chart.type = chartType.selected
                config.chart.title = chartTitle.value
                config.source.axis.x.label = xaLabel.value
                config.source.axis.x.unit = xaUnit.value
                config.source.axis.x.column = xaColumn.selected
                config.source.axis.x.scale = xaScaleType.checked.replace('xa-scale-type-','')

                switch (config.chart.type) {
                    case 'line':
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
            }

            ctx.settingManager.add(id, config)
        }

        type.fields.forEach(field => {
            field.input.onchange = e => {
                const type = e.target.id
                showChecked(type)
            }
        })
        type.checked = 'di-type-file'

        chartType.input.onchange = e => {
            const type = e.target.value
            showChartSelected(type)
        }

        file.onload = d => {
            data = d
            columns = d.columns
            console.log({columns}, `type ${typeof columns}`)

            chartFS.show()
            dsFS.show()
            chartType.selected = 'line'
            xaColumn.destroy()
            xaColumn.addItems(columns)
            series.destroy()
            series.updateColumnValues(columns)
            form.state = BaseForm.STATE_DATA_SOURCE
        }

        form.cancelBtn.onclick = e => {
            e.preventDefault()
            modal.close(e)
        }

        form.submitBtn.onclick = e => {
            e.preventDefault()
            validateForm()

            form.state = BaseForm.STATE_DATA_VALID
            modal.hide()

            const config = ctx.settingManager.get(ctx.id)
            this.chartManager.loadSetting(config)

            if (form.state === BaseForm.STATE_DATA_VALID) {
                ctx.chartManager.render()
            }
        }

        form.onStateChange = value => {
            switch (value) {
                case BaseForm.STATE_DATA_SOURCE:
                    form.enableSubmitBtn()
                    break

                default:
                    form.disableSubmitBtn()
            }
        }

        // file.input.onchange = e => { console.log(`${e.target.id} -> onchange`) }
        form.state = BaseForm.STATE_DATA_INPUT
        ctx.modal = modal

        modal.show()
    }
}