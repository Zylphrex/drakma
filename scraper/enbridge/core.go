package enbridge

import (
  "fmt"
  "os"
  "time"
  "github.com/zylphrex/drakma/scraper"
)

func Run() {
    opts := EnbridgeScraperOptions{
      scraper.ScraperOptions{
        Port: 8080,
        SeleniumPath: os.Getenv("SELENIUM_PATH"),
        GeckoDriverPath: os.Getenv("GECKODRIVER_PATH"),
        DrakmaHost: os.Getenv("DRAKMA_HOST"),
        DrakmaAccount: os.Getenv("DRAKMA_ACCOUNT"),
        DrakmaApiToken: os.Getenv("DRAKMA_API_TOKEN"),
      },
      os.Getenv("ENBRIDGE_GAS_USERNAME"),
      os.Getenv("ENBRIDGE_GAS_PASSWORD"),
    }
    s := EnbridgeScraper{}

    err := s.StartService(opts.scraperOptions)
    if err != nil {
      fmt.Println(err)
    }
    defer s.StopService()

    err = s.StartDriver(opts.scraperOptions)
    if err != nil {
      fmt.Println(err)
    }
    defer s.StopDriver()

    s.Login(opts.username, opts.password)
    balance, err := s.ReportBalance()
    time.Sleep(10 * time.Second)

    if err != nil || s.Err != nil {
      if err != nil {
        fmt.Println(err)
      }

      if s.Err != nil {
        fmt.Println(s.Err)
      }
      return
    }

    client := scraper.DrakmaClient{
      Host: opts.scraperOptions.DrakmaHost,
      ApiToken: opts.scraperOptions.DrakmaApiToken,
    }
    endpoint := fmt.Sprintf(
      "/api/accounts/%v/owes/enbridge-gas/",
      opts.scraperOptions.DrakmaAccount,
    )
    amount := fmt.Sprintf("amount=%v", balance)
    _, err = client.Post(endpoint, amount)
    if err != nil {
        fmt.Println(err)
    }
}
