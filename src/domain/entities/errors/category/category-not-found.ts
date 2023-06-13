import { DomainException } from '@/domain/entities/errors'

export class CategoryNotFoundException extends DomainException {
  public constructor(id: string) {
    super('CategoryNotFoundException', `category with id ${id} not found`)
  }
}
