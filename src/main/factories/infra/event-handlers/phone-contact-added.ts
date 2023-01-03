import { PhoneContactAddedEventHandler } from '@/infra/event-handlers'
import { makeTwilioSdkGateway } from '@/main/factories/infra/gateways/sdks'

export const makePhoneContactAddedEventHandler = (): PhoneContactAddedEventHandler => {
  return new PhoneContactAddedEventHandler(makeTwilioSdkGateway())
}
