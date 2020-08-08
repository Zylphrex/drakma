package skipthedishes

import (
  "fmt"
  "log"
  "time"
  "github.com/zylphrex/drakma-cli/scraper"
)

const skipTheDishesUrl = "https://restaurant.skipthedishes.com/"

type SkipTheDishesOptions struct {
  ScraperOptions scraper.ScraperOptions
  Username string
  Password string
  StartDate time.Time
  EndDate time.Time
}

type SkipTheDishesScraper struct {
  scraper.Scraper
}

func (s *SkipTheDishesScraper) Home() {
  log.Printf("going to to home page")
  s.Visit(skipTheDishesUrl)
}

func (s *SkipTheDishesScraper) Login(username, password string) {
  s.Home()
  log.Printf("typing credentials")
  s.Type("#email", username)
  s.Type("#password", password)
  log.Printf("logging in")
  s.Click("button[type=\"submit\"]")
  s.dismissModal()
  log.Printf("waiting for home page load")
  s.WaitForElement("span.subtitle")
}

func (s *SkipTheDishesScraper) DownloadWeeklyReport(index int) string {
  downloadDir, err := scraper.GetDownloadDir()
  if err != nil {
    s.Err = err
    return ""
  }

  before, err := scraper.ListFileNames(downloadDir)
  if err != nil {
    s.Err = err
    return ""
  }

  selector := fmt.Sprintf("#statement-navigator-body ul li:nth-child(%v)", index)
  s.Click(selector)
  s.Click("div[data-testid=\"wrapper-statementdetails\"] > div > a:nth-child(1)")

  after, err := scraper.ListFileNames(downloadDir)
  if err != nil {
    s.Err = err
    return ""
  }

  files := scraper.Diff(before, after)
  if len(files) != 1 {
    s.Err = fmt.Errorf("unable to detect downloaded file in %v", files)
  }

  return fmt.Sprintf("%v/%v", downloadDir, files[0])
}

func (s *SkipTheDishesScraper) DownloadWeeklyReports(start, end time.Time) []string {
  elements, err := s.FindElements("#statement-navigator-body ul li")
  if err != nil {
    s.Err = err
    return []string{}
  }

  curLen := len(elements)

  dateFormat := "Jan 2, 2006"

  files := []string{}

  for i := 1; i <= curLen; i++ {
    selector := fmt.Sprintf("#statement-navigator-body ul li:nth-child(%v) > div > div:nth-child(1)", i)

    dateString, err := s.Text(selector)
    if err != nil {
      s.Err = err
      return []string{}
    }

    date, err := time.Parse(dateFormat, dateString)
    if err != nil {
      s.Err = err
      return []string{}
    }

    if start.After(date) || date.After(end) {
      continue
    }

    file := s.DownloadWeeklyReport(i)
    if s.Err != nil {
      return []string{}
    }

    files = append(files, file)
  }

  return files
}

func (s *SkipTheDishesScraper) ScrollReportsIntoView(start time.Time) {
  s.Click("a[data-testid=\"menu-earnings\"]")
  s.Click("li[data-testid=\"weekly-tab\"]")
  s.Click("#statement-navigator-body ul li:nth-child(1)")

  prevLen, curLen := -1, 0
  dateFormat := "Jan 2, 2006"
  for prevLen != curLen {
    elements, err := s.FindElements("#statement-navigator-body ul li")
    if err != nil {
      s.Err = err
      return
    }

    prevLen = curLen
    curLen = len(elements)

    base := "#statement-navigator-body ul li"
    selector := fmt.Sprintf("%v:nth-child(%v)", base, curLen)
    s.ScrollIntoView(selector)

    time.Sleep(3 * time.Second)

    selector = fmt.Sprintf("%v > div > div:nth-child(1)", selector)
    dateString, err := s.Text(selector)
    if err != nil {
      s.Err = err
      return
    }

    date, err := time.Parse(dateFormat, dateString)
    if err != nil {
      s.Err = err
      return
    }

    if start.After(date) {
      break
    }
  }
}

func (s* SkipTheDishesScraper) dismissModal() {
  log.Printf("waiting for modal load")
  if err := s.WaitForElementE("div[data-testid=\"modal-close-button\"]"); err == nil {
    log.Printf("dismissing modal")
    // sometimes it takes a while for it to be clickable
    // so lets wait a while
    time.Sleep(3 * time.Second)
    s.Click("div[data-testid=\"modal-close-button\"]")
  } else {
    log.Printf("no notifications found")
  }
}
