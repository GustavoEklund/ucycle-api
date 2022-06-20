import { Exception } from '@/domain/entities/errors/exception'

export class InvalidNameError extends Exception {
  public constructor(name: string) {
    super('InvalidNameError', `the name ${name} is invalid`)
  }
}
