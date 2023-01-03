import { RequestContactVerification, VerifyContact } from '@/domain/contracts/gateways'

import { Twilio } from 'twilio'
import { Contact, Phone } from '@/domain/entities/contact'

export class TwilioSdkGateway implements VerifyContact, RequestContactVerification {
  private readonly twilio: Twilio

  public constructor(
    private readonly accountSid: string,
    private readonly serviceSid: string,
    private readonly authToken: string
  ) {
    this.twilio = new Twilio(accountSid, authToken)
  }

  private static isPhoneNumber(contact: Contact): contact is Phone {
    return contact instanceof Phone
  }

  public async requestVerification(contact: RequestContactVerification.Input): Promise<void> {
    if (!TwilioSdkGateway.isPhoneNumber(contact)) {
      const message = `contact ${contact.getFullPlainValue()} is not a phone number`
      throw new Error(message)
    }
    const verification = await this.twilio.verify.v2
      .services(this.serviceSid)
      .verifications.create({ to: contact.getFullPlainValue(), channel: 'sms' })
    if (verification.status !== 'pending') {
      const message = `failed to send verification code to phone ${contact.getFullPlainValue()} through SMS`
      throw new Error(message)
    }
  }

  public async verify({ contact, code }: VerifyContact.Input): Promise<VerifyContact.Output> {
    if (!TwilioSdkGateway.isPhoneNumber(contact)) {
      const message = `contact ${contact.getFullPlainValue()} is not a phone number`
      throw new Error(message)
    }
    const verificationCheck = await this.twilio.verify.v2
      .services(this.serviceSid)
      .verificationChecks.create({ to: contact.getFullPlainValue(), code })
    const didVerificationSucceed = verificationCheck.status === 'approved'
    return { didVerificationSucceed }
  }
}
