import { Exception } from '@/domain/entities/errors/exception'

export class InvalidDescriptionError extends Exception {
  public constructor(description: string) {
    super('InvalidDescriptionError', `the description ${description} is invalid`)
  }
}
