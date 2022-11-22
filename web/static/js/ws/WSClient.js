/**
 * Created by RTT.
 * Author: teocci@yandex.com on 2022-11월-21
 */
export default class WSClient {
    static CMD_PING = 'ping'
    static CMD_PONG = 'pong'
    static CMD_REGISTER = 'register'

    static CMD_WEBSOCKET_CONNECTED = 'websocket-connected'
    static CMD_CONNECT_SERVICES = 'connect-services'
    static CMD_IOT_UPDATE = 'iot-update'

    static ROLE_WEB_MANAGER = 'web-manager'
    static ROLE_WEB_CONSUMER = 'web-consumer'
    static ROLE_IOT_PUSHER = 'iot-pusher'

    static LISTENER_OPEN_WEBSOCKET = `on-${WSClient.CMD_WEBSOCKET_CONNECTED}`
    static LISTENER_REGISTERED_CLIENT = `on-${WSClient.CMD_REGISTER}-client`
    static LISTENER_CONNECTED_SERVICES = `on-${WSClient.CMD_CONNECT_SERVICES}`
    static LISTENER_UPDATE_TELEMETRY = `on-${WSClient.CMD_IOT_UPDATE}`
    static LISTENER_CLOSE_WEBSOCKET = `on-close-websocket`

    static LISTENERS_LIST = [
        WSClient.LISTENER_OPEN_WEBSOCKET,
        WSClient.LISTENER_REGISTERED_CLIENT,
        WSClient.LISTENER_CONNECTED_SERVICES,
        WSClient.LISTENER_UPDATE_TELEMETRY,
        WSClient.LISTENER_CLOSE_WEBSOCKET,
    ]

    constructor(config) {
        if (isNil(config)) throw 'InvalidModule: null config'
        console.log({config})

        this.config = config
        this.role = config || WSClient.ROLE_WEB_CONSUMER

        this.ws = null

        this.workerId = null
        this.connectionId = null

        this.listeners = {}
        WSClient.LISTENERS_LIST.forEach(name => {
            this.listeners[name] = null
        })
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
        console.log('Connection opened.')
    }

    onMessage(event) {
        // console.log({data: event.data});
        const data = JSON.parse(event.data)
        let callback
        switch (data['cmd']) {
            // Server pings to the client
            case WSClient.CMD_PING:
                // {"cmd":"ping"}
                this.ws.send('{"cmd":"pong"}')

                break
            case WSClient.CMD_PONG:
                // {"cmd":"pong"}
                break
            case WSClient.CMD_WEBSOCKET_CONNECTED:
                // {"cmd":"ws-connected","connection_id":xxx,"worker_id":xxx}
                this.connectionId = data['connection_id']
                this.workerId = data['worker_id']

                this.requestRegistration(data)

                callback = this.getListener(WSClient.LISTENER_OPEN_WEBSOCKET)
                if (callback) callback(event.data)

                console.log(`${WSClient.CMD_WEBSOCKET_CONNECTED} successful`)
                break
            case WSClient.CMD_REGISTER:
                // {"cmd":"register","connection_id":xxx,"drone_id":"xxx","time":"xxx"}
                if (this.role === WSClient.ROLE_WEB_MANAGER) this.requestConnectionToServices(data)

                callback = this.getListener(WSClient.LISTENER_REGISTERED_CLIENT)
                if (callback) callback(event.data)

                console.log(`${WSClient.CMD_REGISTER} successful`)
                break
            case WSClient.CMD_CONNECT_SERVICES:
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
                callback = this.getListener(WSClient.LISTENER_CONNECTED_SERVICES)
                if (callback) callback(event.data)

                console.log(`${WSClient.CMD_CONNECT_SERVICES} successful`)
                break
            case WSClient.CMD_IOT_UPDATE:
                // {
                //    "cmd":"update-telemetry",
                //    "from_connection_id":xxx,
                //    "to_connection_id":"all/client_id",
                //    "module_tag":"xxx",
                //    "drone_id":"xxx",
                //    "record":"xxx",
                //    "time":"xxx",
                // }
                callback = this.getListener(WSClient.LISTENER_UPDATE_TELEMETRY)
                if (callback) callback(event.data)

                // console.log(`${WSClient.CMD_UPDATE_TELEMETRY} successful`)
                break
            default:
                console.log(`command ${data['cmd']} not defined.`)
        }
    }

    onClose(event) {
        const callback = this.getListener(WSClient.LISTENER_CLOSE_WEBSOCKET)
        if (callback) callback(event)
    }

    requestRegistration(data) {
        let jsonData = {
            cmd: WSClient.CMD_REGISTER,
            connection_id: this.connectionId,
            worker_id: this.workerId,
            module_tag: this.group,
            drone_id: this.droneId,
            role: this.role,
        }

        this.ws.send(JSON.stringify(jsonData))
    }

    addListener(name, callback) {
        this.listeners[name] = callback
    }

    removeListener(name) {
        if (this.listeners[name]) delete this.listeners[name]
    }

    getListener(name) {
        return this.listeners[name] ?? null
    }

    requestConnectionToServices(data) {
        let jsonData = {
            cmd: WSClient.CMD_CONNECT_SERVICES,
            connection_id: this.connectionId,
            drone_id: this.droneId,
            module_tag: this.group,
        }

        this.ws.send(JSON.stringify(jsonData))
    }
}