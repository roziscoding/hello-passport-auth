import env from 'sugar-env'
import { JWTInitializationParams } from './lib/JWT'
import { IExpressoConfigOptions } from '@expresso/app'

export type AppConfig = IExpressoConfigOptions & {
  publicUrl: string
  auth: {
    facebook: {
      clientId: string
      clientSecret: string
      callbackUrl: string
    }
    jwt: JWTInitializationParams
    telegram: {
      token: string
      botUsername: string
      redirectUrl: string
    }
  }
}

const publicUrl = env.get('PUBLIC_URL', 'http://local.lv.me')

export const config: AppConfig = {
  name: 'hello-passport-auth',
  publicUrl,
  auth: {
    facebook: {
      clientId: env.get('AUTH_FACEBOOK_CLIENTID', ''),
      clientSecret: env.get('AUTH_FACEBOOK_CLIENTSECRET', ''),
      callbackUrl: `${publicUrl}/auth/facebook/callback`
    },
    jwt: {
      secret: env.get('JWT_SECRET', ''),
      audience: env.get('JWT_AUDIENCE', 'hello-passport-auth'),
      expiration: env.get('JWT_EXPIRATION', '1d'),
      issuer: env.get('JWT_ISSUER', 'hello-passport-auth')
    },
    telegram: {
      token: env.get('AUTH_TELEGRAM_TOKEN', ''),
      botUsername: env.get('AUTH_TELEGRAM_BOTUSERNAME', ''),
      redirectUrl: `${publicUrl}/auth/telegram/callback`
    }
  }
}
