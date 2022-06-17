import { ValueObject } from '@/domain/value-objects'

class ChildValueObject extends ValueObject {
  public constructor(public readonly value: string) {
    super()
  }
}

describe('ValueObject', () => {
  it('should return true when two value objects are equal', () => {
    const valueObject1 = new ChildValueObject('any_value')
    const valueObject2 = new ChildValueObject('any_value')

    const areEquals = valueObject1.equals(valueObject2)

    expect(areEquals).toBeTruthy()
  })
})
