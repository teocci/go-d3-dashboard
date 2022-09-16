/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-15
 */
import BaseComponent from '../base/base-component.js'

export default class Actions extends BaseComponent {
    static TAG = 'actions'

    static ACTION_REMOVE = 'remove'
    static ACTION_ADD = 'add'

    static ACTIONS = [
        {
            id: Actions.ACTION_ADD,
            label: 'Add',
            icon: 'fa-plus',
        },
        {
            id: Actions.ACTION_REMOVE,
            label: 'Remove',
            icon: 'fa-minus',
        },
    ]

    constructor(element, options) {
        super(element)

        this.options = options
        this.actions = new Map()

        this.initActions()
        this.addActions()
    }

    set onClick(f) {
        if (isNull(f)) throw new Error('InvalidParameter: f is null')
        if (!isFunction(f)) throw new Error('InvalidParameter: f is not a function')

        for (const action of this.actions.values()) {
            action.onclick = f
        }
    }

    initActions() {
        const field = document.createElement('div')
        field.classList.add('actions')

        this.dom = field
        if (!isNull(this.holder)) this.holder.append(field)
    }

    addActions() {
        for (const action of Actions.ACTIONS) {
            this.addAction(action)
        }
    }

    addAction(action) {
        const div = document.createElement('div')
        div.classList.add('action')

        const icon = document.createElement('i')
        icon.classList.add('fa-solid', action.icon)
        icon.dataset.action = action.id
        icon.dataset.hash = this.options.hash

        div.appendChild(icon)
        this.dom.appendChild(div)

        this.actions.set(action.id, icon)
    }
}