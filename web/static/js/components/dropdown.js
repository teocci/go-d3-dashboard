/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-17
 */
export default class Dropdown {
    static MENU_TYPE_ITEM = 'item'
    static MENU_TYPE_SUBMENU = 'submenu'
    static MENU_TYPE_SUBMENU_ITEM = 'submenu-item'
    static MENU_TYPE_DIVIDER = 'divider'

    static MENU_ITEM_EDIT = 'edit'
    static MENU_ITEM_REMOVE = 'remove'
    static MENU_ITEM_CSV = 'csv'
    static MENU_ITEM_EXPORT = 'export'
    static SUBMENU_ITEM_PNG = 'png'
    static SUBMENU_ITEM_JPEG = 'jpeg'

    static ITEMS = [
        {
            id: Dropdown.MENU_ITEM_CSV,
            type: Dropdown.MENU_TYPE_ITEM,
            label: 'csv로 수출',
            icon: 'fa-file-csv',
        },
        {
            id: Dropdown.MENU_ITEM_EXPORT,
            type: Dropdown.MENU_TYPE_SUBMENU,
            label: '이미지로 수출',
            icon: 'fa-file-image',
            items: [
                {
                    id: Dropdown.SUBMENU_ITEM_PNG,
                    type: Dropdown.MENU_TYPE_SUBMENU_ITEM,
                    label: 'png 파일',
                },
                {
                    id: Dropdown.SUBMENU_ITEM_JPEG,
                    type: Dropdown.MENU_TYPE_SUBMENU_ITEM,
                    label: 'jpeg 파일',
                },
            ],
        },
        {
            type: Dropdown.MENU_TYPE_DIVIDER,
        },
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
        if (isNil(f)) throw new Error('InvalidParameter: f is null')
        if (!isFunction(f)) throw new Error('InvalidParameter: f is not a function')

        for (const item of this.items.values()) {
            item.onclick = f
        }
    }

    initMenu() {
        const $wrapper = document.createElement('div')
        $wrapper.classList.add('dropdown-holder')

        const $menu = document.createElement('ul')
        $menu.classList.add('dropdown', 'main', 'menu')

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
                case Dropdown.MENU_TYPE_SUBMENU:
                    this.addSubmenu(item)
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

    createMenuItem(item) {
        const $wrapper = document.createElement('div')
        $wrapper.classList.add('menu-item-wrapper')
        $wrapper.dataset.type = item.type

        const $item = document.createElement('div')
        $item.classList.add('menu-item', 'item')
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

        return $wrapper
    }

    createSubmenu(items) {
        const $wrapper = document.createElement('div')
        $wrapper.classList.add('submenu-wrapper')

        const $submenu = document.createElement('ul')
        $submenu.classList.add('menu', 'submenu')

        for (const item of items) {
            this.addSubmenuItem($submenu, item)
        }

        $wrapper.appendChild($submenu)

        return $wrapper
    }

    createSubmenuItem(item) {
        const $item = document.createElement('div')
        $item.classList.add('submenu-item', 'item')
        $item.dataset.action = item.id
        $item.dataset.type = item.type

        const $itemText = document.createElement('div')
        $itemText.classList.add('item-text')
        $itemText.textContent = item.label

        $item.appendChild($itemText)

        return $item;
    }

    addItem(item) {
        const $menu = this.menu
        const $li = document.createElement('li')
        const $wrapper = this.createMenuItem(item)
        const $item = $wrapper.querySelector('.menu-item')

        $li.appendChild($wrapper)
        $menu.appendChild($li)

        this.items.set(item.id, $item)
    }

    addSubmenu(item) {
        const $menu = this.menu
        const $li = document.createElement('li')
        const $wrapper = this.createMenuItem(item)
        const $item = $wrapper.querySelector('.menu-item')

        const $itemAngle = document.createElement('div')
        $itemAngle.classList.add('item-angle')

        const $angle = document.createElement('i')
        $angle.classList.add('fa-solid', 'fa-angle-right')

        $itemAngle.appendChild($angle)
        $item.appendChild($itemAngle)

        const $submenu = this.createSubmenu(item.items)

        $wrapper.appendChild($submenu)
        $li.appendChild($wrapper)
        $menu.appendChild($li)

        this.items.set(item.id, $wrapper)
    }

    addSubmenuItem($submenu, item) {
        const $wrapper = document.createElement('li')
        const $item = this.createSubmenuItem(item)

        $wrapper.appendChild($item)
        $submenu.appendChild($wrapper)

        this.items.set(item.id, $item)
    }

    toggle() {
        const $wrapper = this.dom
        $wrapper.classList.toggle('open')
    }
}