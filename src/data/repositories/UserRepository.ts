import ObjectId from 'bson-objectid'
import { Crypto } from '../../lib/Crypto'

export type User = {
  id: ObjectId
  name: string
  username: string
  passwordhash: string
  externalIds: Partial<{
    facebook: string
    telegram: string
  }>
}

export class UserRepository {
  private users: User[] = []

  constructor (
    private readonly crypto: Crypto
  ) { }

  findById (userId: string) {
    if (!ObjectId.isValid(userId)) return null

    return this.users.find(({ id }) => { id.toHexString() === userId }) ?? null
  }

  findByUsername (usernameToFind: string) {
    return this.users.find(({ username }) => username === usernameToFind) ?? null
  }

  findByExternalId (source: string, id: string) {
    function hasExternalId (user: User, source: string): source is keyof typeof user['externalIds'] {
      return source in user.externalIds
    }

    return this.users.find((user) => {
      return hasExternalId(user, source) && user.externalIds[source] === id
    }) ?? null
  }

  async create (name: string, username: string, password: string, externalIds: { [provider: string]: string }) {
    const id = new ObjectId()
    const passwordhash = await this.crypto.encrypt(password)

    const user = {
      id,
      name,
      username,
      passwordhash,
      externalIds
    }

    this.users.push(user)

    return user
  }

  getAll () {
    return this.users
  }
}
