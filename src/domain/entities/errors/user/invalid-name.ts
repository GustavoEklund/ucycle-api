import { DomainException } from '@/domain/entities/errors'

export class InvalidNameError extends DomainException {
  public constructor(name: string) {
    super('InvalidNameError', `the name ${name} is invalid`)
  }
}
