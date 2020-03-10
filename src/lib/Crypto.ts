import * as crypto from 'crypto'
import { promisify } from 'util'

const pbkdf2 = promisify(crypto.pbkdf2)

/**
 * @property salt - Salt to be used when encrypting
 * @property iterations - Iteration count to be used with pbkdf2
 * @property keylen - Passed to pbkdf2
 * @property digest - Passed to pbkdf2
 */
export type ICryptoInitializationParams = {
  salt: string | null
  iterations: number
  keylen: number
  digest: string
}

/**
 * Handles password encryption and validation
 */
export class Crypto {
  private readonly _salt: string | null
  private readonly _iterations: number
  private readonly _keylen: number
  private readonly _digest: string

  /**
   * @param config Crypto configuration
   */
  constructor ({ salt = null, iterations = 10000, keylen = 64, digest = 'sha512' }: Partial<ICryptoInitializationParams> = {}) {
    this._salt = salt
    this._iterations = iterations
    this._keylen = keylen
    this._digest = digest
  }

  get salt () {
    return this._salt || crypto.randomBytes(32).toString('base64')
  }

  /**
   * Encrypts a password using PBKDF2
   * Data encrypted with this cannot be decrypted
   * @param password - Password to be encrypted
   * @returns The encrypted password
   */
  async encrypt (password: string, givenSalt?: string): Promise<string> {
    const salt = givenSalt || this.salt
    return pbkdf2(password, salt, this._iterations, this._keylen, this._digest)
      .then(hash => hash.toString('hex'))
      .then(hash => givenSalt ? hash : `${hash}.${salt}`)
  }

  /**
   * Verifies a password against a hash
   * @param password - Password to be verified
   * @param hash - Encrypted password to verify against
   * @returns true if both passswords match false otherwise
   */
  async verify (password: string, hashedValue: string): Promise<boolean> {
    const [ hash, salt ] = hashedValue.split('.')
    return (await this.encrypt(password, salt)) === hash
  }
}
