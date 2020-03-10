import { Request } from 'express'
import { boom } from '@expresso/errors'
import { PassportStatic } from 'passport'
import { Strategy } from 'passport-custom'
import { AppConfig } from '../../../../app.config'
import { UserRepository } from '../../../../data/repositories/UserRepository'
import { TelegramLogin, TelegramAuthData } from '../../../../lib/Telegram'

export function configure (passport: PassportStatic, repository: UserRepository, config: AppConfig[ 'auth' ][ 'telegram' ]) {
  passport.use('telegram', new Strategy((req: Request, done) => {
    const telegramAuthData: TelegramAuthData = req.query
    const telegramLogin = new TelegramLogin(config.token)
    if (!telegramLogin.validate(telegramAuthData)) return done(boom.unauthorized('invalid telegram data'), false)

    const user = repository.findByExternalId('telegram', telegramAuthData.id)

    if (!user) return (done as any)(null, false, telegramAuthData)

    return done(null, user)
  }))
}

export default { configure }
