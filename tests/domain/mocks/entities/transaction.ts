import { Transaction, TransactionType } from '@/domain/entities/transaction'
import { faker } from '@faker-js/faker'

export const mockTransaction = (): Transaction => {
  const transaction = new Transaction({
    id: faker.datatype.uuid(),
    type: faker.helpers.arrayElement([TransactionType.credit, TransactionType.debit]),
  })
  faker.helpers
    .uniqueArray(() => faker.datatype.number(), faker.datatype.number({ min: 1, max: 12 }))
    .forEach(() => {
      transaction.addInstallments({
        numberOfInstallments: 1,
        totalAmountInCents: faker.datatype.number({ min: 100, max: 100000000 }),
        currentDate: new Date('2021-03-01T10:00:00'),
      })
    })
  return transaction
}
