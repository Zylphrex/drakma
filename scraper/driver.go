package scraper

import (
  "fmt"
  "log"
  "strings"
  "time"
  "github.com/tebeka/selenium"
  "github.com/tebeka/selenium/firefox"
)

const timeout = 30 * time.Second

const interval = 100 * time.Millisecond

type ScraperOptions struct {
  Port int
  Headless bool
  SeleniumPath string
  GeckoDriverPath string
  DrakmaUrl string
  DrakmaAccount string
  DrakmaToken string
}

type Scraper struct {
  SeleniumService *selenium.Service
  SeleniumDriver selenium.WebDriver
  Err error
}

func (s *Scraper) StartService(scraperOptions ScraperOptions) error {
  log.Printf("starting service")
  serviceOptions := []selenium.ServiceOption{
    selenium.GeckoDriver(scraperOptions.GeckoDriverPath),
  }
  service, err := selenium.NewSeleniumService(
    scraperOptions.SeleniumPath,
    scraperOptions.Port,
    serviceOptions...,
  )
  if err != nil {
    log.Fatalf("failed to start service %v", err)
    return err
  }

  s.SeleniumService = service
  return nil
}

func (s *Scraper) StopService() {
  log.Printf("stopping service")
  s.SeleniumService.Stop()
}

func (s *Scraper) StartDriver(scraperOptions ScraperOptions) error {
  log.Printf("starting driver")
  caps := selenium.Capabilities{"browserName": "firefox"}
  if scraperOptions.Headless {
    log.Printf("configuring headless mode")
    f := firefox.Capabilities{}
    f.Args = append(f.Args, "-headless")
    caps.AddFirefox(f)
  }
  seleniumUrl := fmt.Sprintf("http://localhost:%d/wd/hub", scraperOptions.Port)
  driver, err := selenium.NewRemote(caps, seleniumUrl)
  if err != nil {
    log.Fatalf("failed to start driver %v", err)
    return err
  }

  s.SeleniumDriver = driver
  return nil
}

func (s *Scraper) StopDriver() {
  log.Printf("stopping driver")
  s.SeleniumDriver.Quit()
}

func (s *Scraper) Visit(url string) {
  if s.Err != nil {
    return
  }

  log.Printf("visiting %v", url)
  if err := s.SeleniumDriver.Get(url); err != nil {
    log.Fatalf("failed to visit %v", err)
    s.Err = err
  }
}

func (s *Scraper) FindElement(selector string) (selenium.WebElement, error) {
  if s.Err != nil {
    return nil, fmt.Errorf("scraper in errored state %v", s.Err)
  }

  s.WaitForElementE(selector)
  return s.SeleniumDriver.FindElement(selenium.ByCSSSelector, selector)
}

func (s *Scraper) Type(selector, text string) {
  if s.Err != nil {
    return
  }

  elem, err := s.FindElement(selector)
  if err != nil {
    log.Fatalf("failed to locate element %v %v", selector, err)
    s.Err = err
    return
  }

  log.Printf("typing %v", selector)
  if err := elem.SendKeys(text); err != nil {
    log.Fatalf("failed to type element %v", err)
    s.Err = err
    return
  }
}

func (s *Scraper) Hover(selector string) {
  if s.Err != nil {
    return
  }

  elem, err := s.FindElement(selector)
  if err != nil {
    log.Fatalf("failed to locate element %v %v", selector, err)
    s.Err = err
    return
  }

  if err := elem.MoveTo(0, 0); err != nil {
    log.Fatalf("failed to hover element %v %v", selector, err)
    s.Err = err
    return
  }
}

func (s *Scraper) Click(selector string) {
  if s.Err != nil {
    return
  }

  elem, err := s.FindElement(selector)
  if err != nil {
    log.Fatalf("failed to locate element %v %v", selector, err)
    s.Err = err
    return
  }

  log.Printf("clicking %v", selector)
  if err := elem.Click(); err != nil {
    log.Fatalf("failed to click element %v %v", selector, err)
    s.Err = err
    return
  }
}

func (s *Scraper) SwitchFrame(selector string) {
  if s.Err != nil {
    return
  }

  elem, err := s.FindElement(selector)
  if err != nil {
    log.Fatalf("failed to locate element %v %v", selector, err)
    s.Err = err
    return
  }

  if err := s.SeleniumDriver.SwitchFrame(elem); err != nil {
    log.Fatalf("failed to switch to frame %v %v", selector, err)
    s.Err = err
    return
  }
}

func (s *Scraper) RootFrame() {
  if s.Err != nil {
    return
  }

  if err := s.SeleniumDriver.SwitchFrame(nil); err != nil {
    log.Fatalf("failed to switch to root frame %v", err)
    s.Err = err
    return
  }
}

func (s *Scraper) WaitForElementE(selector string) error {
  if s.Err != nil {
    return fmt.Errorf("scraper in errored state %v", s.Err)
  }

  cond := func(d selenium.WebDriver) (bool, error) {
    if _, err := d.FindElement(selenium.ByCSSSelector, selector); err != nil {
      return false, nil
    }
    return true, nil
  }

  log.Printf("waiting for element %v", selector)
  if err := s.SeleniumDriver.WaitWithTimeoutAndInterval(cond, timeout, interval); err != nil {
    log.Fatalf("failed to wait for element %v %v", selector, err)
    return err
  }
  return nil
}

func (s *Scraper) WaitForElementDisappearE(selector string) error {
  if s.Err != nil {
    return fmt.Errorf("scraper in errored state %v", s.Err)
  }

  cond := func(d selenium.WebDriver) (bool, error) {
    if _, err := d.FindElement(selenium.ByCSSSelector, selector); err != nil {
      return true, nil
    }
    return false, nil
  }

  log.Printf("waiting for element to disappear %v", selector)
  if err := s.SeleniumDriver.WaitWithTimeoutAndInterval(cond, timeout, interval); err != nil {
    log.Fatalf("failed to wait for element to disappear %v %v", selector, err)
    return err
  }
  return nil
}

func (s *Scraper) WaitForElement(selector string) {
  if s.Err != nil {
    return
  }

  if err := s.WaitForElementE(selector); err != nil {
    s.Err = err
  }
}

func (s *Scraper) Text(selector string) (string, error) {
  if s.Err != nil {
    return "", fmt.Errorf("scraper in errored state %v", s.Err)
  }

  time.Sleep(interval)

  elem, err := s.SeleniumDriver.FindElement(selenium.ByCSSSelector, selector)
  if err != nil {
    return "", err
  }

  text, err := elem.Text()
  if err != nil {
    return "", err
  }

  return text, nil
}

func (s *Scraper) WaitForElementText(selector string) error {
  if s.Err != nil {
    return fmt.Errorf("scraper in errored state %v", s.Err)
  }

  cond := func(d selenium.WebDriver) (bool, error) {
    text, err := s.Text(selector)
    if err != nil {
      return false, nil
    }
    return strings.TrimSpace(text) != "", nil
  }

  log.Printf("waiting for element to contain text %v", selector)
  if err := s.SeleniumDriver.WaitWithTimeoutAndInterval(cond, timeout, interval); err != nil {
    log.Fatalf("failed to wait for element to contain text %v %v", selector, err)
    return err
  }
  return nil
}
