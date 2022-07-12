import { faker } from '@faker-js/faker'

export const mockPgModule = () => ({
  id: faker.datatype.uuid(),
})
