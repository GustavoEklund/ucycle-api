import { CreditAccountService } from '@/domain/services/account'
import { faker } from '@faker-js/faker'
import { mock } from 'jest-mock-extended'
import { Transaction } from '@/domain/entities/transaction'
import { Account } from '@/domain/entities/account'

describe('CreditAccountService', () => {
  it('should call account.creditFromTransactionInstallment before transaction.payInstallment with correct input', () => {
    const sut = new CreditAccountService()
    const accountStub = mock<Account>()
    const transactionMock = mock<Transaction>()
    const installmentNumber = faker.datatype.number({
      min: 1,
      max: transactionMock.numberOfInstallments,
    })
    const creditFromTransactionInstallmentSpy = jest.spyOn(
      accountStub,
      'creditFromTransactionInstallment'
    )

    sut.perform({
      account: accountStub,
      transaction: transactionMock,
      installmentNumber,
    })

    expect(creditFromTransactionInstallmentSpy).toHaveBeenCalledOnce()
    expect(creditFromTransactionInstallmentSpy).toHaveBeenCalledBefore(
      transactionMock.payInstallment
    )
    expect(creditFromTransactionInstallmentSpy).toHaveBeenCalledWith(
      installmentNumber,
      transactionMock
    )
  })
})
