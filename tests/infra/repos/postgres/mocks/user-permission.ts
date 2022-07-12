import { PgModule, PgOrganization, PgUser } from '@/infra/repos/postgres/entities'
import { mockPgModule, mockPgOrganization, mockPgUser } from '@/tests/infra/repos/postgres/mocks'
import { PermissionStatus } from '@/domain/entities/permission'

import { faker } from '@faker-js/faker'

export const mockPgUserPermission = (input?: {
  module?: PgModule
  createdBy?: PgUser
  grantToUser?: PgUser
  grantToOrganization?: PgOrganization
}) => ({
  id: faker.datatype.uuid(),
  code: faker.random.word().toUpperCase(),
  name: faker.random.word(),
  description: faker.random.word(),
  read: faker.datatype.boolean(),
  write: faker.datatype.boolean(),
  owner: faker.datatype.boolean(),
  module: input?.module ?? mockPgModule(),
  status: faker.helpers.arrayElement([PermissionStatus.GRANTED, PermissionStatus.REVOKED]),
  grantToUser: input?.grantToUser ?? mockPgUser(),
  createdBy: input?.createdBy ?? mockPgUser(),
  grantAtOrganization: input?.grantToOrganization ?? mockPgOrganization({}),
  expiresAt: faker.helpers.arrayElement([faker.date.future(), undefined]),
})
