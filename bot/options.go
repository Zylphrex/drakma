package bot

import (
  "time"
)

type DriverOptions struct {
  port int
  seleniumPath string
  geckoDriverPath string
  debug bool
}

func CreateOptions(
  seleniumPath string,
  geckoDriverPath string,
) DriverOptions {
  return DriverOptions{
    8080,
    seleniumPath,
    geckoDriverPath,
    false,
  }
}

const WaitInterval = 100 * time.Millisecond

const Timeout = 10 * time.Second
