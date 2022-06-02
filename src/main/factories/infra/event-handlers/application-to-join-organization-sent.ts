import { ApplicationToJoinOrganizationSentHandler } from '@/infra/event-handlers'
import { makeSendGridMailer } from '@/main/factories/infra/gateways/sdks'

export const makeApplicationToJoinOrganizationSentHandler =
  (): ApplicationToJoinOrganizationSentHandler => {
    return new ApplicationToJoinOrganizationSentHandler(makeSendGridMailer())
  }
