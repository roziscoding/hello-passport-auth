import path from 'path'
import routes from './routes'
import { JWT } from '../lib/JWT'
import expresso from '@expresso/app'
import errors from '@expresso/errors'
import { Crypto } from '../lib/Crypto'
import middlewares from './middlewares'
import { AppConfig } from '../app.config'
import { Request, Response, static as serveStatic } from 'express'

import { UserRepository } from '../data/repositories/UserRepository'

export const app = expresso((app, config: AppConfig, environment) => {
  const crypto = new Crypto()
  const jwt = new JWT(config.auth.jwt)
  const userRepository = new UserRepository(crypto)

  const generateToken = middlewares.generateToken.factory(jwt)
  const sendToken = (req: Request, res: Response) => {
    res.json({
      token: req.token
    })
  }

  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))

  const passport = middlewares.passport.factory(userRepository, crypto, config.auth)
  app.use(passport.initialize())

  app.get('/login', (_, res) => {
    res.render('login', { botUsername: config.auth.telegram.botUsername, redirectUrl: config.auth.telegram.redirectUrl })
  })

  app.get('/sign-up', (_, res) => res.render('sign-up'))
  app.get('/success', (_, res) => res.render('success'))

  app.use(serveStatic(path.join(__dirname, 'views'), { cacheControl: false }))

  app.post('/sign-up', passport.authenticate('sign-up', { session: false }), generateToken, sendToken)
  app.post('/login', passport.authenticate('local', { session: false }), generateToken, sendToken)

  app.get([ '/auth/facebook/callback', '/auth/facebook' ], routes.auth.facebook.factory(passport, jwt))
  app.get('/auth/telegram/callback', routes.auth.telegram.factory(passport, jwt))

  app.get('/users', (_req, res) => {
    res.json(userRepository.getAll())
  })

  app.get('/me', routes.auth.getMe.factory(userRepository, jwt))

  app.get('*', (req, res, next) => {
    if (req.path !== '/login') return res.redirect('/login')
    next()
  })

  app.use(errors(environment))
})
