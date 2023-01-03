import { Contact } from '@/domain/entities/contact'
import { InvalidEmailError } from '@/domain/entities/errors/contact'

export enum EmailType {
  primary = 'PRIMARY',
  secondary = 'SECONDARY',
}

type EmailAddress = {
  address: string
}

export class Email extends Contact {
  public override readonly value: EmailAddress

  /**
   * @throws InvalidEmailError
   */
  public constructor(input: {
    value: string
    label: EmailType
    userId: string
    verified: boolean
    isPrivate: boolean
  }) {
    super('EMAIL', input.label, input.verified, input.isPrivate, input.userId)
    if (!Email.isValid(input.value)) throw new InvalidEmailError(input.value)
    this.value = Email.getValueFromRawValue(input.value)
  }

  public static getPrimary(contacts: Contact[]): Email | undefined {
    return contacts.find((contact: Contact) => {
      return contact instanceof Email && contact.label === EmailType.primary
    })
  }

  public static getValueFromRawValue(value: string): EmailAddress {
    const clearEmail = Email.format(value)
    return { address: clearEmail }
  }

  public static isEmailType(type: string): type is EmailType {
    return Object.values(EmailType).includes(type as EmailType)
  }

  public static isValid(email: string): boolean {
    const clearEmail = Email.format(email)
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(clearEmail)
  }

  private static format(email: string): string {
    return email.toLowerCase().trim()
  }

  public getValueFromRawValue(value: string): EmailAddress {
    return Email.getValueFromRawValue(value)
  }

  public getFormattedValue(): string {
    return this.value.address
  }

  public getFullPlainValue(): string {
    return this.value.address
  }
}
