import { ConnectionOptions } from 'typeorm'

export const config: ConnectionOptions = {
  type: 'postgres',
  host: 'kesavan.db.elephantsql.com',
  port: 5432,
  username: 'bduzqcwp',
  password: 'YvArdkpCuCDm9lpBxYNJ2qszJeB4H7bG',
  database: 'bduzqcwp',
  entities: ['dist/infra/db/postgres/entities/index.js']
}
