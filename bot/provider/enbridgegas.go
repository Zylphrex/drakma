package provider

import (
  "fmt"
  "os"
  "github.com/tebeka/selenium"
  "github.com/zylphrex/drakmabot/bot"
)

const enbridgeGasUrl = "https://www.enbridgegas.com/"

func EnbridgeGas(driver selenium.WebDriver) error {
  if err := driver.Get(enbridgeGasUrl); err != nil {
    return err
  }

  if err := login(driver); err != nil {
    return err
  }


  balance, err := driver.FindElement(selenium.ByCSSSelector, "#headingOne > div.col-xs-12.col-sm-12.col-md-8 > div.account-balance-container > div.account-balance-details > h1 > b")
  if err != nil {
    return err
  }

  text, err := balance.Text()
  if err != nil {
    return err
  }

  fmt.Println(text);
  return nil
}

func login(driver selenium.WebDriver) error {
  usernameInput, err := driver.FindElement(selenium.ByCSSSelector, "#signin-username3")
  if err != nil {
    return err
  }

  if err := usernameInput.SendKeys(os.Getenv("ENBRIDGE_GAS_USERNAME")); err != nil {
    return err
  }

  passwordInput, err := driver.FindElement(selenium.ByCSSSelector, "#signin-password3")
  if err != nil {
    return err
  }

  if err := passwordInput.SendKeys(os.Getenv("ENBRIDGE_GAS_PASSWORD")); err != nil {
    return err
  }

  loginButton, err := driver.FindElement(selenium.ByCSSSelector, "#back-to-top > div.main > div > div > div > div > div > div.padding-all > div > div:nth-child(3) > div > div > form > button")
  if err != nil {
    return err
  }

  if err := loginButton.Click(); err != nil {
    return err
  }

  if err := dismissDowntimeNotification(driver); err != nil {
    return err
  }

  return nil
}

func dismissDowntimeNotification(driver selenium.WebDriver) error {
  cond := func(driver selenium.WebDriver) (bool, error) {
    if _, err := driver.FindElement(selenium.ByCSSSelector, "#cancelNotification"); err != nil {
      return false, nil
    }
    return true, nil
  }

  if err := driver.WaitWithTimeoutAndInterval(cond, bot.WaitInterval, bot.Timeout); err != nil {
    // if it timesout, maybe this page was removed already
    return nil
  }

  cancelNotificationButton, err := driver.FindElement(selenium.ByCSSSelector, "#cancelNotification")
  if err != nil {
    return err
  }

  if err := cancelNotificationButton.Click(); err != nil {
    return err
  }

  return nil
}
