/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-17
 */
export default class Dropdown {
    static MENU_TYPE_ITEM = 'item'
    static MENU_TYPE_SUBMENU = 'submenu'
    static MENU_TYPE_DIVIDER = 'divider'

    static MENU_ITEM_EDIT = 'edit'
    static MENU_ITEM_REMOVE = 'remove'

    static ITEMS = [
        {
            id: Dropdown.MENU_ITEM_EDIT,
            type: Dropdown.MENU_TYPE_ITEM,
            label: '수정',
            icon: 'fa-pen-to-square',
        },
        {
            type: Dropdown.MENU_TYPE_DIVIDER,
        },
        {
            id: Dropdown.MENU_ITEM_REMOVE,
            type: Dropdown.MENU_TYPE_ITEM,
            label: '삭제',
            icon: 'fa-trash-can',
        },
    ]

    constructor(element) {
        this.holder = element

        this.items = new Map()

        this.initMenu()
        this.addItems()
    }

    set onclick(f) {
        if (isNull(f)) throw new Error('InvalidParameter: f is null')
        if (!isFunction(f)) throw new Error('InvalidParameter: f is not a function')

        for (const item of this.items.values()) {
            item.onclick = f
        }
    }

    initMenu() {
        const $wrapper = document.createElement('div')
        $wrapper.classList.add('dropdown-holder')

        const $menu = document.createElement('ul')
        $menu.classList.add('dropdown', 'menu')

        $wrapper.appendChild($menu)

        this.menu = $menu
        this.dom = $wrapper
        this.holder.append($wrapper)
    }

    addItems() {
        for (const item of Dropdown.ITEMS) {
            switch (item.type) {
                case Dropdown.MENU_TYPE_DIVIDER:
                    this.addDivider(item)
                break
                case Dropdown.MENU_TYPE_ITEM:
                    this.addItem(item)
                    break
                default:
                    throw new Error(`InvalidType: ${item.type} not supported.`)
            }
        }
    }

    addDivider() {
        const $menu = this.menu
        const $wrapper = document.createElement('li')
        $wrapper.classList.add('divider')
        $menu.appendChild($wrapper)
    }

    addItem(item) {
        const $menu = this.menu
        const $wrapper = document.createElement('li')

        const $item = document.createElement('div')
        $item.classList.add('menu-item')
        $item.dataset.action = item.id
        $item.dataset.type = item.type

        const $itemIcon = document.createElement('div')
        $itemIcon.classList.add('item-icon')

        const $icon = document.createElement('i')
        $icon.classList.add('fa-solid', item.icon)

        const $itemText = document.createElement('div')
        $itemText.classList.add('item-text')

        $itemText.textContent = item.label

        $itemIcon.appendChild($icon)
        $item.append($itemIcon, $itemText)
        $wrapper.appendChild($item)
        $menu.appendChild($wrapper)

        this.items.set(item.id, $item)
    }

    toggle() {
        const $wrapper = this.dom
        $wrapper.classList.toggle('open')
    }
}