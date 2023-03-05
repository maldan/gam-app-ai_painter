module github.com/maldan/gam-app-ai_painter

go 1.18

// replace github.com/maldan/go-cmhp => ../../go_lib/cmhp

// replace github.com/maldan/go-rapi => ../../go_lib/rapi
replace github.com/maldan/go-ml => ../../go_lib/ml

require (
	github.com/maldan/go-ml v0.0.0-20230216204214-f8a0edef6c32 // indirect
)
