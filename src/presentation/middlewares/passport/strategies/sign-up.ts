import { Request } from 'express'
import { PassportStatic } from 'passport'
import { Strategy } from 'passport-custom'
import { UserRepository } from '../../../../data/repositories/UserRepository'
import { boom } from '@expresso/errors'

export function configure (passport: PassportStatic, repository: UserRepository) {
  passport.use('sign-up', new Strategy(async (req: Request, done) => {
    const { name, username, password, externalIds = {} } = req.body

    if (!name || !username || !password) return done(boom.badData('missing fields'), false)

    const user = await repository.create(name, username, password, externalIds)

    return done(null, user)
  }))
}

export default { configure }
