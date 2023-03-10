package db

type Node struct {
	Id          string         `json:"id"`
	Type        string         `json:"type"`
	ClassName   string         `json:"className"`
	X           float64        `json:"x"`
	Y           float64        `json:"y"`
	InputValue  map[string]any `json:"inputValue"`
	OutputValue map[string]any `json:"outputValue"`
}

type Connection struct {
	Id        string `json:"id"`
	FromId    string `json:"fromId"`
	ToId      string `json:"toId"`
	PinOutput string `json:"pinOutput"`
	PinInput  string `json:"pinInput"`
}

type Document struct {
	Name           string       `json:"name"`
	NodeList       []Node       `json:"nodeList"`
	ConnectionList []Connection `json:"connectionList"`
}
