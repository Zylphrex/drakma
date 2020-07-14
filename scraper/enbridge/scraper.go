package enbridge

import (
  "log"
  "time"
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
  log.Printf("going to to home page")
  s.Visit(enbridgeGasUrl)
}

func (s *EnbridgeScraper) Login(username, password string) {
  s.Home()
  log.Printf("typing credentials")
  s.Type("#signin-username3", username)
  s.Type("#signin-password3", password)
  log.Printf("logging in")
  s.Click("#back-to-top > div.main > div > div > div > div > div > div.padding-all > div > div:nth-child(3) > div > div > form > button")
  s.dismissNotification()
  log.Printf("waiting for account page load")
  s.WaitForElement(".account-number")
}

func (s *EnbridgeScraper) ReportBalance() (string, error) {
  s.Home()
  log.Printf("navigating to account page")
  s.Click("#navbar li.dropdown:nth-child(2) a")
  s.dismissNotification()
  log.Printf("waiting for account page load")
  s.WaitForElement(".account-number")
  return s.getBalance()
}

func (s *EnbridgeScraper) dismissNotification() {
  log.Printf("waiting for notification load")
  if err := s.WaitForElementE("#cancelNotification"); err == nil {
    log.Printf("dismissing notification")
    // sometimes it takes a while for it to be clickable
    // so lets wait a while
    time.Sleep(3 * time.Second)
    s.Click("#cancelNotification")
  } else {
    log.Printf("no notifications found")
  }
}

func (s *EnbridgeScraper) getBalance() (string, error) {
  log.Printf("getting balance text")
  text, err := s.Text(".account-balance-details b")
  if err != nil {
    return text, err
  }
  // the first character is $ so remove it
  return text[1:], err
}
