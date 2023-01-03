import { Exception } from '@/domain/entities/errors'

export class DomainException extends Exception {
  public constructor(name: string, message: string) {
    super(name, message)
  }
}
