/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-15
 */
import BaseComponent from '../base/base-component.js'
import InputText from './input-text.js'
import InputNumber from './input-number.js'
import Select from './select.js'
import InputColor from './input-color.js'
import Actions from './actions.js'

export default class Series extends BaseComponent {
    static TAG = 'series'

    static DEFAULT_ATTRIBUTES = [
        {
            id: 'label',
            label: 'Label',
            type: 'text',
            options: {},
        },
        {
            id: 'unit',
            label: 'Unit',
            type: 'text',
            options: {
                maxLength: 5,
                size: 5,
            },
        },
        {
            id: 'column',
            label: 'Column',
            type: 'select',
            options: {},
        },
        {
            id: 'scale',
            label: 'Scale Type',
            type: 'select',
            options: {
                items: [
                    {
                        label: 'Linear',
                        value: 'linear',
                        selected: true,
                    },
                    {
                        label: 'Time',
                        value: 'time',
                    },
                    {
                        label: 'Log',
                        value: 'log',
                    },
                ],
            },
        },
        {
            id: 'curve',
            label: 'Curve Type',
            type: 'select',
            options: {
                items: [
                    {
                        label: 'Linear',
                        value: 'linear',
                        selected: true,
                    },
                    {
                        label: 'Smooth',
                        value: 'smooth',
                    },
                    {
                        label: 'Step',
                        value: 'step',
                    },
                ],
            },
        },
        {
            id: 'width',
            label: 'Line Width',
            type: 'number',
            options: {
                value: 1,
                step: .5,
                min: '0',
                max: 10,
                size: 3,
            },
        },
        {
            id: 'opacity',
            label: 'Opacity',
            type: 'number',
            options: {
                value: 1,
                step: .1,
                min: '0',
                max: 1,
                size: 2,
            },
        },
        {
            id: 'color',
            label: 'Color',
            type: 'color',
            options: {},
        },
        {
            id: 'actions',
            label: 'Actions',
            type: 'actions',
            options: {},
        },
    ]

    constructor(element) {
        super(element)

        this.series = new Map()
        this.attributes = new Map()

        this.initAttributes()
        this.initField()
        this.createEmptyTable()
    }

    initAttributes() {
        const attributes = cloner(Series.DEFAULT_ATTRIBUTES)
        for (const attribute of attributes) {
            this.attributes.set(attribute.id, attribute)
        }
    }

    initField() {
        const field = document.createElement('div')
        field.classList.add('series')

        this.dom = field
        if (!isNull(this.holder)) this.holder.append(field)
    }

    createEmptyTable() {
        const attributes = this.attributes.values()
        const table = document.createElement('table')
        table.classList.add('series-table')

        const thead = document.createElement('thead')
        thead.classList.add('series-thead')

        const tr = document.createElement('tr')
        for (const attribute of attributes) {
            const th = document.createElement('th')
            th.textContent = attribute.label

            tr.appendChild(th)
        }

        const tbody = document.createElement('tbody')
        tbody.classList.add('series-tbody')

        thead.appendChild(tr)
        table.append(thead, tbody)

        this.table = tbody
        this.dom.appendChild(table)
    }

    createField(hash, attribute) {
        const type = attribute.type ?? null
        let field = null
        const options = merger(true, {
            type: type,
            id: `${attribute.id}-${hash}`,
            showLabel: false,
        }, attribute.options)
        switch (type) {
            case 'text':
                field = new InputText(null, options)
                break
            case 'number':
                field = new InputNumber(null, options)
                break
            case 'select':
                field = new Select(null, options)
                break
            case 'color':
                field = new InputColor(null, options)
                break
            case 'actions':
                options.hash = hash
                field = new Actions(null, options)
                field.onClick = e => { this.onActionClicked(e) }
                break
            default:
                throw new Error(`InvalidType: type ${type} not supported`)
        }

        return field
    }

    addEmptyRow() {
        if (this.series.size === 10) return

        const row = {}
        const event = Date.now()
        const hash = hash53(event.toString())
        row.id = hash
        const tr = document.createElement('tr')
        tr.id = hash
        tr.dataset.index = hash
        for (const attribute of this.attributes.values()) {
            const td = document.createElement('td')
            const field = this.createField(hash, attribute)
            field && td.appendChild(field.dom)

            tr.appendChild(td)
            row[attribute.type] = field
        }
        this.series.set(hash, row)

        this.table.appendChild(tr)
    }

    removeRow(hash) {
        if (this.series.size === 1) return
        const tr = document.getElementById(hash)
        tr.remove()
        this.series.delete(hash)
    }

    onActionClicked(e) {
        const action = e.target.dataset.action
        switch (action) {
            case 'add':
                this.addEmptyRow()
                break
            case 'remove':
                const hash = e.target.dataset.hash
                this.removeRow(hash)
                break
            default:
                throw new Error(`InvalidType: type ${action} not supported`)
        }
        console.log(`${e.target.dataset.action} -> onchange`)
    }

    updateColumnValues(values) {
        const column = this.attributes.get('column')
        column.options.items = []
        for (const [i, v] of values.entries()) {
            const item = {
                value: toKebabCase(v),
                label: toPascalCase(v),
                selected: i === 0 ?? undefined,
            }
            column.options.items.push(item)
        }

        this.addEmptyRow()
    }

    reset() {
        this.series = new Map()
        this.destroyChildren(this.table)
        this.createEmptyTable()
    }
}