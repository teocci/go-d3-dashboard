// Package websocket
// Created by RTT.
// Author: teocci@yandex.com on 2022-11월-21
package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
)

// ServeWS handles websocket requests from the peer.
func ServeWS(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := wsu.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
	client.hub.register <- client
	client.ID = GenUserId()
	client.Addr = conn.RemoteAddr().String()
	client.EnterAt = time.Now()

	// Allow collection of memory referenced by the caller by doing all
	// work in new goroutines.
	go client.writePump()
	go client.readPump()

	msg, _ := json.Marshal(client)

	client.send <- msg
}

func GenUserId() string {
	uid := uuid.NewString()
	return uid
}
