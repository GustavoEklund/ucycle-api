import { DomainEvent } from '@/domain/events'
import { User } from '@/domain/entities/user'

export class UserSignedUpEvent extends DomainEvent {
  public readonly user: User

  public constructor(input: { user: User; when?: Date }) {
    super({ name: 'USER_SIGNED_UP', when: input.when })
    this.user = input.user
  }
}
