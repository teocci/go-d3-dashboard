import BaseListener from '../base/base-listener.js'

/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-11월-21
 */

const CMD_PING = 'ping'
const CMD_PONG = 'pong'

const CMD_WS_CONNECTED = 'ws-connected'
const CMD_CLIENT_REGISTERED = 'client-registered'
const CMD_CLIENT_UNREGISTERED = 'client-unregistered'
const CMD_IOT_CONNECTED = 'iot-connected'
const CMD_IOT_UPDATED = 'iot-updated'
const CMD_WS_DISCONNECTED = 'ws-disconnected'

const CMD_REGISTER_CLIENT = 'register-client'
const CMD_UNREGISTER_CLIENT = 'unregister-client'
const CMD_CONNECT_IOT = 'connect-iot'
const CMD_IOT_UPDATE = 'iot-update'

const ROLE_WEB_MANAGER = 'web-manager'
const ROLE_WEB_CONSUMER = 'web-consumer'
const ROLE_IOT_PUSHER = 'iot-pusher'

const EVENT_WS_CONNECTED = `wse-${CMD_WS_CONNECTED}`
const EVENT_CLIENT_REGISTERED = `wse-${CMD_CLIENT_REGISTERED}`
const EVENT_CLIENT_UNREGISTERED = `wse-${CMD_UNREGISTER_CLIENT}`
const EVENT_IOT_CONNECTED = `wse-${CMD_IOT_CONNECTED}`
const EVENT_IOT_UPDATED = `wse-${CMD_IOT_UPDATED}`
const EVENT_WS_DISCONNECTED = `wse-${CMD_WS_DISCONNECTED}`

const EVENT_LIST = [
    EVENT_WS_CONNECTED,
    EVENT_CLIENT_REGISTERED,
    EVENT_CLIENT_UNREGISTERED,
    EVENT_IOT_CONNECTED,
    EVENT_IOT_UPDATED,
    EVENT_WS_DISCONNECTED,
]

export default class WSClient extends BaseListener {
    static CMD_PING = CMD_PING
    static CMD_PONG = CMD_PONG

    static CMD_WS_CONNECTED = CMD_WS_CONNECTED
    static CMD_CLIENT_REGISTERED = CMD_CLIENT_REGISTERED
    static CMD_CLIENT_UNREGISTERED = CMD_CLIENT_UNREGISTERED
    static CMD_IOT_CONNECTED = CMD_IOT_CONNECTED
    static CMD_IOT_UPDATED = CMD_IOT_UPDATED
    static CMD_WS_DISCONNECTED = CMD_WS_DISCONNECTED

    static CMD_REGISTER_CLIENT = CMD_REGISTER_CLIENT
    static CMD_UNREGISTER_CLIENT = CMD_UNREGISTER_CLIENT
    static CMD_CONNECT_SERVICES = CMD_CONNECT_IOT
    static CMD_IOT_UPDATE = CMD_IOT_UPDATE

    static ROLE_WEB_MANAGER = ROLE_WEB_MANAGER
    static ROLE_WEB_CONSUMER = ROLE_WEB_CONSUMER
    static ROLE_IOT_PUSHER = ROLE_IOT_PUSHER

    static EVENT_WS_CONNECTED = CMD_WS_CONNECTED
    static EVENT_CLIENT_REGISTERED = EVENT_CLIENT_REGISTERED
    static EVENT_CLIENT_UNREGISTERED = EVENT_CLIENT_UNREGISTERED
    static EVENT_IOT_CONNECTED = EVENT_IOT_CONNECTED
    static EVENT_IOT_UPDATED = EVENT_IOT_UPDATED
    static EVENT_WS_DISCONNECTED = EVENT_WS_DISCONNECTED

    static EVENT_LIST = EVENT_LIST

    constructor(config) {
        if (isNil(config)) throw 'InvalidModule: null config'
        console.log({config})
        super()

        this.config = config
        this.config['role'] = config.role || ROLE_WEB_CONSUMER

        this.ws = null

        this.connectionId = null

        this._onEvents = () => {}

        for (name of EVENT_LIST) {
            this.addListener(name, this._onEvents)
        }
    }

