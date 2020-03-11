import rescue from 'express-rescue'
import { Request, Response, NextFunction } from 'express'
import { UserRepository, User, userToObject } from '../../../data/repositories/UserRepository'
import { boom } from '@expresso/errors'
import { JWT } from '../../../lib/JWT'

export function factory (repository: UserRepository, jwt: JWT) {
  return [
    rescue((req: Request, res: Response, next: NextFunction) => {
      const token = req.headers.authorization

      if (!token) return next(boom.unauthorized('no auth token provided!'))

      const payload = jwt.verify(token)

      if (typeof payload === 'string') return next(boom.unauthorized('invalid auth token'))

      const { sub } = payload as Omit<User, 'passwordHash' | 'id'> & { sub: string }

      const [ , , id ] = sub.split(':')

      if (!id) return next(boom.unauthorized('invalid auth token: sub claim has no id'))

      const user = repository.findById(id)

      if (!user) return next(boom.notFound(`no user found with id '${id}'`))

      res.json(userToObject(user))
    })
  ]
}

export default { factory }
