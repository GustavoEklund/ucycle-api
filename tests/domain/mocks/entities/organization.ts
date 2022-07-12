import { Organization } from '@/domain/entities'
import { faker } from '@faker-js/faker'

export const mockOrganization = (input?: { ownerUserId?: string }): Organization => {
  return new Organization({
    id: faker.datatype.uuid(),
    name: faker.company.companyName(),
    userId: input?.ownerUserId ?? faker.datatype.uuid(),
    address: {
      city: faker.address.city(),
      state: faker.address.state(),
      country: faker.address.country(),
      street: faker.address.streetName(),
      neighbourhood: faker.address.streetName(),
      buildingNumber: faker.address.buildingNumber(),
    },
    description: faker.lorem.paragraph(),
  })
}
