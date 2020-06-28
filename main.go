package main

import (
  "os"
  "github.com/zylphrex/drakmabot/bot"
  "github.com/zylphrex/drakmabot/bot/provider"
)

func main() {
  opts := bot.CreateOptions(
    os.Getenv("SELENIUM_PATH"),
    os.Getenv("GECKODRIVER_PATH"),
  )
  bot.WithDriver(provider.EnbridgeGas, opts)
}
