// Package websocket
// Created by RTT.
// Author: teocci@yandex.com on 2022-11월-21
package websocket

import (
	"encoding/json"
	"fmt"
)

const (
	formatJoin  = "New client joins room (ID: %s)"
	formatLeave = "A client leaves room (ID: %s)"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// Registered iots.
	iots map[*IOT]bool

	// Inbound messages from a client to another one.
	unicast chan []byte

	// Inbound messages from the clients.
	broadcast chan []byte
}

func NewHub() *Hub {
	return &Hub{
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		iots:       make(map[*IOT]bool),
		unicast:    make(chan []byte),
		broadcast:  make(chan []byte),
	}
}

func (h *Hub) Run() {
	ito := &IOT{
		ID:      10,
		Addr:    "192.168.1.174",
		Name:    "IOT001",
		clients: make(map[*Client]bool),
	}
	h.iots[ito] = true

	for {
		select {
		case client := <-h.register:
			clientId := client.ID
			str := fmt.Sprintf(formatJoin, clientId)

			for client := range h.clients {
				msg := []byte(str)
				client.send <- msg
			}

			h.clients[client] = true
		case client := <-h.unregister:
			clientId := client.ID
			str := fmt.Sprintf(formatLeave, clientId)
			h.removeIOTByClient(client)
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}

			for client := range h.clients {
				msg := []byte(str)
				client.send <- msg
			}
		case userMessage := <-h.broadcast:
			var data map[string][]byte
			_ = json.Unmarshal(userMessage, &data)

			for client := range h.clients {
				// Prevent self receive the message
				if client.ID == string(data["id"]) {
					continue
				}
				select {
				case client.send <- data["message"]:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		case userMessage := <-h.unicast:
			var data map[string][]byte
			_ = json.Unmarshal(userMessage, &data)

			for client := range h.clients {
				// Prevent self receive the message
				if client.ID == string(data["id"]) {
					select {
					case client.send <- data["message"]:
					default:
						close(client.send)
						delete(h.clients, client)
					}
				}
			}
		}
	}
}

func (h *Hub) IOTByID(id int) (iot *IOT) {
	for iot = range h.iots {
		if iot.ID == id {
			return
		}
	}
	return
}

func (h *Hub) removeIOTByClient(client *Client) (iot *IOT) {
	for iot = range h.iots {
		iot.remove(client)
	}
	return
}
