/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-05
 */
import BaseComponent from '../base/base-component.js'
import Modal from './modal.js'

export default class Widget extends BaseComponent {
    constructor(element) {
        super(element)

        this.initElements()
    }

    initElements() {
        const widget = document.createElement('section')
        widget.classList.add('widget-holder')

        const btn = document.createElement('button')
        btn.classList.add('add-widget')
        btn.textContent = '차트 추가'
        btn.onclick = e => { this.onAddWidgetClick(e) }

        widget.appendChild(btn)

        this.modal = new Modal(widget)

        this.dom = widget
        this.holder.appendChild(widget)
    }

    onAddWidgetClick(e) {
        console.log('add')
        this.modal.show()
    }
}