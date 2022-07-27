import { PgAdmissionProposalStatus, PgOrganization, PgUser } from '@/infra/repos/postgres/entities'
import { faker } from '@faker-js/faker'

export const mockPgAdmissionProposal = (input: {
  createdBy: PgUser
  organization: PgOrganization
}) => ({
  status: faker.helpers.arrayElement([
    PgAdmissionProposalStatus.pending,
    PgAdmissionProposalStatus.accepted,
    PgAdmissionProposalStatus.rejected,
  ]),
  createdBy: input.createdBy,
  organization: input.organization,
})
