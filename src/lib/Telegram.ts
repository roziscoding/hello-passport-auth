import crypto from 'crypto'

export type TelegramAuthData = {
  id: string
  first_name: string
  username: string
  photo_url: string
  auth_date: string
  hash: string
}

function getValidationPayload (data: TelegramAuthData) {
  return Object.entries(data)
    .filter(([ key ]) => key !== 'hash')
    .sort(([ a ], [ b ]) => {
      if (a < b) { return -1 }
      if (a > b) { return 1 }
      return 0
    })
    .reduce((result, [ key, value ]) => {
      return result ? `${result}\n${key}=${value}` : `${key}=${value}`
    }, '')
}

export class TelegramLogin {
  private readonly secret: Buffer

  constructor (token: string) {
    this.secret = crypto.createHash('sha256').update(token).digest()
  }

  private getValidateHash (payload: string) {
    return crypto.createHmac('sha256', this.secret).update(payload).digest('hex')
  }

  validate (data: TelegramAuthData) {
    const validatePayload = getValidationPayload(data)
    const validateHash = this.getValidateHash(validatePayload)

    return validateHash === data.hash
  }
}
