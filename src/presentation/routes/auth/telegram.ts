import queryString from 'querystring'
import { PassportStatic } from 'passport'
import { TelegramAuthData } from '../../../lib/Telegram'
import { Request, Response, NextFunction } from 'express'

export function factory (passport: PassportStatic) {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('telegram', { session: false }, (err, user, info: TelegramAuthData) => {
      if (err) return next(err)
      if (user) return req.logIn(user as any, { session: false }, (err) => {
        if (err) return next(err)
        return res.redirect('/success')
      })

      const newQuery = queryString.stringify({
        name: info.first_name,
        username: info.username,
        externalId: info.id,
        externalIdSource: 'telegram'
      })

      res.redirect(`/sign-up?${newQuery}`)
    })(req, res, next)
  }
}

export default { factory }
