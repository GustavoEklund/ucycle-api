import { Organization } from '@/domain/entities/organization'
import faker from '@faker-js/faker'

export const mockOrganization = (input?: { ownerUserId?: string }): Organization =>
  new Organization({
    id: faker.datatype.uuid(),
    name: faker.company.companyName(),
    address: {
      city: faker.address.cityName(),
      state: faker.address.state(),
      country: faker.address.country(),
      street: faker.address.streetName(),
      neighbourhood: faker.address.streetName(),
      buildingNumber: faker.address.buildingNumber(),
    },
    userId: input?.ownerUserId ?? faker.datatype.uuid(),
    description: faker.lorem.paragraph(),
  })
