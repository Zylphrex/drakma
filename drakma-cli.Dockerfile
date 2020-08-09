FROM golang:1.14.4-alpine3.12

ENV WORKDIR=/drakma

WORKDIR $WORKDIR

RUN apk add --no-cache openjdk8 firefox

COPY go.sum go.sum
COPY go.mod go.mod
COPY main.go main.go
COPY cmd cmd
COPY scraper scraper
RUN go get && go install

RUN mkdir bin
ADD https://selenium-release.storage.googleapis.com/3.141/selenium-server-standalone-3.141.59.jar bin/
# bug in gecko driver 0.26.0 https://github.com/mozilla/geckodriver/issues/1679
ADD https://github.com/mozilla/geckodriver/releases/download/v0.25.0/geckodriver-v0.25.0-linux64.tar.gz bin/
RUN cd bin && tar -xf geckodriver-v0.25.0-linux64.tar.gz

# this is the download folder that firefox writes to, lets make sure it exists
RUN mkdir /root/Downloads

ENV SELENIUM_PATH=$WORKDIR/bin/selenium-server-standalone-3.141.59.jar
ENV GECKO_DRIVER_PATH=$WORKDIR/bin/geckodriver
