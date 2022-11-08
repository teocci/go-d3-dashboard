import Dropdown from './dropdown.js'
import Line from '../charts/line.js'
import Bar from '../charts/bar.js'
import Scatter from '../charts/scatter.js'
import Bubble from '../charts/bubble.js'

/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-10월-04
 */
export default class ChartPanel {
    constructor(element) {
        this.holder = element

        this.menuHandler = null
        this.initPanel()
        this.initListeners()
    }

    set title(title) {
        const $title = this.$header.querySelector('h2')
        $title.textContent = title
    }

    initPanel() {
        const $panel = document.createElement('div')
        $panel.classList.add('panel-holder')

        const $header = document.createElement('div')
        $header.classList.add('panel-header')

        const $title = document.createElement('h2')

        const $headerMenu = document.createElement('div')
        $headerMenu.classList.add('header-menu')

        const $menuToggle = document.createElement('div')
        $menuToggle.classList.add('header-menu-item', 'toggle')

        const $icon = document.createElement('i')
        $icon.classList.add('fa-solid', 'fa-caret-down')

        const $menuContent = document.createElement('div')
        $menuContent.classList.add('header-menu-item', 'content')

        const $content = document.createElement('div')
        $content.classList.add('panel-content')

        const $canvas = document.createElement('canvas')

        $menuToggle.append($icon)
        $headerMenu.append($menuToggle, $menuContent)
        $header.append($title, $headerMenu)
        $content.appendChild($canvas)

        $panel.append($header, $content)

        this.menu = new Dropdown($menuContent)

        this.$header = $header
        this.$canvas = $canvas
        this.dom = $panel
        this.holder.appendChild($panel)
    }

    initListeners() {
        const $header = this.$header
        $header.onclick = e => this.toggleMenu(e)

        const menu = this.menu
        menu.onclick = e => this.menuHandler(e)
    }

    load(config) {
        if (isNil(config)) throw new Error('InvalidParameter: null config')

        this.title = toPascalCase(config.chart.title)

        const type = config.chart.type
        this.chart = this.createChart(type)
        this.chart.init(config)
    }

    /**
     *
     * @param type
     * @returns {Line|Scatter|Bar|Bubble}
     */
    createChart(type) {
        const $canvas = this.$canvas
        switch (type) {
            case Line.TAG:
                return new Line($canvas)
            case Scatter.TAG:
                return new Scatter($canvas)
            case Bar.TAG:
                return new Bar($canvas)
            case Bubble.TAG:
                return new Bubble($canvas)
            default:
                throw new Error(`InvalidType: ${type} not supported.`)
        }
    }

    render() {
        if (this.chart) {
            this.chart.render()
            this.chart.resize()
        }
    }

    toggleMenu() {
        this.menu.toggle()
    }

    clear() {
        if (this.chart) this.chart.destroy()
    }
}