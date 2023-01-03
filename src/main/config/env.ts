import { config as loadDotEnv } from 'dotenv'
import { ConnectionOptions } from 'typeorm'

loadDotEnv()

const srcDir = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'
const sevenDaysInMilliseconds = 7 * 24 * 60 * 60 * 1000

export const env = {
  server: {
    devMode: process.env.TS_NODE_DEV !== undefined,
    port: process.env.PORT ?? 3000,
    healthCheck: {
      enabled: Number(process.env.HEALTH_CHECK_ENABLED) === 1,
    },
    mainWebsiteUrl: process.env.MAIN_WEBSITE_URL ?? 'https://ucycle.com.br',
  },
  session: {
    secret: process.env.SESSION_SECRET ?? '',
    cookie: {
      maxAge: sevenDaysInMilliseconds,
    },
  },
  keycloak: {
    realm: process.env.KEYCLOAK_REALM ?? 'ucycle-app-development',
    authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL ?? 'http://localhost:8080/auth',
    clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'ucycle-api',
    protectClientId: process.env.KEYCLOAK_PROTECT_CLIENT_ID ?? 'ucycle-app-mobile',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
    realmPublicKey: process.env.KEYCLOAK_REALM_PUBLIC_KEY ?? '',
  },
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '',
    accessToken: process.env.FB_ACCESS_TOKEN ?? '',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY ?? '',
    sender: {
      email: process.env.SENDGRID_SENDER_EMAIL ?? '',
      name: process.env.SENDGRID_SENDER_NAME ?? '',
    },
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID ?? '',
    serviceSid: process.env.TWILIO_SERVICE_SID ?? '',
    authToken: process.env.TWILIO_AUTH_TOKEN ?? '',
  },
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY ?? '',
    secret: process.env.AWS_S3_SECRET ?? '',
    bucket: process.env.AWS_S3_BUCKET ?? '',
  },
  kafka: {
    clientId: process.env.KAFKA_CLIENT_ID ?? '',
    groupId: process.env.KAFKA_GROUP_ID ?? '',
    brokers: (process.env.KAFKA_BROKER_LIST ?? '').replace(' ', '').split(','),
  },
  typeorm: {
    name: 'default',
    type: process.env.TYPEORM_CONNECTION ?? 'postgres',
    host: process.env.TYPEORM_HOST ?? 'postgres-database',
    port: Number(process.env.TYPEORM_PORT ?? 5432),
    username: process.env.TYPEORM_USERNAME ?? 'postgres',
    password: process.env.TYPEORM_PASSWORD ?? 'postgres',
    database: process.env.TYPEORM_DATABASE ?? 'ucycle_app',
    entities: [`${srcDir}/infra/repos/postgres/entities/index.{js,ts}`],
    migrations: [`${srcDir}/infra/repos/postgres/migrations/*.{js,ts}`],
    migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME ?? 'migrations',
    cli: {
      entitiesDir: `${srcDir}/infra/repos/postgres/entities`,
      migrationsDir: `${srcDir}/infra/repos/postgres/migrations`,
    },
  } as ConnectionOptions,
  jwtSecret: process.env.JWT_SECRET ?? 'any_secret',
}
