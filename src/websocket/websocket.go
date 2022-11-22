// Package websocket
// Created by RTT.
// Author: teocci@yandex.com on 2022-11월-21
package websocket

import (
	"fmt"

	"github.com/gin-gonic/gin"
	"github.com/teocci/go-d3-dashboard/src/config"
)

const (
	formatAddress = "%s:%d"
)

var address string

func Start() {
	address = fmt.Sprintf(formatAddress, "", config.Data.WS.Port)

	r := gin.Default()
	hub := NewHub()
	go hub.Run()
	r.GET("/", func(c *gin.Context) {
		ServeWS(hub, c.Writer, c.Request)
	})
	_ = r.Run(address)
}
