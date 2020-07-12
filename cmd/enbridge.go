package cmd

import (
  "github.com/spf13/cobra"
  "github.com/zylphrex/drakma/scraper/enbridge"
)

var enbridgeCmd = &cobra.Command{
  Use:   "enbridge",
  Short: "Start Enbridge Gas tasks",
  Long:  "The series of tasks defined are Enbridge Gas specific.",
  Run: func(cmd *cobra.Command, args []string) {
    enbridge.Run()
  },
}

var taskStrs []string

func init() {
  enbridgeCmd.Flags().StringSliceVarP(
    &taskStrs,
    "task",
    "t",
    []string{},
    "Define the tasks to run.",
  );

  rootCmd.AddCommand(enbridgeCmd)
}
