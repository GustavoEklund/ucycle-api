import { LoadContact, SaveContact } from '@/domain/contracts/repos'
import { ContactAlreadyExistsError } from '@/domain/entities/errors/contact'
import { ContactFromRawValueFactory } from '@/domain/entities/contact'
import { Publisher } from '@/domain/events'
import { ContactAddedEvent } from '@/domain/events/user'

export interface AddContact {
  perform: (input: AddContact.Input) => Promise<AddContact.Output>
}

export class AddContactUseCase extends Publisher implements AddContact {
  public constructor(
    private readonly contactRepository: LoadContact & SaveContact,
    private readonly contactFactory: ContactFromRawValueFactory
  ) {
    super()
  }

  public async perform({
    contact: { value, label, isPrivate },
    user,
  }: AddContact.Input): Promise<AddContact.Output> {
    const existingContact = await this.contactRepository.load({ value: value })
    if (existingContact !== undefined) return new ContactAlreadyExistsError(value)
    const contact = await this.contactFactory.fromRawValue({
      type: label,
      value: value,
      userId: user.id,
      verified: false,
      isPrivate,
    })
    await this.contactRepository.save(contact)
    const contactAddedEvent = new ContactAddedEvent({ contact })
    await this.notify(contactAddedEvent)
  }
}

export namespace AddContact {
  export type Input = {
    contact: {
      value: string
      label: string
      isPrivate: boolean
    }
    user: {
      id: string
    }
  }
  export type Output = undefined | ContactAlreadyExistsError
}
