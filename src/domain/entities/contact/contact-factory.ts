import { Contact } from '@/domain/entities/contact/contact'
import { Phone } from '@/domain/entities/contact/phone'
import { Email } from '@/domain/entities/contact/email'
import { InvalidContactError } from '@/domain/entities/errors/contact'

export interface ContactFromRawValueFactory {
  fromRawValue: (input: ContactFromRawValueFactory.Input) => Contact
}

export namespace ContactFromRawValueFactory {
  export type Input = {
    value: string
    type: string
    userId: string
    verified: boolean
    isPrivate: boolean
  }
}

export class ContactFactory implements ContactFromRawValueFactory {
  public fromRawValue(input: ContactFromRawValueFactory.Input): Contact {
    if (Phone.isValid(input.value) && Phone.isPhoneType(input.type))
      return new Phone({
        value: input.value,
        label: input.type,
        userId: input.userId,
        verified: input.verified,
        isPrivate: input.isPrivate,
      })
    if (Email.isValid(input.value) && Email.isEmailType(input.type))
      return new Email({
        value: input.value,
        label: input.type,
        userId: input.userId,
        verified: input.verified,
        isPrivate: input.isPrivate,
      })
    throw new InvalidContactError(input.value, input.type)
  }
}
