import { Entity } from '@/domain/entities'
import { AccountTransaction, Bank } from '@/domain/entities/account'
import { InstallmentStatus, Transaction, TransactionType } from '@/domain/entities/transaction'
import {
  InstallmentAlreadyPaidError,
  InstallmentDoesNotExistError,
} from '@/domain/entities/errors/installment'

export enum BankAccountStatus {
  suspended = 'SUSPENDED',
  onboardingStarted = 'ONBOARDING_STARTED',
  documentInAnalysis = 'DOCUMENT_IN_ANALYSIS',
  documentApproved = 'DOCUMENT_APPROVED',
  documentRejected = 'DOCUMENT_REJECTED',
  waitingToOpen = 'WAITING_TO_OPEN',
  open = 'OPEN',
}

export enum BankAccountType {
  checking = 'CHECKING',
  savings = 'SAVINGS',
  salary = 'SALARY',
  payment = 'PAYMENT',
}

export class Account extends Entity {
  private _type: BankAccountType
  private _status: BankAccountStatus
  private _bank?: Bank
  private _transactions: AccountTransaction[]

  public constructor(input: {
    id: string
    type: BankAccountType
    status?: BankAccountStatus
    bank?: {
      ispb: string
      compe: string
      name: string
    }
  }) {
    super({ id: input.id })
    this._type = input.type
    this._status = input.status ?? BankAccountStatus.onboardingStarted
    this._bank = input.bank ? new Bank(input.bank) : undefined
    this._transactions = []
  }

  public get balance(): number {
    return this._transactions.reduce((previousValue, transaction) => {
      if (transaction.type === TransactionType.credit)
        return previousValue + transaction.amountInCents
      if (transaction.type === TransactionType.debit)
        return previousValue - transaction.amountInCents
      return previousValue
    }, 0)
  }

  /**
   * @throws InstallmentDoesNotExistError
   * @throws InstallmentAlreadyPaidError
   */
  public creditFromTransactionInstallment(
    installmentNumber: number,
    transaction: Transaction
  ): void {
    const installment = transaction.getInstallment(installmentNumber)
    if (installment === undefined)
      throw new InstallmentDoesNotExistError(installmentNumber, transaction.id)
    if (installment.status !== InstallmentStatus.awaitingPayment)
      throw new InstallmentAlreadyPaidError(installmentNumber, transaction.id)
    const bankAccountTransaction = new AccountTransaction({
      transactionId: transaction.id,
      amountInCents: transaction.total,
      type: TransactionType.credit,
    })
    this._transactions.push(bankAccountTransaction)
  }
}
