import { ValueObject } from '@/domain/value-objects'

export enum InstallmentStatus {
  awaitingPayment = 'AWAITING_PAYMENT',
  paid = 'PAID',
}

export class Installment extends ValueObject {
  private readonly _number: number
  private _dueDate: Date
  private _paymentDate: Date | undefined
  private readonly _amountInCents: number

  public constructor(input: {
    number: number
    amountInCents: number
    status?: InstallmentStatus
    dueDate: Date
    paymentDate?: Date
  }) {
    super()
    this._number = input.number
    this._amountInCents = input.amountInCents
    this._status = input.status ?? InstallmentStatus.awaitingPayment
    this._dueDate = input.dueDate
    this._paymentDate = input.paymentDate
  }

  private _status: InstallmentStatus

  public get status(): InstallmentStatus {
    return this._status
  }

  public get number(): number {
    return this._number
  }

  public get amountInCents(): number {
    return this._amountInCents
  }

  public pay(): void {
    this._status = InstallmentStatus.paid
  }
}
