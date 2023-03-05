package api

import ml_net "github.com/maldan/go-ml/util/io/net"

type SD struct {
}

type ArgsTxt2Img struct {
	Prompt         string  `json:"prompt"`
	NegativePrompt string  `json:"negativePrompt"`
	Width          int     `json:"width"`
	Height         int     `json:"height"`
	Cfg            float64 `json:"cfg"`
	Steps          int     `json:"steps"`
}

func (r SD) PostTxt2Img(args ArgsTxt2Img) any {
	response := ml_net.Post("http://localhost:7860/sdapi/v1/txt2img", &ml_net.RequestOptions{
		Data: map[string]any{
			"prompt":         args.Prompt,
			"negativePrompt": args.NegativePrompt,
			"width":          args.Width,
			"height":         args.Height,
			"cfg":            args.Cfg,
			"steps":          args.Steps,
		},
	})
	v := map[string]any{}
	response.JSON(&v)
	return v
}
