import { boom } from '@expresso/errors'
import { PassportStatic } from 'passport'
import { Crypto } from '../../../../lib/Crypto'
import { Strategy } from 'passport-local'
import { UserRepository } from '../../../../data/repositories/UserRepository'

export function configure (passport: PassportStatic, repository: UserRepository, crypto: Crypto) {
  passport.use(new Strategy(async (username, password, done) => {
    const user = repository.findByUsername(username)

    if (!user) return done(boom.unauthorized(), false)

    if (!(await crypto.verify(password, user.passwordhash))) {
      return done(boom.unauthorized(), false)
    }

    return done(null, user)
  }))
}

export default { configure }
