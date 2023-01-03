import { TwilioSdkGateway } from '@/infra/gateways/sdks/twilio'
import { env } from '@/main/config/env'

export const makeTwilioSdkGateway = (): TwilioSdkGateway => {
  return new TwilioSdkGateway(env.twilio.accountSid, env.twilio.serviceSid, env.twilio.authToken)
}
