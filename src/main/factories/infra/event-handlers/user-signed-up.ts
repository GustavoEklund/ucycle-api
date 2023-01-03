import { UserSignedUpHandler } from '@/infra/event-handlers'
import { makeTwilioSdkGateway } from '@/main/factories/infra/gateways/sdks'

export const makeUserSignedUpHandler = (): UserSignedUpHandler => {
  return new UserSignedUpHandler(makeTwilioSdkGateway())
}
