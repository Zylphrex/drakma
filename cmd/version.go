package cmd

import (
  "fmt"
  "github.com/spf13/cobra"
)

var versionCmd = &cobra.Command{
  Use:   "version",
  Short: "Print drakma version",
  Long:  "Print the version of the current drakma installation",
  Run: func(cmd *cobra.Command, args []string) {
    fmt.Println("drakma version 0.0.1")
  },
}

func init() {
  rootCmd.AddCommand(versionCmd)
}
