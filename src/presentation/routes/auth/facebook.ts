import queryString from 'querystring'
import { PassportStatic } from 'passport'
import { Profile } from 'passport-facebook'
import { Request, Response, NextFunction } from 'express'

export function factory (passport: PassportStatic) {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('facebook', { session: false }, (err, user, profile: Profile) => {
      if (err) return next(err)
      if (user) return req.logIn(user as any, { session: false }, (err) => {
        if (err) return next(err)
        return res.redirect('/success')
      })

      const newQuery = queryString.stringify({
        name: profile.displayName,
        username: profile.username,
        externalId: profile.id,
        externalIdSource: 'facebook'
      })

      res.redirect(`/sign-up?${newQuery}`)
    })(req, res, next)
  }
}

export default { factory }
