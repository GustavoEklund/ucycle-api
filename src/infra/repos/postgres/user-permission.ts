import { PgRepository } from '@/infra/repos/postgres/repository'
import { SaveUserPermission } from '@/domain/contracts/repos'
import { PgModule, PgOrganization, PgUser, PgUserPermission } from '@/infra/repos/postgres/entities'
import { PermissionStatus } from '@/domain/entities/permission'

export class PgUserPermissionRepository extends PgRepository implements SaveUserPermission {
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
}
