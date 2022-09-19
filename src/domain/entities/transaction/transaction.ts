import { Entity } from '@/domain/entities'
import { Installment } from '@/domain/entities/transaction'

export enum TransactionStatus {
  created = 'CREATED',
  approved = 'APPROVED',
  rejected = 'EXPIRED',
  expired = 'EXPIRED',
  failed = 'FAILED',
  scheduled = 'SCHEDULED',
  delayedToNextBusinessDay = 'DELAYED_TO_NEXT_BUSINESS_DAY',
  cancelled = 'CANCELLED',
  finished = 'FINISHED',
}

export enum TransactionType {
  credit = 'CREDIT',
  debit = 'DEBIT',
}

export class Transaction extends Entity {
  private _status: TransactionStatus
  private _type: TransactionType
  private _installments: Installment[]

  public constructor(input: { id: string; type: TransactionType }) {
    super({ id: input.id })
    this._status = TransactionStatus.created
    this._type = input.type
    this._installments = []
  }

  public get total(): number {
    return this._installments.reduce(
      (previousValue, installment) => previousValue + installment.amountInCents,
      0
    )
  }

  public addInstallments(input: {
    numberOfInstallments: number
    totalAmountInCents: number
    currentDate: Date
  }): void {
    for (let i = 0; i < input.numberOfInstallments; i++) {
      const installmentDate = new Date(input.currentDate)
      installmentDate.setMonth(input.currentDate.getMonth() + i)
      const installment = new Installment({
        number: this._installments.length + 1,
        amountInCents: input.totalAmountInCents / input.numberOfInstallments,
        dueDate: installmentDate,
      })
      this._installments.push(installment)
    }
  }

  public getInstallment(installmentNumber: number): Installment | undefined {
    return this._installments.find((installment) => installment.number === installmentNumber)
  }
}
