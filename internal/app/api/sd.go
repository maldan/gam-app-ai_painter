package api

import (
	"github.com/maldan/gam-app-ai_painter/internal/app/config"
	ms_error "github.com/maldan/go-ml/server/error"
	ml_convert "github.com/maldan/go-ml/util/convert"
	ml_crypto "github.com/maldan/go-ml/util/crypto"
	ml_file "github.com/maldan/go-ml/util/io/fs/file"
	ml_net "github.com/maldan/go-ml/util/io/net"
)

type SD struct {
}

type ArgsTxt2Img struct {
	Seed           int     `json:"seed"`
	Prompt         string  `json:"prompt"`
	NegativePrompt string  `json:"negativePrompt"`
	Width          int     `json:"width"`
	Height         int     `json:"height"`
	Cfg            float64 `json:"cfg"`
	Steps          int     `json:"steps"`
}

type ArgsImg2Img struct {
	Seed              int     `json:"seed"`
	InitImage         string  `json:"initImage"`
	Prompt            string  `json:"prompt"`
	NegativePrompt    string  `json:"negativePrompt"`
	Width             int     `json:"width"`
	Height            int     `json:"height"`
	Cfg               float64 `json:"cfg"`
	Steps             int     `json:"steps"`
	DenoisingStrength float64 `json:"denoisingStrength"`
}

type ArgsUploadImage struct {
	Image string `json:"image"`
}

type SDTxt2ImgResponse struct {
	Images []string `json:"images"`
}

func (r SD) PostTxt2Img(args ArgsTxt2Img) any {
	response := ml_net.Post("http://localhost:7860/sdapi/v1/txt2img", &ml_net.RequestOptions{
		Data: map[string]any{
			"seed":           args.Seed,
			"prompt":         args.Prompt,
			"negativePrompt": args.NegativePrompt,
			"width":          args.Width,
			"height":         args.Height,
			"cfg_scale":      args.Cfg,
			"steps":          args.Steps,
		},
	})
	v := SDTxt2ImgResponse{}
	response.JSON(&v)

	image, err := ml_convert.FromBase64(v.Images[0])
	ms_error.FatalIfError(err)

	imageId := ml_crypto.UID(8)
	err = ml_file.New(config.DataDir + "/document/test/" + imageId + ".png").Write(image)
	ms_error.FatalIfError(err)

	return "http://" + config.Host + "/data/document/test/" + imageId + ".png"
}

func (r SD) PostUploadImage(args ArgsUploadImage) any {
	bytes, _, _ := ml_convert.DataUrlToBytes(args.Image)
	imageId := ml_crypto.UID(8)

	err := ml_file.New(config.DataDir + "/document/test/" + imageId + ".png").Write(bytes)
	ms_error.FatalIfError(err)

	return "http://" + config.Host + "/data/document/test/" + imageId + ".png"
}

func (r SD) PostImg2Img(args ArgsImg2Img) any {
	img := ml_net.Get(args.InitImage, nil)
	b, _ := img.Bytes()
	b64 := ml_convert.ToBase64(b)

	response := ml_net.Post("http://localhost:7860/sdapi/v1/img2img", &ml_net.RequestOptions{
		Data: map[string]any{
			"init_images": []string{
				b64,
			},
			"seed":               args.Seed,
			"prompt":             args.Prompt,
			"negativePrompt":     args.NegativePrompt,
			"width":              args.Width,
			"height":             args.Height,
			"cfg_scale":          args.Cfg,
			"steps":              args.Steps,
			"denoising_strength": args.DenoisingStrength,
		},
	})
	v := SDTxt2ImgResponse{}
	response.JSON(&v)

	image, err := ml_convert.FromBase64(v.Images[0])
	ms_error.FatalIfError(err)

	imageId := ml_crypto.UID(8)
	err = ml_file.New(config.DataDir + "/document/test/" + imageId + ".png").Write(image)
	ms_error.FatalIfError(err)

	return "http://" + config.Host + "/data/document/test/" + imageId + ".png"
}
