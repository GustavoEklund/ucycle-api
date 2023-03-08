import { faker } from '@faker-js/faker'
import { AddressType } from '@/domain/entities/address'
import { mockPgContact } from '@/tests/infra/repos/postgres/mocks/contact'

export const mockAddress = () => ({
  city: faker.address.city(),
  state: faker.address.state(),
  country: faker.address.country(),
  street: faker.address.streetName(),
  neighbourhood: faker.address.cityName(),
  zipCode: faker.address.zipCode('########'),
  buildingNumber: faker.address.buildingNumber(),
  landmark: faker.address.streetPrefix(),
  type: faker.helpers.arrayElement([
    AddressType.apartment,
    AddressType.house,
    AddressType.business,
    AddressType.other,
  ]),
  isDefault: faker.datatype.boolean(),
  phoneContact: mockPgContact(),
})
