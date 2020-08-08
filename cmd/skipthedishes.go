package cmd

import (
  "log"
  "time"
  "github.com/spf13/cobra"
  "github.com/zylphrex/drakma-cli/scraper/skipthedishes"
)


const dateFormat = "2006-01-02"

func Today() time.Time {
  loc, _ := time.LoadLocation("America/Toronto")
  now := time.Now()
  today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, loc)
  return today
}

var skipTheDishesCmd = &cobra.Command{
  Use:   "skipthedishes",
  Short: "Start Skip the Dishes tasks",
  Long:  "The series of tasks defined are Skip the Dishes specific.",
  Run: func(cmd *cobra.Command, args []string) {
    startDate, err := time.Parse(dateFormat, start)
    if err != nil {
      log.Fatalf("Unable to parse start date: %v", start)
    }

    endDate, err := time.Parse(dateFormat, end)
    if err != nil {
      log.Fatalf("Unable to parse end date: %v", end)
    }

    if startDate.After(endDate) {
      log.Fatalf("Unable to parse dates, start date (%v) must be before end date (%v)", startDate, endDate)
    }

    SkipTheDishesOpts.ScraperOptions = GlobalOpts
    SkipTheDishesOpts.StartDate = startDate
    SkipTheDishesOpts.EndDate = endDate
    err = skipthedishes.Run(&SkipTheDishesOpts)
    if err != nil {
      log.Fatal(err)
    }
  },
}

var SkipTheDishesOpts skipthedishes.SkipTheDishesOptions

var start, end string

func init() {
  skipTheDishesCmd.Flags().StringVar(&SkipTheDishesOpts.Username, "username", "", "The Skip The Dishes username")
  skipTheDishesCmd.MarkFlagRequired("username")

  skipTheDishesCmd.Flags().StringVar(&SkipTheDishesOpts.Password, "password", "", "The Skip The Dishes password")
  skipTheDishesCmd.MarkFlagRequired("password")

  today := Today()
  weekAgo := today.AddDate(0, 0, -7)
  skipTheDishesCmd.Flags().StringVar(&start, "start", weekAgo.Format(dateFormat), "The start date of the reports")
  skipTheDishesCmd.Flags().StringVar(&end, "end", today.Format(dateFormat), "The end date of the reports")

  rootCmd.AddCommand(skipTheDishesCmd)
}
