import { SendGridMailer } from '@/infra/gateways/sdks/sendgrid/sendgrid'
import { env } from '@/main/config/env'

export const makeSendGridMailer = (): SendGridMailer => {
  return new SendGridMailer({
    apiKey: env.sendgrid.apiKey,
    sender: env.sendgrid.sender,
  })
}
