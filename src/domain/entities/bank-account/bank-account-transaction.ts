import { ValueObject } from '@/domain/value-objects'
import { TransactionType } from '@/domain/entities/transaction'

export class BankAccountTransaction extends ValueObject {
  private _transactionId: string
  private readonly _amountInCents: number
  private readonly _type: TransactionType

  public constructor(input: {
    transactionId: string
    amountInCents: number
    type: TransactionType
  }) {
    super()
    this._transactionId = input.transactionId
    this._amountInCents = input.amountInCents
    this._type = input.type
  }

  public get type(): TransactionType {
    return this._type
  }

  public get amountInCents(): number {
    return this._amountInCents
  }
}
