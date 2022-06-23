import { PermissionCode } from '@/domain/entities/permission'
import { Entity } from '@/domain/entities'

export class Permission extends Entity {
  public readonly code: PermissionCode
  public readonly read: boolean
  public readonly write: boolean
  public readonly owner: boolean
  public readonly name: string
  public readonly description: string
  public readonly moduleId: string
  public readonly expiration?: Date

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
  }) {
    super({ id })
    this.code = new PermissionCode({ value: code })
    this.read = read
    this.write = write
    this.owner = owner
    this.name = name
    this.description = description
    this.moduleId = moduleId
    this.expiration = expiration
  }
}
