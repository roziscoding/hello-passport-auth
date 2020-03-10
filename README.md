Hello, passport auth!
========

# What is it
Simple PoC to demonstrate authentication using Facebook and Telegram Login through Passport.js.

# How to run it
The first thing you'll need is an authorization token to communicate with Telegram's bot API. You can get it from [BotFather](https://t.me/botfather). Also, you need to link your bot to the deployed domain of this application using BotFather. [Telegram Documentation](https://core.telegram.org/widgets/login) on the Login Widget has more info.

For Facebook, you'll need to go to developers.facebook.com and register an app. From there, you should get your app's Client ID and Client Secret.

Once you're all set up, choose one of the methods below and follow the instructions.

## Locally
- Clone this repo and cd into it
- Run `npm install`
- Run `npm run build`
- Set all environment variables described in the [sample envs file](.envrc.sample)
- Run `npm start`

## Using Docker
- Clone this repo and cd into it
- Run `docker build . -t IMAGE_TAG` replacing IMAGE_TAG with the desired local tag for this image
- Set all environment variables described in the [sample envs file](.envrc.sample)
- Run `docker run` command mapping the environment variables

## On Heroku

Just click the button below, set the envs and that's it.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

# Contributing
See [this](CONTRIBUTING.md)
