import { PgConnection } from '@/infra/repos/postgres/helpers'

import { EntityManager, ObjectType, Repository } from 'typeorm'

export abstract class PgRepository {
  public constructor(private readonly connection: PgConnection = PgConnection.getInstance()) {}

  public getRepository<Entity>(entity: ObjectType<Entity>): Repository<Entity> {
    return this.connection.getRepository(entity)
  }

  public getEntityManager(): EntityManager {
    return this.connection.getEntityManager()
  }
}
