package api

import (
	"github.com/maldan/gam-app-ai_painter/internal/app/config"
	ms_error "github.com/maldan/go-ml/server/error"
	ml_convert "github.com/maldan/go-ml/util/convert"
	ml_file "github.com/maldan/go-ml/util/io/fs/file"
	ml_net "github.com/maldan/go-ml/util/io/net"
)

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

type SDTxt2ImgResponse struct {
	Images []string `json:"images"`
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
	v := SDTxt2ImgResponse{}
	response.JSON(&v)

	image, err := ml_convert.FromBase64(v.Images[0])
	ms_error.FatalIfError(err)

	err = ml_file.New(config.DataDir + "/document/test/img.png").Write(image)
	ms_error.FatalIfError(err)

	return "http://" + config.Host + "/data/document/test/img.png"
}
