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
        console.log({'file-options': options})

        const input = this.input
        input.requiered = options.requiered
        if (options.accept) input.accept = options.accept
        if (options.capture) input.capture = options.capture
        if (options.multiple) input.multiple = options.multiple
    }

    initListeners() {
        const input = this.input
        input.onchange = e => { this.loadFile(e) }
    }

    loadFile(e) {
        const input = this.input
        const files = input.files

        if (files.length === 0) throw new Error('No files currently selected for load')
        const file = files[0]
        if (!this.validFileType(file)) throw new Error(`File [${file.name}] is not a valid file type. Update your selection.`)
        console.log(`File: [${file.name}], file size ${this.returnFileSize(file.size)}.`)
        const reader = new FileReader()
        reader.onload = () => {
            const dataUrl = reader.result
            this.loadData(dataUrl).then(d => {
                this.onload(d)
            })
        }
        reader.readAsDataURL(file)
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