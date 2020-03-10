import jwt from 'jsonwebtoken'
import { User } from '../data/repositories/UserRepository'

/**
 * @property salt - Salt to be used when encrypting
 * @property iterations - Iteration count to be used with pbkdf2
 * @property keylen - Passed to pbkdf2
 * @property digest - Passed to pbkdf2
 */
export type JWTInitializationParams = {
  secret: string
  audience: string
  expiration: string
  issuer: string
}

/**
 * Handles password encryption and validation
 */
export class JWT {
  private readonly secret: string
  private readonly audience: string
  private readonly expiration: string
  private readonly issuer: string

  /**
   * @param config Crypto configuration
   */
  constructor ({ secret, audience, expiration = '1d', issuer }: JWTInitializationParams) {
    this.secret = secret
    this.audience = audience
    this.expiration = expiration
    this.issuer = issuer
  }

  signPayload (payload: any, subject: string, ttl: string) {
    return jwt.sign(payload, this.secret, { audience: this.audience, expiresIn: ttl, issuer: this.issuer, subject })
  }

  signUser (data: User) {
    const { passwordhash, id, ...payload } = data
    const urn = `urn:user:${id}`
    return jwt.sign(payload, this.secret, { audience: this.audience, expiresIn: this.expiration, issuer: this.issuer, subject: urn })
  }

  verify (token: string) {
    return jwt.verify(token, this.secret, { audience: this.audience, issuer: this.issuer })
  }
}
