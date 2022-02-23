import { config as loadDotEnv } from 'dotenv'

loadDotEnv()

export const env = {
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '',
    accessToken: process.env.FB_ACCESS_TOKEN ?? '',
  },
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY ?? '',
    secret: process.env.AWS_S3_SECRET ?? '',
    bucket: process.env.AWS_S3_BUCKET ?? '',
  },
  port: process.env.PORT ?? 8080,
  jwtSecret: process.env.JWT_SECRET ?? '',

  session: {
    secret: process.env.SESSION_SECRET ?? '',
    cookie: {
      maxAge: process.env.SESSION_COOKIE_MAX_AGE ?? 3600,
    },
  },
  server: {
    devMode: process.env.SERVER_DEV_MODE ?? true,
  },

  keycloak: {
    realm: process.env.KEYCLOAK_REALM ?? '',
    authServerUrl: process.env.KEYCLOAK_AUTH_SERVER ?? '',
    clientId: process.env.KEYCLOAK_CLIENT_ID ?? '',
  },
}
