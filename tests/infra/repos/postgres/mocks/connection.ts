import { PgConnection } from '@/infra/repos/postgres/helpers'

import { DataType, IMemoryDb, newDb } from 'pg-mem'
import { randomUUID } from 'crypto'

export const makeFakeDb = async (entities?: any[]): Promise<IMemoryDb> => {
  const db = newDb()
  const connection = await db.adapters.createTypeormConnection({
    type: 'postgres',
    entities: entities ?? ['src/infra/repos/postgres/entities/index.ts'],
  })
  db.public.registerFunction({
    name: 'uuid_generate_v4',
    returns: DataType.uuid,
    implementation: () => randomUUID(),
    impure: true,
  })
  await connection.synchronize()
  await PgConnection.getInstance().connect()
  return db
}
