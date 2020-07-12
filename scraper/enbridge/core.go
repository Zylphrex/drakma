package enbridge

import (
  "fmt"
  "github.com/zylphrex/drakma/scraper"
)

func Run(enbridgeOpts *EnbridgeScraperOptions) {
    s := EnbridgeScraper{}

    err := s.StartService(enbridgeOpts.ScraperOptions)
    if err != nil {
      fmt.Println(err)
    }
    defer s.StopService()

    err = s.StartDriver(enbridgeOpts.ScraperOptions)
    if err != nil {
      fmt.Println(err)
    }
    defer s.StopDriver()

    s.Login(enbridgeOpts.Username, enbridgeOpts.Password)
    balance, err := s.ReportBalance()

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
      BaseUrl: enbridgeOpts.ScraperOptions.DrakmaUrl,
      ApiToken: enbridgeOpts.ScraperOptions.DrakmaToken,
    }
    endpoint := fmt.Sprintf(
      "/api/accounts/%v/owes/enbridge-gas/",
      enbridgeOpts.ScraperOptions.DrakmaAccount,
    )
    amount := fmt.Sprintf("amount=%v", balance)
    _, err = client.Post(endpoint, amount)
    if err != nil {
        fmt.Println(err)
    }
}
