import { CreditAccountService } from '@/domain/services/account'
import { faker } from '@faker-js/faker'
import { mock } from 'jest-mock-extended'
import { Transaction } from '@/domain/entities/transaction'
import { Account } from '@/domain/entities/account'
import {
  InstallmentAlreadyPaidError,
  InstallmentDoesNotExistError,
} from '@/domain/entities/errors/installment'

describe('CreditAccountService', () => {
  let sut: CreditAccountService

  beforeEach(() => {
    sut = new CreditAccountService()
  })

  it('should call account.creditFromTransactionInstallment before transaction.payInstallment with correct input', async () => {
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

    await sut.perform({
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

  it('should throw if account.creditFromTransactionInstallment throws InstallmentDoesNotExistError', async () => {
    const accountStub = mock<Account>()
    const transactionMock = mock<Transaction>()
    const expectedError = new InstallmentDoesNotExistError(1, 'any_id')
    accountStub.creditFromTransactionInstallment.mockImplementationOnce(() => {
      throw expectedError
    })

    const promise = sut.perform({
      account: accountStub,
      transaction: transactionMock,
      installmentNumber: 1,
    })

    await expect(promise).rejects.toThrow(expectedError)
  })

  it('should throw if account.creditFromTransactionInstallment throws InstallmentAlreadyPaidError', async () => {
    const accountStub = mock<Account>()
    const transactionMock = mock<Transaction>()
    const expectedError = new InstallmentAlreadyPaidError(1, 'any_id')
    accountStub.creditFromTransactionInstallment.mockImplementationOnce(() => {
      throw expectedError
    })

    const promise = sut.perform({
      account: accountStub,
      transaction: transactionMock,
      installmentNumber: 1,
    })

    await expect(promise).rejects.toThrow(expectedError)
  })
})
