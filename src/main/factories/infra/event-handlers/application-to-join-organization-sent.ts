import { ApplicationToJoinOrganizationSentHandler } from '@/infra/event-handlers'
import { makeSendGridSdkGateway } from '@/main/factories/infra/gateways/sdks'

export const makeApplicationToJoinOrganizationSentHandler =
  (): ApplicationToJoinOrganizationSentHandler => {
    return new ApplicationToJoinOrganizationSentHandler(makeSendGridSdkGateway())
  }
