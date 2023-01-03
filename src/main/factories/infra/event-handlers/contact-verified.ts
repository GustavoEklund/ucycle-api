import { ContactVerifiedHandler } from '@/infra/event-handlers'
import { makeSendGridSdkGateway } from '@/main/factories/infra/gateways/sdks'

export const makeContactVerifiedHandler = (): ContactVerifiedHandler => {
  return new ContactVerifiedHandler(makeSendGridSdkGateway())
}
