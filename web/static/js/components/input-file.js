/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-07
 */

import BaseInput from '../base/base-input.js'

export default class InputFile extends BaseInput {
    static TAG = 'file'

    static DEFAULT_OPTIONS = {
        type: InputFile.TAG,
        id: InputFile.TAG,
        label: undefined,
        text: undefined,
        name: undefined,
        required: undefined,
        accept: undefined,
        capture: undefined,
        multiple: undefined,
        mimeTypes: undefined,
        labelFirst: true,
        showLabel: true,
    }

    constructor(element, options) {
        super(element, options)

        this.initElement()
        this.initListeners()
    }

    initElement() {
        const options = this.options

        const btn = document.createElement('label')
        if (!isNull(options.id)) btn.htmlFor = options.id
        btn.classList.add(`${this.tag}-btn`)

        const span = document.createElement('span')
        if (!isNull(options.id)) span.textContent = options.text ?? 'Select File'

        btn.appendChild(span)

        const fileInfo = document.createElement('div')
        fileInfo.classList.add('file-info')

        this.dom.append(btn, fileInfo)
        this.fileInfo = fileInfo

        const input = this.input
        input.classList.add('hidden')
        input.requiered = options.requiered
        if (options.accept) input.accept = options.accept
        if (options.capture) input.capture = options.capture
        if (options.multiple) input.multiple = options.multiple
    }

    initListeners() {
        const input = this.input
        input.onchange = e => this.loadFile(e)
    }

    async loadFile(e) {
        const input = this.input
        const fileInfo = this.fileInfo
        const files = input.files

        if (files.length === 0) throw new Error('No files currently selected for load')
        const [file] = files
        if (!this.validFileType(file)) throw new Error(`File [${file.name}] is not a valid file type. Update your selection.`)

        const info = `[${file.name} | ${this.returnFileSize(file.size)}]`
        console.log({info})

        const text = await file.text()
        const raw = d3.csvParse(text)
        fileInfo.textContent = info

        const data = []
        const columns = new Map()

        for (const s of raw.columns) {
            columns.set(s, toKebabCase(s))
        }

        for (const row of raw) {
            const item = {}
            let allNull = true
            for (const s of raw.columns) {
                allNull &= isNull(row[s])
                item[columns.get(s)] = row[s]
            }
            if (!allNull) data.push(item)
        }
        data.columns = [...columns.values()]
        data.file = {
            name: file.name,
            size: file.size,
        }

        console.log({converted: data})

        this.onload(data)
    }

    async loadData(dataUrl) {
        return await d3.csv(dataUrl)
    }

    validFileType(file) {
        console.log({'file-options': this.options})
        const mimeTypes = this.options.mimeTypes
        return mimeTypes && mimeTypes.includes(file.type)
    }

    returnFileSize(n) {
        if (n < 1024) return `${n}bytes`
        else if (n > 1024 && n < 1048576) return `${(n / 1024).toFixed(1)}KB`
        else if (n > 1048576) return `${(n / 1048576).toFixed(1)}MB`
    }
}