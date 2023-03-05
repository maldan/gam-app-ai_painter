package api

type Main struct {
}

func (r Main) GetIndex(args ArgsEmpty) string {
	return "Test"
}
