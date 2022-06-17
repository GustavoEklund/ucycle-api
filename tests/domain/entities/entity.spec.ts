import { Entity } from '@/domain/entities'

class ChildEntity extends Entity {
  public constructor({ id }: { id: string }) {
    super({ id })
  }
}

describe('Entity', () => {
  it('should return true if entities are equal', () => {
    const entity1 = new ChildEntity({ id: 'any_id' })
    const entity2 = new ChildEntity({ id: 'any_id' })

    const areEqual = entity1.equals(entity2)

    expect(areEqual).toBeTruthy()
  })
})
