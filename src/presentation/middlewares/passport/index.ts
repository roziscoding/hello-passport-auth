import passport from 'passport'
import { Crypto } from '../../../lib/Crypto'
import { AppConfig } from '../../../app.config'
import { UserRepository } from '../../../data/repositories/UserRepository'
import strategies from './strategies'

export function factory (repository: UserRepository, crypto: Crypto, config: AppConfig['auth']) {
  strategies.signUp.configure(passport, repository)
  strategies.local.configure(passport, repository, crypto)
  strategies.facebook.configure(passport, config.facebook, repository)
  strategies.telegram.configure(passport, repository, config.telegram)

  return passport
}

export default { factory }
