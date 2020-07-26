package cmd

import (
  "log"
  "os"
  "github.com/spf13/cobra"
  "github.com/zylphrex/drakma-cli/scraper/rogers"
)

var rogersCmd = &cobra.Command{
  Use:   "rogers",
  Short: "Start Rogers tasks",
  Long:  "The series of tasks defined are Rogers specific.",
  Run: func(cmd *cobra.Command, args []string) {
    RogersOpts.ScraperOptions = GlobalOpts
    err := rogers.Run(&RogersOpts)
    if err != nil {
      log.Fatal(err)
      os.Exit(1)
    }
  },
}

var RogersOpts rogers.RogersScraperOptions

func init() {
  rogersCmd.Flags().StringVar(&RogersOpts.Username, "username", "", "The Enbridge Gas username")
  rogersCmd.MarkFlagRequired("username")

  rogersCmd.Flags().StringVar(&RogersOpts.Password, "password", "", "The Enbridge Gas password")
  rogersCmd.MarkFlagRequired("password")

  rootCmd.AddCommand(rogersCmd)
}
