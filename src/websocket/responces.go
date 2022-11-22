// Package websocket
// Created by RTT.
// Author: teocci@yandex.com on 2022-11월-22
package websocket

type WSCMessage struct {
	CMD  string `json:"cmd"`
	Data *User  `json:"data"`
}

type RegisteredMessage struct {
	CMD  string          `json:"cmd"`
	Data *RegisteredData `json:"data"`
}

type RegisteredData struct {
	Columns []string `json:"columns"`
}
