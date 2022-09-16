/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-8월-22
 */
import BaseListener from './base-listener.js'

export default class BaseComponent extends BaseListener {
    static CHAR_UNDERSCORE = '_'
    static CHAR_HYPHEN = '-'

    static EMPTY_VALUE = BaseComponent.CHAR_HYPHEN

    static replaceUnderscoreToHyphen(tag) {
        return tag.replaceAll(BaseComponent.CHAR_UNDERSCORE, BaseComponent.CHAR_HYPHEN)
    }

    static replaceHyphenToUnderscore(tag) {
        return tag.replaceAll(BaseComponent.CHAR_HYPHEN, BaseComponent.CHAR_UNDERSCORE)
    }

    constructor(element) {
        super()

        this.holder = element ?? null
    }

    get holder() {
        return this.placeholder
    }

    set holder(element) {
        this.placeholder = element
    }

    get dom() {
        return this.element
    }

    set dom(element) {
        this.element = element
    }

    get tag () {
        return this.constructor.TAG
    }

    toggle(val) {
        const element = this.dom
        element.classList.toggle('hidden', val)
    }

    show() {
        const element = this.dom
        element.classList.remove('hidden')
    }

    hide() {
        const element = this.dom
        element.classList.add('hidden')
    }

    destroyChildren(element) {
        element = element ?? this.dom
        while (element.firstChild) {
            const lastChild = element.lastChild ?? false
            if (lastChild) element.removeChild(lastChild)
        }
    }
}