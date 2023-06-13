import { DomainException } from '@/domain/entities/errors'

export class ProductMustHaveAtLeastOnePictureException extends DomainException {
  public constructor() {
    super('ProductMustHaveAtLeastOnePictureException', 'product must have at least one picture')
  }
}
