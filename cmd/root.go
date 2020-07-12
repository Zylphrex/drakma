package cmd

import (
  "os"
  "github.com/spf13/cobra"
  "github.com/zylphrex/drakma/scraper"
)

var rootCmd = &cobra.Command{
  Use:   "drakma",
  Short: "A web crawler to scrape data for Drakma",
  Long: "Drakma is a web crawler to scrape data from various source for the Drakma web application.",
}

func Execute() error {
  return rootCmd.Execute()
}

var GlobalOpts scraper.ScraperOptions

func init() {
  rootCmd.PersistentFlags().IntVar(&GlobalOpts.Port, "port", 8080, "Port to run the driver on.")

  rootCmd.PersistentFlags().BoolVar(&GlobalOpts.Headless, "headless", false, "Run driver headlessly.")

  rootCmd.PersistentFlags().StringVar(&GlobalOpts.SeleniumPath, "seleniumPath", os.Getenv("SELENIUM_PATH"), "The path to the selenium server jar.")

  rootCmd.PersistentFlags().StringVar(&GlobalOpts.GeckoDriverPath, "geckoDriverPath", os.Getenv("GECKO_DRIVER_PATH"), "The path to the geckodriver binary.")

  rootCmd.PersistentFlags().StringVar(&GlobalOpts.DrakmaUrl, "url", "", "The url to the Drakma server.")
  rootCmd.MarkPersistentFlagRequired("url")

  rootCmd.PersistentFlags().StringVar(&GlobalOpts.DrakmaAccount, "account", "", "The account on the Drakma server.")
  rootCmd.MarkPersistentFlagRequired("account")

  rootCmd.PersistentFlags().StringVar(&GlobalOpts.DrakmaToken, "token", "", "The token for the Drakma server.")
  rootCmd.MarkPersistentFlagRequired("token")
}
