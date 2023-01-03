import { Observer } from '@/domain/events'
import { RequestContactVerification } from '@/domain/contracts/gateways'
import { UserSignedUpEvent } from '@/domain/events/user'

export class UserSignedUpHandler extends Observer {
  public constructor(private readonly contactGateway: RequestContactVerification) {
    super({ domainEvents: ['USER_SIGNED_UP'] })
  }

  public async handle({ user }: UserSignedUpEvent): Promise<void> {
    const primaryPhoneNumber = user.account.getPrimaryPhone()
    await this.contactGateway.requestVerification(primaryPhoneNumber)
  }
}
