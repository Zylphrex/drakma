package rogers

import (
  "log"
  "github.com/zylphrex/drakma-cli/scraper"
)

const rogersUrl = "https://www.rogers.com"

type RogersScraperOptions struct {
  ScraperOptions scraper.ScraperOptions
  Username string
  Password string
}

type RogersScraper struct {
  scraper.Scraper
}

func (s *RogersScraper) Home() {
  log.Printf("going to to home page")
  s.Visit(rogersUrl)
}

func (s *RogersScraper) Login(username, password string) {
  s.Home()
  s.WaitForElementE("#divAppLoading")
  s.WaitForElementDisappearE("#divAppLoading")
  s.Click("li.o-navLinkList__item:nth-child(4) a.-login")
  log.Printf("typing credentials")
  s.SwitchFrame(".el-modal iframe")
  s.Type("#username", username)
  s.Type("#password", password)
  log.Printf("logging in")
  s.Click(".primary-button")
  s.RootFrame()
  log.Printf("waiting for account page load")
  s.WaitForElement(".amount")
}

func (s *RogersScraper) ReportBalance() (string, error) {
  // s.Home()
  // log.Printf("navigating to account page")
  // s.Click(".l-headerDesk a[title=\"MyRogers\"]")
  // log.Printf("waiting for account page load")
  // s.WaitForElement(".dds-navbar .user-loggedin")
  return s.getBalance()
}

func (s *RogersScraper) getBalance() (string, error) {
  log.Printf("getting balance text")
  s.WaitForElement(".amount")
  err := s.WaitForElementText(".amount")
  if err != nil {
    return "", err
  }
  text, err := s.Text(".amount")
  if err != nil {
    return "", err
  }
  // the first character is $ so remove it
  return text[1:], err
}
