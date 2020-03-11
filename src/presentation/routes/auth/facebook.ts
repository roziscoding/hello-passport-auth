import queryString from 'querystring'
import { PassportStatic } from 'passport'
import { Profile } from 'passport-facebook'
import { Request, Response, NextFunction } from 'express'

function normalize (name: string): string {
  const names = name.split(' ')

  if (names.length > 1) return `${normalize(names[0])}.${normalize(names[1])}`

  return name.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function factory (passport: PassportStatic) {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('facebook', { session: false }, (err, user, profile: Profile) => {
      if (err) return next(err)
      if (user) {
        return req.logIn(user, { session: false }, (err) => {
          if (err) return next(err)
          return res.redirect('/success')
        })
      }

      const newQuery = queryString.stringify({
        name: profile.displayName,
        username: profile.username || `${normalize(profile.displayName)}`,
        externalId: profile.id,
        externalIdSource: 'facebook'
      })

      res.redirect(`/sign-up?${newQuery}`)
    })(req, res, next)
  }
}

export default { factory }
