import { DomainEvent } from '@/domain/events'
import { User } from '@/domain/entities/user'
import { UserPermission } from '@/domain/entities/permission'

export class PermissionGranted extends DomainEvent {
  private grantTo: User
  private permission: UserPermission

  public constructor({ grantTo, permission }: { grantTo: User; permission: UserPermission }) {
    super({ name: 'PERMISSION_GRANTED' })
    this.grantTo = grantTo
    this.permission = permission
  }
}
