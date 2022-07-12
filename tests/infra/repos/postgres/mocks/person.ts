import { faker } from '@faker-js/faker'

const createdAt = faker.date.past(2)
const date: Date = faker.date.between(createdAt, new Date())
const formattedDate: string = date.toLocaleDateString('pt-BR')

export const mockPerson = () => ({
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),

  birthDate: formattedDate,
  professional: faker.company.bsBuzz(),
  marriedStatus: faker.lorem.sentence(1),

  specialNeeds: faker.datatype.boolean(),
  specialNeedsDescription: faker.lorem.sentence(),

  // document: Address;
  // contact: number;
})
