package scraper

import (
  "io/ioutil"
  "os"
)

func GetDownloadDir() (string, error) {
  home, err := os.UserHomeDir()
  if err != nil {
    return "", err
  }
  return home + "/Downloads/", nil
}

func ListFileNames(directory string) ([]string, error) {
  names := []string{}

  files, err := ioutil.ReadDir(directory)
  if err != nil {
    return names, err
  }

  for _, file := range files {
    names = append(names, file.Name())
  }

  return names, nil
}

func Diff(before, after []string) []string {
  exists := make(map[string]bool)
  for _, x := range before {
    exists[x] = true
  }

  difference := []string{}

  for _, x := range after {
    if _, ok := exists[x]; !ok {
      difference = append(difference, x)
    }
  }

  return difference
}
