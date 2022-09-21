import { Account, BankAccountStatus, BankAccountType } from '@/domain/entities/account'
import { faker } from '@faker-js/faker'

export const mockAccount = (): Account => {
  const accountType = faker.helpers.arrayElement([
    BankAccountType.checking,
    BankAccountType.savings,
    BankAccountType.salary,
    BankAccountType.payment,
  ])
  return new Account({
    id: faker.datatype.uuid(),
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
    type: accountType,
    bank:
      accountType === BankAccountType.payment
        ? undefined
        : {
            ispb: faker.random.numeric(8, { allowLeadingZeros: true }),
            compe: faker.random.numeric(3, { allowLeadingZeros: true }),
            name: faker.company.companyName(),
          },
  })
}
