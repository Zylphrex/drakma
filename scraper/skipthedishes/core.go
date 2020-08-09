package skipthedishes

import (
  "fmt"
  "time"
  "github.com/tebeka/selenium/firefox"
  "github.com/zylphrex/drakma-cli/scraper"
)

func Run(skipTheDishesOpts *SkipTheDishesOptions) error {
  s := SkipTheDishesScraper{}

  err := s.StartService(skipTheDishesOpts.ScraperOptions)
  if err != nil {
    return err
  }
  defer s.StopService()

  prefs := make(map[string]interface{})
  prefs["browser.helperApps.neverAsk.saveToDisk"] = "text/csv"

  capabilities := firefox.Capabilities{}
  capabilities.Prefs = prefs
  err = s.StartDriverWithCapabilities(skipTheDishesOpts.ScraperOptions, capabilities)
  if err != nil {
    return err
  }
  defer s.StopDriver()

  s.Login(skipTheDishesOpts.Username, skipTheDishesOpts.Password)
  s.ScrollReportsIntoView(skipTheDishesOpts.StartDate)
  files := s.DownloadWeeklyReports(skipTheDishesOpts.StartDate, skipTheDishesOpts.EndDate)

  if err != nil {
    return err
  }

  if s.Err != nil {
    return s.Err
  }

  for _, file := range files {
    client := scraper.HttpClient{
      BaseUrl: skipTheDishesOpts.ScraperOptions.DrakmaUrl,
      ApiToken: skipTheDishesOpts.ScraperOptions.DrakmaToken,
    }
    endpoint := fmt.Sprintf(
      "/api/accounts/%v/skipthedishes/statement/Order.csv/",
      skipTheDishesOpts.ScraperOptions.DrakmaAccount,
    )
    _, err := client.PutCSV(endpoint, "orders", file)
    if err != nil {
      return err
    }

    // slow it down a little
    time.Sleep(3 * time.Second)
  }

  return nil
}
