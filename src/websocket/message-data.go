// Package websocket
// Created by RTT.
// Author: teocci@yandex.com on 2022-11월-22
package websocket

import (
	"encoding/json"
)

type MessageData struct {
	CMD string `json:"cmd"`
}

type RegisterData struct {
	Role  string `json:"role"`
	IOTID int    `json:"iot_id,omitempty"`
	Addr  string `json:"address,omitempty"`
	Name  string `json:"name,omitempty"`
}

func (d *RegisterData) FromMap(m map[string]interface{}) error {
	return parseMap(m, d)
}

func (d *RegisterData) FromJSON(s string) error {
	return parseJSON(s, d)
}

func (d *RegisterData) FromByte(data []byte) error {
	return parseByte(data, d)
}

func (d *RegisterData) ToJSON() string {
	return asJSON(d)
}

func (d *RegisterData) ToByte() ([]byte, error) {
	return asByte(d)
}

func parseMap(m map[string]interface{}, d interface{}) error {
	data, err := json.Marshal(m)
	if err == nil {
		err = json.Unmarshal(data, d)
	}
	return err
}

func parseJSON(s string, d interface{}) error {
	return parseByte([]byte(s), d)
}

func parseByte(data []byte, d interface{}) error {
	return json.Unmarshal(data, d)
}

func asJSON(d interface{}) string {
	a, err := json.Marshal(d)
	if err != nil {
		panic(err)
	}
	return string(a)
}

func asByte(d interface{}) ([]byte, error) {
	return json.Marshal(d)
}
