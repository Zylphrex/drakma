package scraper

import (
  "bytes"
  "fmt"
  "io"
  "log"
  "mime/multipart"
  "net/http"
  "net/textproto"
  "os"
  "path/filepath"
  "strconv"
  "strings"
)

type HttpClient struct {
  BaseUrl string
  ApiToken string
}

func (c *HttpClient) NewRequest(method, url string, body io.Reader) (*http.Request, error) {
  req, err := http.NewRequest(method, url, body)
  if err != nil {
    return nil, err
  }

  authorizationHeader := fmt.Sprintf("Token %v", c.ApiToken)
  req.Header.Add("Authorization", authorizationHeader)
  return req, nil
}

func (c *HttpClient) Do(req *http.Request) (*http.Response, error) {
  client := &http.Client{}
  response, err := client.Do(req)
  if err == nil {
    defer response.Body.Close()
  }
  return response, err
}

func (c *HttpClient) Post(endpoint string, data map[string]string) (*http.Response, error) {
  url := fmt.Sprintf("%v%v", c.BaseUrl, endpoint)

  params := []string{}
  for key, val := range data {
    params = append(params, fmt.Sprintf("%v=%v", key, val))
  }
  body := strings.NewReader(strings.Join(params, "&"))

  req, err := c.NewRequest("POST", url, body)
  if err != nil {
    return nil, err
  }

  req.Header.Add("Content-Length", strconv.Itoa(len(data)))
  req.Header.Add("Content-Type", "application/x-www-form-urlencoded")
  log.Printf("sending POST request to %v", url)
  return c.Do(req)
}

var quoteEscaper = strings.NewReplacer("\\", "\\\\", `"`, "\\\"")

func escapeQuotes(s string) string {
  return quoteEscaper.Replace(s)
}

func (c *HttpClient) PutCSV(endpoint, name, path string) (*http.Response, error) {
  url := fmt.Sprintf("%v%v", c.BaseUrl, endpoint)

  file, err := os.Open(path)
  if err != nil {
    return nil, err
  }
  defer file.Close()

  body := &bytes.Buffer{}
  writer := multipart.NewWriter(body)
  h := make(textproto.MIMEHeader)
  h.Set("Content-Disposition",
        fmt.Sprintf(`form-data; name="%s"; filename="%s"`,
        escapeQuotes(name), escapeQuotes(filepath.Base(file.Name()))))
  h.Set("Content-Type", "text/csv")
  part, err := writer.CreatePart(h)
  if err != nil {
    return nil, err
  }
  io.Copy(part, file)
  writer.Close()

  req, err := c.NewRequest("PUT", url, body)
  if err != nil {
    return nil, err
  }

  req.Header.Add("Content-Type", writer.FormDataContentType())
  log.Printf("sending POST request with file to %v", url)

  return c.Do(req)
}
