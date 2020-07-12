package enbridge

import (
  "github.com/zylphrex/drakma-cli/scraper"
)

const enbridgeGasUrl = "https://www.enbridgegas.com/"

type EnbridgeScraperOptions struct {
  ScraperOptions scraper.ScraperOptions
  Username string
  Password string
}

type EnbridgeScraper struct {
  scraper.Scraper
}

func (s *EnbridgeScraper) Home() {
  s.Visit(enbridgeGasUrl)
}

func (s *EnbridgeScraper) Login(username, password string) {
  s.Home()
  s.Type("#signin-username3", username)
  s.Type("#signin-password3", password)
  s.Click("#back-to-top > div.main > div > div > div > div > div > div.padding-all > div > div:nth-child(3) > div > div > form > button")
  s.dismissNotification()
  s.WaitForElement(".account-number")
}

func (s *EnbridgeScraper) ReportBalance() (string, error) {
  s.Home()
  s.Click("#navbar li.dropdown:nth-child(2) a")
  s.dismissNotification()
  s.WaitForElement(".account-number")
  return s.getBalance()
}

func (s *EnbridgeScraper) dismissNotification() {
  if err := s.WaitForElementE("#cancelNotification"); err == nil {
    s.Click("#cancelNotification")
  }
}

func (s *EnbridgeScraper) getBalance() (string, error) {
  text, err := s.Text(".account-balance-details b")
  if err != nil {
    return text, err
  }
  return text[1:], err
}
