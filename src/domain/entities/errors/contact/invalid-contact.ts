import { DomainException } from '@/domain/entities/errors'

export class InvalidContactError extends DomainException {
  public constructor(value: string, label: string) {
    super('InvalidContactError', `invalid contact ${value} with label ${label}`)
  }
}
