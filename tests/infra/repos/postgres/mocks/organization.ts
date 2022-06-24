import { PgAddress, PgImage, PgUser } from '@/infra/repos/postgres/entities'

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
  name: faker.company.companyName(),
  ownerUser,
  pictures: Promise.resolve(pictures),
  address,
  admissionProposals: Promise.resolve([]),
  members: Promise.resolve([]),
})
