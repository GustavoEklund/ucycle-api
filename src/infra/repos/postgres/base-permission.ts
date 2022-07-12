import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadBasePermission } from '@/domain/contracts/repos'
import { PgBasePermission } from '@/infra/repos/postgres/entities'
import { BasePermission } from '@/domain/entities/permission'

export class PgBasePermissionRepository extends PgRepository implements LoadBasePermission {
  public async load({ code }: LoadBasePermission.Input): Promise<LoadBasePermission.Output> {
    const pgBasePermissionRepo = this.getRepository(PgBasePermission)
    const pgPermission = await pgBasePermissionRepo.findOne({ code }, { relations: ['module'] })
    if (pgPermission === undefined) return undefined
    return new BasePermission({
      id: pgPermission.id,
      code: pgPermission.code,
      read: pgPermission.read,
      write: pgPermission.write,
      owner: pgPermission.owner,
      name: pgPermission.name,
      description: pgPermission.description ?? '',
      moduleId: pgPermission.module.id,
      expiration: pgPermission.expiresAt,
    })
  }
}
