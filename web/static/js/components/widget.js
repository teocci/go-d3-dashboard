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

export default class Widget extends BaseComponent {
    constructor(element) {
        super(element)
        this.modal = null

        this.initElements()
    }

    initElements() {
        const widget = document.createElement('div')
        widget.classList.add('widget-holder')

        const btn = document.createElement('button')
        btn.classList.add('add-widget')
        btn.textContent = '차트 추가'
        btn.onclick = e => this.onAddWidgetClick(e)

        widget.appendChild(btn)

        this.dom = widget
        this.holder.appendChild(widget)
    }

    onAddWidgetClick(e) {
        const modal = new Modal(this.dom)
        const content = modal.content

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

        const dsFS = new Fieldset(cs, FS_DATA_SOURCE)
        const dataSource = dsFS.content

        const xaFS = new Fieldset(dataSource, FS_X_AXIS)
        const xAxis = xaFS.content
        const xaLabel = new InputText(xAxis, IT_X_AXIS_LABEL)
        const xaUnit = new InputText(xAxis, IT_X_AXIS_UNIT)
        const xaColumn = new Select(xAxis, S_X_AXIS_COLUMN)
        const xaScaleType = new FieldsetRadio(xAxis, RF_X_AXIS_SCALE_TYPE)

        const seriesFS = new Fieldset(dataSource, FS_SERIES)
        const series = seriesFS.content
        const table = new Series(series)

        const showChecked = type => {
            file.hide()
            connect.hide()
            chartType.reset()
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
            // ds.textContent = type
        }

        showChecked(type.checked.input.id)

        chartFS.hide()
        showChartSelected(chartType.selected.value)
        dsFS.hide()

        form.cancelBtn.onclick = e => {
            e.preventDefault()
            modal.close(e)
        }

        type.fields.forEach(field => {
            field.input.onchange = e => {
                const type = e.target.id
                showChecked(type)
            }
        })

        chartType.input.onchange = e => {
            const type = e.target.value
            showChartSelected(type)
        }

        file.onload = d => {
            console.log(d.columns, `type ${typeof d.columns}`)
            chartFS.show()
            dsFS.show()
            xaColumn.addItems(...d.columns)
            table.updateColumnValues(d.columns)
        }

        // file.input.onchange = e => { console.log(`${e.target.id} -> onchange`) }
        this.modal = modal
        this.modal.show()
    }
}