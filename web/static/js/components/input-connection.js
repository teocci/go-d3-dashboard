/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-9월-07
 */
import BaseComponent from '../base/base-component.js'
import InputBuilder from './input-builder.js'

const BTN_STATUS_CONNECT = 'connect'
const BTN_STATUS_CONNECTED = 'connected'
const BTN_STATUS_CONNECTING = 'connecting'
const BTN_STATUS_DISCONNECT = 'disconnect'
const BTN_STATUS_DISCONNECTING = 'disconnecting'
const BTN_STATUS_DISCONNECTED = 'disconnected'

const BTN_STATUSES = {
    [BTN_STATUS_CONNECT]: '연결',
    [BTN_STATUS_CONNECTING]: '연결 중',
    [BTN_STATUS_CONNECTED]: '연결 완료',
    [BTN_STATUS_DISCONNECT]: '연결 해제',
    [BTN_STATUS_DISCONNECTING]: '연결 해제 중',
    [BTN_STATUS_DISCONNECTED]: '연결해제 완료',
}

const FIELD_IP = 'ip'
const FIELD_PORT = 'port'
const FIELD_IOT_ID = 'iot-id'

const FIELDS = {
    [FIELD_IP]: {
        type: 'text',
        id: `dic-${FIELD_IP}`,
        classes: ['iot-ip'],
        label: 'IP',
        value: 'localhost',
        minLength: 7,
        maxLength: 15,
        required: true,
    },
    [FIELD_PORT]: {
        type: 'text',
        id: `dic-${FIELD_PORT}`,
        classes: ['iot-port'],
        label: '포트',
        value: 17040,
        minLength: 4,
        maxLength: 5,
        required: true,
    },
    [FIELD_IOT_ID]: {
        type: 'text',
        id: `dic-${FIELD_IOT_ID}`,
        classes: ['iot-id'],
        label: 'IOT ID',
        value: 10,
        minLength: 7,
        maxLength: 15,
        required: true,
    },
}

export default class InputConnection extends BaseComponent {
    static TAG = 'connection'

    static STATUS_CONNECT = BTN_STATUS_CONNECT
    static STATUS_CONNECTED = BTN_STATUS_CONNECTED
    static STATUS_CONNECTING = BTN_STATUS_CONNECTING
    static STATUS_DISCONNECT = BTN_STATUS_DISCONNECT
    static STATUS_DISCONNECTING = BTN_STATUS_DISCONNECTING
    static STATUS_DISCONNECTED = BTN_STATUS_DISCONNECTED

    constructor(element, options) {
        super(element)

        this.$button = null
        this.fields = new Map()

        this.onClick = () => {}

        this.initField(options)
        this.initBtnListener()
    }

    get iotHost() {
        return this.fields.get(FIELD_IP).value
    }

    get iotPort() {
        return this.fields.get(FIELD_PORT).value
    }

    get iotId() {
        return this.fields.get(FIELD_IOT_ID).value
    }

    set buttonStatus(status) {
        const $btn = this.$button
        switch (status) {
            case BTN_STATUS_CONNECTED:
            case BTN_STATUS_CONNECTING:
            case BTN_STATUS_DISCONNECTING:
            case BTN_STATUS_DISCONNECTED:
                this.disableAll()
                break
            case BTN_STATUS_CONNECT:
                this.enableAll()
                break
            case BTN_STATUS_DISCONNECT:
                this.disableAddress()
                this.enableBtn()
                break
            default:
                throw new Error(`InvalidType: type ${status} not supported`)
        }
        $btn.dataset.status = status
        $btn.textContent = BTN_STATUSES[status]
    }

    initField(options) {
        const $field = document.createElement('div')
        $field.classList.add('connection')

        const $address = document.createElement('div')
        $address.id = options.id || 'dic'
        $address.classList.add('item', 'address')

        for (const key in FIELDS) {
            const options = FIELDS[key]
            const field = InputBuilder.createField(options)
            this.fields.set(key, field)
            $address.appendChild(field.dom)
        }

        const $wrapper = document.createElement('div')
        $wrapper.classList.add('item', 'connect')

        const $btn = document.createElement('button')
        $btn.classList.add('connect-btn')
        $btn.dataset.status = BTN_STATUS_CONNECT
        $btn.textContent = BTN_STATUSES[BTN_STATUS_CONNECT]

        this.$address = $address
        this.$button = $btn

        $wrapper.appendChild($btn)
        $field.append($address, $wrapper)

        this.dom = $field
        if (!isNil(this.holder)) this.holder.appendChild($field)
    }

    initBtnListener() {
        const $btn = this.$button
        $btn.onclick = e => this.handleOnClick(e)

    }

    handleOnClick(e) {
        e.preventDefault()
        const status = e.target.dataset.status
        const req = {action: status}
        switch (status) {
            case BTN_STATUS_CONNECT:
                this.buttonStatus = BTN_STATUS_CONNECTING
                req['address'] = `ws://${this.iotHost}:${this.iotPort}`
                req['iotId'] = this.iotId
                this.onClick(req)
                break
            case BTN_STATUS_DISCONNECT:
                this.buttonStatus = BTN_STATUS_CONNECTING
                this.onClick(req)
                break
            default:
                throw new Error(`InvalidType: type ${status} not supported`)
        }
        console.log(`${e.target.dataset.status} -> onchange`)
    }

    enableAll() {
        this.enableAddress()
        this.enableBtn()
    }

    enableAddress() {
        this.$address.disabled = false
        for (const field of this.fields.values()) {
            field.enable()
        }
    }

    enableBtn() {
        this.$button.disabled = false
    }

    disableAll() {
        this.disableAddress()
        this.disableBtn()
    }

    disableAddress() {
        this.$address.disabled = true
        for (const field of this.fields.values()) {
            field.disable()
        }
    }

    disableBtn() {
        this.$button.disabled = true
    }

    destroy() {
        this.$button = null
    }
}