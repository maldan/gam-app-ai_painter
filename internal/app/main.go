package app

import (
	"embed"
	"flag"
	"fmt"
	"github.com/maldan/gam-app-ai_painter/internal/app/api"
	"github.com/maldan/gam-app-ai_painter/internal/app/config"
	ms "github.com/maldan/go-ml/server"
	"github.com/maldan/go-ml/server/core/handler"
)

func Start(frontFs embed.FS) {
	// Server
	var host = flag.String("host", "127.0.0.1", "Server Hostname")
	var port = flag.Int("port", 16000, "Server Port")
	_ = flag.Int("clientPort", 8080, "Client Port")

	// Data
	var dataDir = flag.String("dataDir", "db", "Data Directory")
	_ = flag.String("appId", "id", "App id")
	flag.Parse()

	// Set
	config.DataDir = *dataDir

	// Start server
	ms.Start(ms.Config{
		Host: fmt.Sprintf("%s:%d", *host, *port),
		Router: []ms_handler.RouteHandler{
			{
				Path: "/api",
				Handler: ms_handler.API{
					ControllerList: []any{api.Main{}, api.SD{}, api.Document{}},
				},
			},
		},
	})
	/*rapi.Start(rapi.Config{
		Host: fmt.Sprintf("%s:%d", *host, *port),
		Router: map[string]rapi_core.Handler{
			"/": rapi_vfs.VFSHandler{
				Root: "frontend/dist",
				Fs:   frontFs,
			},
			"/api": rapi_rest.ApiHandler{
				Controller: map[string]interface{}{
					"main":   api.MainApi{},
				},
			},
		},
		DbPath: core.DataDir,
	})*/
}
