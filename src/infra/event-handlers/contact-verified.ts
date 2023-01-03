import { Observer } from '@/domain/events'
import { Mailer } from '@/domain/contracts/gateways'
import { ContactVerifiedEvent } from '@/domain/events/user'

export class ContactVerifiedHandler extends Observer {
  public constructor(private readonly mailer: Mailer) {
    super({ domainEvents: ['CONTACT_VERIFIED'] })
  }

  public async handle({ user, contact }: ContactVerifiedEvent): Promise<void> {
    await this.mailer.sendWithTemplate({
      recipient: {
        name: user.account.name.value,
        email: user.account.getPrimaryEmail().value.address,
      },
      template: {
        code: 'CONTACT_VERIFIED',
        data: {
          userName: user.account.name.value,
          contact: contact.getFormattedValue(),
        },
      },
    })
  }
}
