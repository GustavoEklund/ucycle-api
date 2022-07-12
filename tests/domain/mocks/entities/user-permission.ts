import { UserPermission } from '@/domain/entities/permission'
import { faker } from '@faker-js/faker'

export const mockUserPermission = (): UserPermission =>
  new UserPermission({
    id: faker.datatype.uuid(),
    code: faker.random.word().toUpperCase(),
    name: faker.random.word(),
    description: faker.random.words(),
    read: faker.datatype.boolean(),
    write: faker.datatype.boolean(),
    owner: faker.datatype.boolean(),
    moduleId: faker.datatype.uuid(),
    expiration: faker.date.future(),
    grantToUserId: faker.datatype.uuid(),
    grantByUserId: faker.datatype.uuid(),
    grantAtOrganizationId: faker.datatype.uuid(),
  })
