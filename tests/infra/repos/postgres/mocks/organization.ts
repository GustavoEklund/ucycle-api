import { PgAddress, PgImage, PgOrganizationMember, PgUser } from '@/infra/repos/postgres/entities'

import { faker } from '@faker-js/faker'

export const mockPgOrganization = ({
  ownerUser,
  address,
  pictures,
}: {
  ownerUser?: PgUser
  address?: PgAddress
  pictures?: PgImage[]
}) => ({
  id: faker.datatype.uuid(),
  name: faker.company.companyName(),
  ownerUser,
  pictures: Promise.resolve(pictures),
  address,
  admissionProposals: Promise.resolve([]),
  members: Promise.resolve([] as PgOrganizationMember[]),
  description: faker.random.word(),
})
