package api

import (
	"github.com/maldan/gam-app-ai_painter/internal/app/config"
	"github.com/maldan/gam-app-ai_painter/internal/app/db"
	ms_error "github.com/maldan/go-ml/server/error"
	ml_json "github.com/maldan/go-ml/util/io/fs/json"
)

type Document struct {
}

func (r Document) PostIndex(args db.Document) {
	err := ml_json.ToFile(config.DataDir+"/document/"+args.Name+"/index.json", args)
	ms_error.FatalIfError(err)
}

func (r Document) GetIndex(args db.Document) db.Document {
	d, err := ml_json.FromFile[db.Document](config.DataDir + "/document/" + args.Name + "/index.json")
	ms_error.FatalIfError(err)
	return d
}
