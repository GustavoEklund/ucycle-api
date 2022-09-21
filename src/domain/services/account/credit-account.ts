import { Account } from '@/domain/entities/account'
import { Transaction } from '@/domain/entities/transaction'

export interface CreditAccount {
  perform: (input: CreditAccount.Input) => CreditAccount.Output
}

export class CreditAccountService {
  public perform(input: CreditAccount.Input): void {
    input.account.creditFromTransactionInstallment(input.installmentNumber, input.transaction)
    input.transaction.payInstallment(input.installmentNumber)
  }
}

export namespace CreditAccount {
  export type Input = {
    account: Account
    transaction: Transaction
    installmentNumber: number
  }
  export type Output = void
}
