import { Permission } from '@/domain/entities/permission'

export class BasePermission extends Permission {
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
    super({ id, code, read, write, owner, name, description, moduleId, expiration })
  }

  public override equals(other: BasePermission): boolean {
    return this.code === other.code
  }
}
