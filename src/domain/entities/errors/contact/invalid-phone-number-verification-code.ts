import { DomainException } from '@/domain/entities/errors'

export class InvalidPhoneNumberVerificationCodeError extends DomainException {
  public constructor(code: string) {
    const message = `the phone number verification code ${code} is invalid`
    super('InvalidPhoneNumberVerificationCodeError', message)
  }
}
