// Package websocket
// Created by RTT.
// Author: teocci@yandex.com on 2022-11월-21
package websocket

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"time"

	ws "github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Poll file for changes with this period.
	updatePeriod = 20 * time.Second

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

const (
	resWSConnected    = "ws-connected"
	resWSDisconnected = "ws-disconnected"
)

const (
	reqRegister   = "register"
	reqConnectIOT = "connect-iot"
	reqIOTUpdate  = "iot-update"
)

const (
	roleWebConsumer = "web-consumer"
	roleIOTPusher   = "iot-pusher"
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var wsu = ws.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type User struct {
	ID      string    `json:"id"`
	Addr    string    `json:"address"`
	EnterAt time.Time `json:"connected"`
}

// Client is a middleman between the ws connection and the hub.
type Client struct {
	hub *Hub

	// The ws connection.
	conn *ws.Conn

	// Buffered channel of outbound messages.
	send chan []byte

	User
}

// readPump pumps messages from the ws connection to the hub.
// The application runs readPump in a per-connection goroutine.
// The application ensures that there is at most one reader on a
// connection by executing all reads from this goroutine.
func (c *Client) readPump() {
	defer func() {
		c.hub.unregister <- c
		err := c.conn.Close()
		if err != nil {
			return
		}
	}()
	c.conn.SetReadLimit(maxMessageSize)
	_ = c.conn.SetReadDeadline(time.Now().Add(pongWait))

	var onPong = func(string) error {
		_ = c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return nil
	}

	c.conn.SetPongHandler(onPong)
	// Handles events from client
Events:
	for {
		var message Message
		err := c.conn.ReadJSON(&message)
		if err != nil {
			switch err.(type) {
			case *ws.CloseError:
				log.Printf("Websocket %p is deconnected. Removing from clients", c.conn)
				break Events
			default:
				log.Printf("Error while reading json message : %s", err)
				continue Events
			}
		}

		fmt.Printf("%#v\n", message)

		switch message.CMD {
		case "register":
			// Handles group registering for the client
			var data RegisterData
			_ = data.FromMap(message.Data)

			switch data.Role {
			case roleWebConsumer:
				iot := c.hub.IOTByID(data.IOTID)
				iot.add(c)

				for iot := range c.hub.iots {
					fmt.Printf("%#v\n", iot.clients)
				}

			case roleIOTPusher:

			}

		case "unregister":
			// Handles group unregistering for the client
			//c.hub.unregister <- c
		}

		//message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		//data := map[string][]byte{
		//	"message": message,
		//	"id":      []byte(c.ID),
		//}
		//userMessage, _ := json.Marshal(data)
		//c.hub.broadcast <- userMessage
	}
}

func randFloat32(min, max float32) float32 {
	return min + rand.Float32()*(max-min)
}

func randFloat32s(min, max float32, n int) []float32 {
	res := make([]float32, n)
	for i := range res {
		res[i] = randFloat32(min, max)
	}
	return res
}

// writePump pumps messages from the hub to the ws connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	fileTicker := time.NewTicker(updatePeriod)
	defer func() {
		ticker.Stop()
		fileTicker.Stop()
		_ = c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				_ = c.conn.WriteMessage(ws.CloseMessage, []byte{})
			}

			w, err := c.conn.NextWriter(ws.TextMessage)
			if err != nil {
				return
			}

			_, _ = w.Write(message)

			// Add queued chat messages to the current ws message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				_, _ = w.Write(newline)
				_, _ = w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-fileTicker.C:
			iot := &IOTData{
				Time:  time.Now().UnixMilli(),
				Value: randFloat32(3, 79),
			}

			if iot != nil {
				_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
				if err := c.conn.WriteJSON(iot); err != nil {
					return
				}
			}
		case <-ticker.C:
			_ = c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(ws.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
