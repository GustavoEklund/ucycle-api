import { faker } from '@faker-js/faker'

export const mockPgUser = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  firstAccess: faker.datatype.boolean(),
})
