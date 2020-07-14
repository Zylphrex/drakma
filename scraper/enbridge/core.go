package enbridge

import (
  "fmt"
  "github.com/zylphrex/drakma-cli/scraper"
)

func Run(enbridgeOpts *EnbridgeScraperOptions) error {
    s := EnbridgeScraper{}

    err := s.StartService(enbridgeOpts.ScraperOptions)
    if err != nil {
      return err
    }
    defer s.StopService()

    err = s.StartDriver(enbridgeOpts.ScraperOptions)
    if err != nil {
      return err
    }
    defer s.StopDriver()

    s.Login(enbridgeOpts.Username, enbridgeOpts.Password)
    balance, err := s.ReportBalance()

    if err != nil {
      return err
    }

    if s.Err != nil {
      return s.Err
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
      return err
    }

    return nil
}
