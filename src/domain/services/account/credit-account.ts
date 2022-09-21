import { Account } from '@/domain/entities/account'
import { Transaction } from '@/domain/entities/transaction'

export interface CreditAccount {
  perform: (input: CreditAccount.Input) => Promise<CreditAccount.Output>
}

export class CreditAccountService implements CreditAccount {
  public async perform(input: CreditAccount.Input): Promise<void> {
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
