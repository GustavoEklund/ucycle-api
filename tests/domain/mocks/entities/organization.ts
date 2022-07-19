import { Organization } from '@/domain/entities/organization'
import faker from '@faker-js/faker'

export const mockOrganization = (input?: { ownerUserId?: string }): Organization =>
  new Organization({
    id: faker.datatype.uuid(),
    name: faker.random.word(),
    address: {
      city: faker.address.cityName(),
      state: faker.address.state(),
      country: faker.address.country(),
      street: faker.address.streetAddress(),
      neighbourhood: faker.random.word(),
      buildingNumber: Number(faker.address.buildingNumber()),
    },
    userId: input?.ownerUserId ?? faker.datatype.uuid(),
    description: faker.random.words(),
  })
