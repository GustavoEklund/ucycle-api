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
    mainWebsiteUrl: process.env.MAIN_WEBSITE ?? 'https://owlcondomine.com.br',
  },
  session: {
    secret: process.env.SESSION_SECRET ?? '',
    cookie: {
      maxAge: sevenDaysInMilliseconds,
    },
  },
  keycloak: {
    realm: process.env.KEYCLOAK_REALM ?? 'homologation',
    authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL ?? 'http://localhost:8080/auth',
    clientId: process.env.KEYCLOAK_CLIENT_ID ?? 'condo-api',
    protectClientId: process.env.KEYCLOAK_PROTECT_CLIENT_ID ?? 'condo-react-native',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? '',
  },
  facebookApi: {
    clientId: process.env.FB_CLIENT_ID ?? '',
    clientSecret: process.env.FB_CLIENT_SECRET ?? '',
    accessToken: process.env.FB_ACCESS_TOKEN ?? '',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_APIKEY ?? '',
    sender: {
      email: process.env.SENDGRID_SENDER_EMAIL ?? '',
      name: process.env.SENDGRID_SENDER_NAME ?? '',
    },
  },
  s3: {
    accessKey: process.env.AWS_S3_ACCESS_KEY ?? '',
    secret: process.env.AWS_S3_SECRET ?? '',
    bucket: process.env.AWS_S3_BUCKET ?? '',
  },
  jwtSecret: process.env.JWT_SECRET ?? 'any_secret',
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
    database: process.env.TYPEORM_DATABASE ?? 'condo_app',
    entities: [`${srcDir}/infra/repos/postgres/entities/index.{js,ts}`],
    migrations: [`${srcDir}/infra/repos/postgres/migrations/*.{js,ts}`],
    migrationsTableName: process.env.TYPEORM_MIGRATIONS_TABLE_NAME ?? 'migrations',
    cli: {
      entitiesDir: `${srcDir}/infra/repos/postgres/entities`,
      migrationsDir: `${srcDir}/infra/repos/postgres/migrations`,
    },
  } as ConnectionOptions,
}
