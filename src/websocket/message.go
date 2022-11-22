// Package websocket
// Created by RTT.
// Author: teocci@yandex.com on 2022-11월-22
package websocket

type Message struct {
	CMD  string                 `json:"cmd"`
	Data map[string]interface{} `json:"data,omitempty"`
}
