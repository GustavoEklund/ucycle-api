import { faker } from '@faker-js/faker'

export const mockAddress = () => ({
  city: faker.address.city(),
  state: faker.address.state(),
  country: faker.address.country(),
  street: faker.address.streetName(),
  neighbourhood: faker.address.cityName(),
  zipCode: faker.address.zipCode('########'),
  buildingNumber: faker.address.buildingNumber(),
})
