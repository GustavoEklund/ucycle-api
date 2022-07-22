import { faker } from '@faker-js/faker'

const cpf = faker.helpers.arrayElement([
  '342.444.198-88',
  '342.444.198.88',
  '350.45261819',
  '693-319-118-40',
  '3.6.8.8.9.2.5.5.4.8.8',
  '11598647644',
  '86734718697',
  '86223423284',
  '24845408333',
  '95574461102',
])

export const mockDocument = () => ({
  type: 'CPF',
  number: cpf,
})
