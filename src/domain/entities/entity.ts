export abstract class Entity {
  public readonly id: string

  protected constructor({ id }: { id: string }) {
    this.id = id
  }

  public equals(other: Entity): boolean {
    return this.id === other.id
  }
}
