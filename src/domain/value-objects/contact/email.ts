import { Contact } from '@/domain/value-objects/contact'
import { InvalidEmailError } from '@/domain/entities/errors'

export enum EmailType {
  primary = 'PRIMARY',
}

export class Email extends Contact {
  public override readonly value: {
    address: string
  }

  public constructor(email: string, label: EmailType) {
    super('EMAIL', label, false)
    const clearEmail = Email.format(email)
    const isValid = Email.isValid(clearEmail)
    if (!isValid) throw new InvalidEmailError()
    this.value = { address: clearEmail }
  }

  private static format(email: string): string {
    return email.toLowerCase().trim()
  }

  private static isValid(email: string): boolean {
    const regex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
    return regex.test(email)
  }
}
