import { LoadContact, LoadUserAccount, SaveContact } from '@/domain/contracts/repos'
import { VerifyContact as VerifyContactGateway } from '@/domain/contracts/gateways'
import { Publisher } from '@/domain/events'
import { ContactVerifiedEvent } from '@/domain/events/user'
import {
  ContactAlreadyVerifiedError,
  ContactDoesNotBelongToUserError,
  ContactNotFoundError,
  InvalidPhoneNumberVerificationCodeError,
} from '@/domain/entities/errors/contact'
import { UserNotFoundError } from '@/domain/entities/errors/user'

export interface VerifyContact {
  perform: (input: VerifyContact.Input) => Promise<VerifyContact.Output>
}

export class VerifyContactUseCase extends Publisher implements VerifyContact {
  public constructor(
    private readonly userAccountRepository: LoadUserAccount,
    private readonly contactRepository: LoadContact & SaveContact,
    private readonly contactGateway: VerifyContactGateway
  ) {
    super()
  }

  public async perform(input: VerifyContact.Input): Promise<VerifyContact.Output> {
    const user = await this.userAccountRepository.load({ id: input.user.id })
    if (user === undefined) return new UserNotFoundError(input.user.id)
    const contact = await this.contactRepository.load({ value: input.contact.value })
    if (contact === undefined) return new ContactNotFoundError(input.contact.value)
    const contactBelongsToUser = user.account.doesContactBelongsTo(contact.getFullPlainValue())
    if (!contactBelongsToUser)
      return new ContactDoesNotBelongToUserError(contact.getFullPlainValue(), user.id)
    if (contact.verified) return new ContactAlreadyVerifiedError(input.contact.value)
    const { didVerificationSucceed } = await this.contactGateway.verify({
      contact,
      code: input.contact.verificationCode,
    })
    if (!didVerificationSucceed)
      return new InvalidPhoneNumberVerificationCodeError(input.contact.verificationCode)
    contact.verify()
    await this.contactRepository.save(contact)
    const contactVerifiedEvent = new ContactVerifiedEvent({ contact, user })
    await this.notify(contactVerifiedEvent)
  }
}

export namespace VerifyContact {
  export type Input = {
    user: { id: string }
    contact: {
      value: string
      verificationCode: string
    }
  }
  export type Output =
    | undefined
    | UserNotFoundError
    | ContactNotFoundError
    | ContactAlreadyVerifiedError
    | InvalidPhoneNumberVerificationCodeError
    | ContactDoesNotBelongToUserError
}
