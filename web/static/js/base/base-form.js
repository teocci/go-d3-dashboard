/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-06
 */
import BaseComponent from './base-component.js'

export default class BaseForm extends BaseComponent {
    static TAG = 'form'

    constructor(element) {
        super(element)

        this.fields = new Map()

        this.initElements()
    }

    initElements() {
        const form = document.createElement('form')
        form.classList.add('form-wrapper')

        const body = document.createElement('div')
        body.classList.add('form-body')

        const footer = document.createElement('div')
        footer.classList.add('form-btns')

        const submitBtn = document.createElement('button')
        submitBtn.textContent = '전송'

        submitBtn.onclick = e => { this.onSubmitClick(e) }

        const cancelBtn = document.createElement('button')
        cancelBtn.textContent = '취소'
        cancelBtn.onclick = e => {
            this.onCancelClick(e)
        }

        footer.append(submitBtn, cancelBtn)
        form.append(body, footer)

        this.body = body
        this.dom = form
        this.holder.appendChild(form)
    }

    createField(options) {
        let field
        switch (options.type) {
            case InputText.TAG:
                field = new InputText(this.body, options)
                break

            case KGFieldCheckbox.TAG:
                field = new KGFieldCheckbox(this.body, options)
                break

            case InputDate.TAG:
                field = new InputDate(this.body, options)
                break

            case KGTextArea.TAG:
                field = new KGTextArea(this.body, options)
                break

            case InputRadio.TAG:
                field = new InputRadio(this.body, options)
                break

            case InputRange.TAG:
                field = new InputRange(this.body, options)
                break


            default:
                throw new Error(`type ${options.type} not supported`)
        }

        this.fields.set(options.id, field)

        return field.dom
    }

    onSubmitClick(e) {
        e.preventDefault()
        console.log('submit click')
    }

    onCancelClick(e) {
        e.preventDefault()
        console.log('cancel click')
    }
}