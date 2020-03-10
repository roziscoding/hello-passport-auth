import { PassportStatic } from 'passport'
import { Strategy } from 'passport-facebook'
import { AppConfig } from '../../../../app.config'
import { UserRepository } from '../../../../data/repositories/UserRepository'

export function configure (passport: PassportStatic, config: AppConfig['auth']['facebook'], repository: UserRepository) {
  passport.use(new Strategy({
    clientID: config.clientId,
    clientSecret: config.clientSecret,
    callbackURL: config.callbackUrl
  }, (_accessToken, _refreshToken, profile, done) => {
    const user = repository.findByExternalId('facebook', `${profile.id}`)

    if (!user) {
      return done(null, false, profile)
    }

    return done(null, user)
  }))
}

export default { configure }
