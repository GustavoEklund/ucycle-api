import { Exception } from '@/domain/entities/errors'

export class InstallmentAlreadyPaidError extends Exception {
  public constructor(number: number, transactionId: string) {
    const message = `installment number ${number} from transaction ${transactionId} is already paid`
    super('InstallmentAlreadyPaidError', message)
  }
}
