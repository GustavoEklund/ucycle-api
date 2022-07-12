import { Permission } from '@/domain/entities/permission/permission'

export enum PermissionStatus {
  GRANTED = 'GRANTED',
  REVOKED = 'REVOKED',
}

export class UserPermission extends Permission {
  public readonly grantToUserId: string
  public readonly grantByUserId: string
  public readonly grantAtOrganizationId: string

  public constructor({
    id,
    code,
    read,
    write,
    owner,
    name,
    description,
    moduleId,
    expiration,
    grantToUserId,
    grantByUserId,
    grantAtOrganizationId,
  }: {
    id: string
    code: string
    read: boolean
    write: boolean
    owner: boolean
    name: string
    description: string
    moduleId: string
    expiration?: Date
    grantToUserId: string
    grantByUserId: string
    grantAtOrganizationId: string
  }) {
    super({ id, code, read, write, owner, name, description, moduleId, expiration })
    this.grantToUserId = grantToUserId
    this.grantByUserId = grantByUserId
    this.grantAtOrganizationId = grantAtOrganizationId
    this._status = PermissionStatus.GRANTED
  }

  private _status: PermissionStatus

  public get status(): PermissionStatus {
    return this._status
  }

  public revoke(): void {
    this._status = PermissionStatus.REVOKED
  }
}
