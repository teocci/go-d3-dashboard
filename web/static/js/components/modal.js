/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-05
 */
import Draggable from './draggable.js'

export default class Modal extends Draggable {
    static TAG = 'modal'

    constructor(element) {
        super(element)

        this.$header = null
        this.$content = null
        this.outsideTrigger = false

        this.createPanel()
        this.registerDraggable(this.$header)
        this.hide()
    }

    createPanel() {
        const $modal = document.createElement('div')
        $modal.classList.add('modal-wrapper')

        const $section = document.createElement('section')
        $section.classList.add('modal-section')

        const $header = document.createElement('div')
        $header.classList.add('modal-header')

        const $title = document.createElement('div')
        $title.classList.add('title')
        $title.textContent = 'Add Widget'

        const $close = document.createElement('div')
        $close.classList.add('close')
        $close.role = 'button'
        $close.onclick = e => this.close(e)
        $close.isCloseBtn = true

        const $icon = document.createElement('i')
        $icon.classList.add('fa', 'fa-times')
        $icon.ariaHidden = 'true'

        const $content = document.createElement('div')
        $content.classList.add('modal-content')

        const $trigger = document.createElement('div')
        $trigger.classList.add('modal-outside')
        $trigger.onclick = e => {
            if (this.outsideTrigger) this.close(e)
        }

        this.$header = $header
        this.$content = $content

        $close.appendChild($icon)
        $header.append($title, $close)

        $section.append($header, $content)
        $modal.appendChild($section)
        this.dom = $modal
        if (!isNull(this.holder)) this.holder.append($modal, $trigger)
    }

    close(e) {
        if (!e) this.reset()
        else if (e.target === e.currentTarget || e.target.parentNode.isCloseBtn) {
            console.log({target: e.target, current: e.currentTarget})
            e.preventDefault()
            e.stopPropagation()
            this.reset()
        }
    }

    reset() {
        this.hide()

        const content = this.holder.querySelector('.modal-wrapper')
        const trigger = this.holder.querySelector('.modal-outside')
        content.remove()
        trigger.remove()

        this.$header = null
        this.$content = null
    }
}