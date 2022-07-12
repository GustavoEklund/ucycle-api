import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadUserPermission, SaveUserPermission } from '@/domain/contracts/repos'
import { PgModule, PgOrganization, PgUser, PgUserPermission } from '@/infra/repos/postgres/entities'
import { PermissionStatus, UserPermission } from '@/domain/entities/permission'

export class PgUserPermissionRepository
  extends PgRepository
  implements SaveUserPermission, LoadUserPermission
{
  public async save(input: SaveUserPermission.Input): Promise<SaveUserPermission.Output> {
    const createdByPgUser = await this.getRepository(PgUser).findOneOrFail(input.grantByUserId)
    const grantToPgUser = await this.getRepository(PgUser).findOneOrFail(input.grantToUserId)
    const grantAtPgOrganization = await this.getRepository(PgOrganization).findOneOrFail(
      input.grantAtOrganizationId
    )
    const pgModule = await this.getRepository(PgModule).findOneOrFail(input.moduleId)
    await this.getRepository(PgUserPermission).save({
      id: input.id,
      code: input.code.value,
      name: input.name,
      description: input.description,
      read: input.read,
      write: input.write,
      owner: input.owner,
      status: PermissionStatus.GRANTED,
      createdBy: createdByPgUser,
      grantToUser: grantToPgUser,
      grantAtOrganization: grantAtPgOrganization,
      module: pgModule,
      expiresAt: input.expiration,
    })
  }

  public async load({ id }: LoadUserPermission.Input): Promise<LoadUserPermission.Output> {
    const pgUserPermission = await this.getRepository(PgUserPermission).findOne(id, {
      relations: ['createdBy', 'grantToUser', 'grantAtOrganization', 'module'],
    })
    if (pgUserPermission === undefined) return undefined
    return new UserPermission({
      id: pgUserPermission.id,
      code: pgUserPermission.code,
      name: pgUserPermission.name,
      description: pgUserPermission?.description || '',
      read: pgUserPermission.read,
      write: pgUserPermission.write,
      owner: pgUserPermission.owner,
      grantToUserId: pgUserPermission.grantToUser.id,
      grantByUserId: pgUserPermission.createdBy.id,
      grantAtOrganizationId: pgUserPermission.grantAtOrganization.id,
      moduleId: pgUserPermission.module.id,
      expiration: pgUserPermission.expiresAt,
    })
  }
}