    set onEvents(fnc) {
        this._onEvents = fnc
        this.removeAllListeners()
        for (name of EVENT_LIST) {
            this.addListener(name, fnc)
        }
    }

    connect() {
        const address = this.config.address
        if (!address) throw 'InvalidAddress: null this.address'
        // console.log({address})

        // Create a websocket
        this.ws = new WebSocket(address)

        // Implement the onopen method
        this.ws.onopen = e => this.onOpen(e)

        // Implement the onmessage method
        this.ws.onmessage = e => this.onMessage(e)

        // Implement the onclose method
        this.ws.onclose = e => this.onClose(e)

        // Implement the onerror method
        this.ws.onerror = e => {
            console.log('An error occurred', e)
        }
    }

    disconnect() {
        // Closes a websocket connection
        this.ws.close()
    }

    onOpen() {
        console.log('connection opened')
    }

    onMessage(event) {
        // console.log({data: event.data});
        const role = this.config.role
        const message = JSON.parse(event.data)
        let callback
        switch (message['cmd']) {
            // Server pings to the client
            case CMD_PING:
                // {"cmd":"ping"}
                this.ws.send('{"cmd":"pong"}')

                break
            case CMD_PONG:
                // {"cmd":"pong"}
                break
            case CMD_WS_CONNECTED:
                // {
                //      "cmd":"ws-connected",
                //      "data": {
                //          "id": "670f5805-63fe-44e0-bd01-1dd503c395e8",
                //          "address": "[::1]:2294",
                //          "connected": "2022-11-22T23:08:37.8863158+09:00"
                //      }
                // }
                this.connectionId = message['data'].id

                this.requestRegistration(message, message)

                this.emit(EVENT_WS_CONNECTED, message)

                console.log(`${CMD_WS_CONNECTED} successful`)
                break
            case CMD_CLIENT_REGISTERED:
                // {"cmd":"register","connection_id":xxx,"drone_id":"xxx","time":"xxx"}
                if (role === ROLE_WEB_MANAGER) this.requestStartUpdates(message)

                this.emit(EVENT_CLIENT_REGISTERED, message)

                console.log(`${CMD_CLIENT_REGISTERED} successful`)
                break
            case CMD_IOT_CONNECTED:
                // {
                //    "cmd":"connect-services",
                //    "connection_id":xxx,
                //    "worker_id":"xxx",
                //    "module_tag":"xxx",
                //    "drone_id":"xxx",
                //    "flight_id":"xxx",
                //    "telemetry_pid":"xxx",
                //    "stream_id":"xxx",
                //    "time":"xxx"
                // }
                this.emit(EVENT_IOT_CONNECTED, message)

                console.log(`${CMD_IOT_CONNECTED} successful`)
                break
            case CMD_IOT_UPDATED:
                // {
                //    "cmd":"update-telemetry",
                //    "from_connection_id":xxx,
                //    "to_connection_id":"all/client_id",
                //    "module_tag":"xxx",
                //    "drone_id":"xxx",
                //    "record":"xxx",
                //    "time":"xxx",
                // }
                this.emit(EVENT_IOT_UPDATED, message)

                // console.log(`${CMD_IOT_UPDATED} successful`)
                break
            default:
                console.log('command not defined.', {data: message})
        }
    }

    onClose(event) {
        const message = {
            cmd: CMD_WS_DISCONNECTED,
        }
        this.emit(EVENT_WS_DISCONNECTED, message)
    }

    requestRegistration() {
        let jsonData = {
            cmd: CMD_REGISTER_CLIENT,
            data: {
                connection_id: this.connectionId,
                role: this.config.role,
                iot_id: this.config.iotId,
            },
        }

        this.ws.send(JSON.stringify(jsonData))
    }

    requestStartUpdates() {
        let jsonData = {
            cmd: CMD_CONNECT_IOT,
            id: this.connectionId,
        }

        this.ws.send(JSON.stringify(jsonData))
    }
}