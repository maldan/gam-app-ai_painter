package main

import (
	"embed"

	helloworld "github.com/maldan/gam-app-ai_painter/internal/app/ai_painter"
)

//go:embed frontend/dist/*
var frontFs embed.FS

func main() {
	helloworld.Start(frontFs) //
}
