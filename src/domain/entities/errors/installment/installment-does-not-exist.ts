import { Exception } from '@/domain/entities/errors'

export class InstallmentDoesNotExistError extends Exception {
  public constructor(number: number, transactionId: string) {
    const message = `installment number ${number} from transaction ${transactionId} does not exist`
    super('InstallmentDoesNotExistError', message)
  }
}
