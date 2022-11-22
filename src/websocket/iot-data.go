// Package websocket
// Created by RTT.
// Author: teocci@yandex.com on 2022-11월-22
package websocket

var (
	iotColumns = []string{"time", "value"}
)

type IOTMessage struct {
	CMD  string   `json:"cmd"`
	Data *IOTData `json:"data"`
}

type IOTData struct {
	Time  int64   `json:"time"`
	Value float32 `json:"value"`
}

func (i *IOTData) FromMap(m map[string]interface{}) error {
	return parseMap(m, i)
}

func (i *IOTData) FromJSON(s string) error {
	return parseJSON(s, i)
}

func (i *IOTData) FromByte(data []byte) error {
	return parseByte(data, i)
}

func (i *IOTData) ToJSON() string {
	return asJSON(i)
}

func (i *IOTData) ToByte() ([]byte, error) {
	return asByte(i)
}
