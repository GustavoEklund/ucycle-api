import { Observer } from '@/domain/events'
import { ContactAddedEvent } from '@/domain/events/user'
import { RequestContactVerification } from '@/domain/contracts/gateways'
import { Email } from '@/domain/entities/contact'

export class EmailContactAddedEventHandler extends Observer {
  public constructor(private readonly contactGateway: RequestContactVerification) {
    super({ domainEvents: ['CONTACT_ADDED'] })
  }

  public async handle(event: ContactAddedEvent): Promise<void> {
    if (!(event.contact instanceof Email)) return
    await this.contactGateway.requestVerification(event.contact)
  }
}
