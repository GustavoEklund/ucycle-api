import { AdmissionProposal } from '@/domain/entities'

import { faker } from '@faker-js/faker'

export const mockAdmissionProposal = (input?: { userId?: string }): AdmissionProposal => {
  return new AdmissionProposal({
    id: faker.datatype.uuid(),
    userId: input?.userId ? input.userId : faker.datatype.uuid(),
    organizationId: faker.datatype.uuid(),
  })
}
