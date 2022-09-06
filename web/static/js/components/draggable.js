/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-05
 */
import BaseComponent from '../base/base-component.js'

export default class Draggable extends BaseComponent {
    static TAG = 'draggable'

    constructor(element) {
        super(element)

        this.startPos = {x: 0, y: 0}
        this.endPos = {x: 0, y: 0}

        this.source = null
        this.target = null
    }

    registerDraggable(source) {
        this.startPos.x = 0
        this.startPos.y = 0
        this.endPos.x = 0
        this.endPos.y = 0

        this.source = source
        this.source.onmousedown = e => this.startDragging(e)

        this.target = this.dom
        console.log({target: this.target})
    }

    startDragging(e) {
        e.preventDefault()

        // Get the mouse cursor position at startup:
        this.endPos.x = e.clientX
        this.endPos.y = e.clientY
        // Call the drag function whenever the cursor moves:
        document.onmousemove = e => this.dragElement(e)

        // Call endDrag
        document.onmouseup = e => this.endDragging(e)
    }

    dragElement(e) {
        e.preventDefault()

        // Calculate the new cursor position:
        this.startPos.x = this.endPos.x - e.clientX
        this.startPos.y = this.endPos.y - e.clientY
        this.endPos.x = e.clientX
        this.endPos.y = e.clientY

        // Set the element's new position:
        this.target.style.top = `${this.target.offsetTop - this.startPos.y}px`
        this.target.style.left = `${this.target.offsetLeft - this.startPos.x}px`
    }

    endDragging() {
        // Stop moving when mouse button is released:
        document.onmouseup = null
        document.onmousemove = null
    }
}