const rootDir = process.env.TS_NODE_DEV === undefined ? 'dist' : 'src'

module.exports = {
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  entities: [`${rootDir}/infra/repos/postgres/entities/index.{js,ts}`],
}
