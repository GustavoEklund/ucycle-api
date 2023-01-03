import { AdmissionProposalAcceptedHandler } from '@/infra/event-handlers'
import { makeSendGridSdkGateway } from '@/main/factories/infra/gateways/sdks'
import {
  makePgOrganizationRepo,
  makePgUserAccountRepo,
} from '@/main/factories/infra/repos/postgres'
import { makeJoinUserToOrganizationUseCase } from '@/main/factories/domain/use-cases'

export const makeAdmissionProposalAcceptedHandler = (): AdmissionProposalAcceptedHandler => {
  return new AdmissionProposalAcceptedHandler(
    makeJoinUserToOrganizationUseCase(),
    makeSendGridSdkGateway(),
    makePgUserAccountRepo(),
    makePgOrganizationRepo()
  )
}
