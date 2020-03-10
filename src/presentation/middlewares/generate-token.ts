import { JWT } from '../../lib/JWT'
import { boom } from '@expresso/errors'
import { Request, Response, NextFunction } from 'express'
import { User } from '../../data/repositories/UserRepository'

declare global {
  namespace Express {
    interface Request {
      token?: string
    }
  }
}

export const factory = (jwt: JWT) => async (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) return next(boom.unauthorized('no user in request'))
  const token = await jwt.signUser(req.user as User)

  req.token = token
  next()
}

export default { factory }
