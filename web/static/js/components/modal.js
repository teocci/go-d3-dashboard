/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-05
 */
import Draggable from './draggable.js'

export default class Modal extends Draggable {
    constructor(element) {
        if (!element) throw 'InvalidParameter: null element'
        super(element)

        this.content = null
        this.table = null

        this.createPanel()
        this.startDragEvent(this.header)
        this.hide()
    }

    createPanel() {
        const modal = document.createElement('div')
        modal.classList.add('modal-holder')

        const section = document.createElement('section')
        section.classList.add('modal-section')

        const header = document.createElement('div')
        header.classList.add('modal-header')

        const title = document.createElement('div')
        title.classList.add('title')
        title.textContent = 'Add Widget'

        const close = document.createElement('div')
        close.classList.add('close')
        close.role = 'button'
        close.onclick = e => this.close(e)
        close.isCloseBtn = true

        const icon = document.createElement('i')
        icon.classList.add('fa', 'fa-times')
        icon.ariaHidden = 'true'

        const content = document.createElement('div')
        content.classList.add('modal-content')

        // const trigger = document.createElement('div')
        // trigger.classList.add('outside-trigger')
        // trigger.onclick = e => this.close(e)

        this.header = header
        this.content = content

        close.appendChild(icon)
        header.append(title, close)

        section.append(header, content)
        modal.appendChild(section)

        this.dom = modal
        this.holder.appendChild(modal)
    }

    close(e) {
        console.log({target: e.target, current: e.currentTarget})
        e.preventDefault()
        e.stopPropagation()
        if (e.target === e.currentTarget || e.target.parentNode.isCloseBtn) this.hide()
    }

    reset() {
        this.hide()
        this.destroyChildren(this.content)
    }

    show() {
        super.show()
    }
}