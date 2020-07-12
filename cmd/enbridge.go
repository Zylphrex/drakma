package cmd

import (
  "github.com/spf13/cobra"
  "github.com/zylphrex/drakma-cli/scraper/enbridge"
)

var enbridgeCmd = &cobra.Command{
  Use:   "enbridge",
  Short: "Start Enbridge Gas tasks",
  Long:  "The series of tasks defined are Enbridge Gas specific.",
  Run: func(cmd *cobra.Command, args []string) {
    EnbridgeOpts.ScraperOptions = GlobalOpts
    enbridge.Run(&EnbridgeOpts)
  },
}

var EnbridgeOpts enbridge.EnbridgeScraperOptions

func init() {
  enbridgeCmd.Flags().StringVar(&EnbridgeOpts.Username, "username", "", "The Enbridge Gas username")
  enbridgeCmd.MarkFlagRequired("username")

  enbridgeCmd.Flags().StringVar(&EnbridgeOpts.Password, "password", "", "The Enbridge Gas password")
  enbridgeCmd.MarkFlagRequired("password")

  rootCmd.AddCommand(enbridgeCmd)
}
