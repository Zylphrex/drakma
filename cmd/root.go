package cmd

import (
  "github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
  Use:   "drakma",
  Short: "A web crawler to scrape data for Drakma",
  Long: "Drakma is a web crawler to scrape data from various source for the Drakma web application.",
}

func Execute() error {
  return rootCmd.Execute()
}
