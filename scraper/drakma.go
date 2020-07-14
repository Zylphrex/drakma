package scraper

import (
  "fmt"
  "io"
  "log"
  "net/http"
  "strconv"
  "strings"
)

type DrakmaClient struct {
  BaseUrl string
  ApiToken string
}

func (d *DrakmaClient) NewRequest(method, url string, body io.Reader) (*http.Request, error) {
  req, err := http.NewRequest(method, url, body)
  if err != nil {
    return nil, err
  }

  authorizationHeader := fmt.Sprintf("Token %v", d.ApiToken)
  req.Header.Add("Authorization", authorizationHeader)
  return req, nil
}

func (d *DrakmaClient) Do(req *http.Request) (*http.Response, error) {
  client := &http.Client{}
  return client.Do(req)
}

func (d *DrakmaClient) Post(endpoint, data string) (*http.Response, error) {
  url := fmt.Sprintf("%v%v", d.BaseUrl, endpoint)
  body := strings.NewReader(data)
  req, err := d.NewRequest("POST", url, body)
  if err != nil {
    return nil, err
  }
  req.Header.Add("Content-Length", strconv.Itoa(len(data)))
  req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
  log.Printf("sending POST request to %v", url)
  return d.Do(req)
}
