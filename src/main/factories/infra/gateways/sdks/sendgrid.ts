import { SendGridSdkGateway } from '@/infra/gateways/sdks'
import { env } from '@/main/config/env'
import { makePgEmailTemplateRepo } from '@/main/factories/infra/repos/postgres'

export const makeSendGridSdkGateway = (): SendGridSdkGateway => {
  return new SendGridSdkGateway({
    apiKey: env.sendgrid.apiKey,
    sender: env.sendgrid.sender,
    emailTemplateRepository: makePgEmailTemplateRepo(),
  })
}
