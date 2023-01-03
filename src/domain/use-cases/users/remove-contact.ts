import { DeleteContact, LoadContact, LoadUserAccount } from '@/domain/contracts/repos'
import { Publisher } from '@/domain/events'
import { ContactRemovedEvent } from '@/domain/events/user'
import { UserAccountNotFoundError } from '@/domain/entities/errors/user'
import {
  ContactDoesNotBelongToUserError,
  ContactNotFoundError,
} from '@/domain/entities/errors/contact'

export interface RemoveContact {
  perform: (input: RemoveContact.Input) => Promise<RemoveContact.Output>
}

export class RemoveContactUseCase extends Publisher implements RemoveContact {
  public constructor(
    private readonly userRepository: LoadUserAccount,
    private readonly contactRepository: LoadContact & DeleteContact
  ) {
    super()
  }

  public async perform(input: RemoveContact.Input): Promise<RemoveContact.Output> {
    const user = await this.userRepository.load({ id: input.user.id })
    if (user === undefined) return new UserAccountNotFoundError(input.user.id)
    const contact = await this.contactRepository.load({ id: input.contact.id })
    if (contact === undefined) return new ContactNotFoundError()
    if (!user.account.doesContactBelongsTo(contact.getFullPlainValue()))
      return new ContactDoesNotBelongToUserError(contact.getFullPlainValue(), user.id)
    await this.contactRepository.delete(contact)
    const event = new ContactRemovedEvent({ contact, user })
    await this.notify(event)
  }
}

export namespace RemoveContact {
  export type Input = {
    user: { id: string }
    contact: { id: string }
  }
  export type Output =
    | undefined
    | UserAccountNotFoundError
    | ContactNotFoundError
    | ContactDoesNotBelongToUserError
}
