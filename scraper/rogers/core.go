package rogers

import (
  "fmt"
  "github.com/zylphrex/drakma-cli/scraper"
)

func Run(rogersOpts *RogersScraperOptions) error {
    s := RogersScraper{}

    err := s.StartService(rogersOpts.ScraperOptions)
    if err != nil {
      return err
    }
    defer s.StopService()

    err = s.StartDriver(rogersOpts.ScraperOptions)
    if err != nil {
      return err
    }
    defer s.StopDriver()

    s.Login(rogersOpts.Username, rogersOpts.Password)
    balance, err := s.ReportBalance()

    if err != nil {
      return err
    }

    if s.Err != nil {
      return s.Err
    }

    client := scraper.DrakmaClient{
      BaseUrl: rogersOpts.ScraperOptions.DrakmaUrl,
      ApiToken: rogersOpts.ScraperOptions.DrakmaToken,
    }
    endpoint := fmt.Sprintf(
      "/api/accounts/%v/owes/rogers/",
      rogersOpts.ScraperOptions.DrakmaAccount,
    )
    amount := fmt.Sprintf("amount=%v", balance)
    _, err = client.Post(endpoint, amount)
    if err != nil {
      return err
    }

    return nil
}
