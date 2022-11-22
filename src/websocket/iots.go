// Package websocket
// Created by RTT.
// Author: teocci@yandex.com on 2022-11월-22
package websocket

type IOT struct {
	ID   int    `json:"id"`
	Addr string `json:"address"`
	Name string `json:"name"`
	// Registered clients.
	clients map[*Client]bool
}

func (i *IOT) add(client *Client) {
	i.clients[client] = true
}

func (i *IOT) remove(client *Client) {
	if _, ok := i.clients[client]; ok {
		delete(i.clients, client)
	}
}
