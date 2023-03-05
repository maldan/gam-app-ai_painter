package main

import (
	"embed"
	"github.com/maldan/gam-app-ai_painter/internal/app"
)

//go:embed frontend/dist/*
var frontFs embed.FS

func main() {
	app.Start(frontFs) //
}
