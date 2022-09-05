/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-05
 */
import BaseComponent from '../base/base-component.js'

export default class Draggable extends BaseComponent {
    static TAG = 'draggable'

    constructor(element) {
        if (!element) throw 'InvalidParameter: null element'
        super(element)

        this.startPos = {x: 0, y: 0}
        this.endPos = {x: 0, y: 0}

        this.source = null
        this.target = null
    }

    startDragEvent(source) {
        this.startPos.x = 0
        this.startPos.y = 0
        this.endPos.x = 0
        this.endPos.y = 0

        this.source = source
        this.source.onmousedown = e => this.dragMouseDown(e)

        this.target = this.holder
        console.log({target: this.target})
    }

    dragMouseDown(e) {
        e.preventDefault()

        console.log({dragMouseDown: e})

        // Get the mouse cursor position at startup:
        this.endPos.x = e.clientX
        this.endPos.y = e.clientY

        document.onmouseup = e => this.endDragEvent(e)
        // call a function whenever the cursor moves:
        document.onmousemove = e => this.dragElement(e)
    }

    dragElement(e) {
        e.preventDefault()

        console.log({dragElement: e})

        // Calculate the new cursor position:
        this.startPos.x = this.endPos.x - e.clientX
        this.startPos.y = this.endPos.y - e.clientY
        this.endPos.x = e.clientX
        this.endPos.y = e.clientY

        // Set the element's new position:
        this.target.style.top = this.target.offsetTop - this.startPos.y + 'px'
        this.target.style.left = this.target.offsetLeft - this.startPos.x + 'px'
    }

    endDragEvent() {
        // Stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
    }
}