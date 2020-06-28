package bot

import (
  "fmt"
  "github.com/tebeka/selenium"
)

func WithDriver(
  fn func(driver selenium.WebDriver) error,
  driverOptions DriverOptions,
) error {
  selenium.SetDebug(driverOptions.debug)

  opts := []selenium.ServiceOption{}
  opts = append(
    opts,
    selenium.GeckoDriver(driverOptions.geckoDriverPath),
  )

	service, err := selenium.NewSeleniumService(
    driverOptions.seleniumPath,
    driverOptions.port,
    opts...,
  )
  if err != nil {
    return err
  }
  defer service.Stop()

  // Connect to the WebDriver instance running locally.
  caps := selenium.Capabilities{"browserName": "firefox"}
  seleniumUrl := fmt.Sprintf(
    "http://localhost:%d/wd/hub",
    driverOptions.port,
  )
  driver, err := selenium.NewRemote(caps, seleniumUrl)
  if err != nil {
    return err
  }
  defer driver.Quit()

  return fn(driver)
}
