import { BankAccount, BankAccountStatus, BankAccountType } from '@/domain/entities/bank-account'
import { faker } from '@faker-js/faker'
import { Transaction, TransactionType } from '@/domain/entities/transaction'

describe('BankAccount', () => {
  it('should credit the account', () => {
    const transaction = new Transaction({
      id: 'any_transaction_id',
      type: TransactionType.credit,
    })
    transaction.addInstallments({
      numberOfInstallments: 1,
      totalAmountInCents: 8000,
      currentDate: new Date('2021-03-01T10:00:00'),
    })
    const sut = new BankAccount({
      id: 'any_id',
      status: faker.helpers.arrayElement([
        undefined,
        BankAccountStatus.suspended,
        BankAccountStatus.onboardingStarted,
        BankAccountStatus.documentInAnalysis,
        BankAccountStatus.documentApproved,
        BankAccountStatus.documentRejected,
        BankAccountStatus.waitingToOpen,
        BankAccountStatus.open,
      ]),
      type: faker.helpers.arrayElement([
        BankAccountType.checking,
        BankAccountType.savings,
        BankAccountType.salary,
        BankAccountType.payment,
      ]),
      bank: {
        ispb: faker.random.numeric(8, { allowLeadingZeros: true }),
        compe: faker.random.numeric(3, { allowLeadingZeros: true }),
        name: faker.company.companyName(),
      },
    })

    sut.creditFromTransactionInstallment(1, transaction)

    expect(sut.balance).toEqual(8000)
  })
})
