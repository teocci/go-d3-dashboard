/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-06
 */
import BaseComponent from './base-component.js'
import InputText from '../components/input-text.js'
import FieldsetCheckbox from '../components/fieldset-checkbox.js'

export default class BaseForm extends BaseComponent {
    static TAG = 'form'

    constructor(element) {
        super(element)

        this.fields = new Map()

        this.initForm()
    }

    initForm() {
        const form = document.createElement('form')
        form.classList.add('form-wrapper')

        const content = document.createElement('div')
        content.classList.add('form-content')

        const footer = document.createElement('div')
        footer.classList.add('form-btns')

        const submitBtn = document.createElement('button')
        submitBtn.textContent = '전송'
        submitBtn.onclick = e => { this.onSubmitClick(e) }

        const cancelBtn = document.createElement('button')
        cancelBtn.textContent = '취소'
        cancelBtn.onclick = e => { this.onCancelClick(e) }

        footer.append(submitBtn, cancelBtn)
        form.append(content, footer)


        this.submitBtn = submitBtn
        this.cancelBtn = cancelBtn
        this.content = content
        this.dom = form
        if (!isNull(this.holder)) this.holder.append(form)
    }

    createField(options) {
        let field
        switch (options.type) {
            case InputText.TAG:
                field = new InputText(this.content, options)
                break

            case FieldsetCheckbox.TAG:
                field = new FieldsetCheckbox(this.content, options)
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