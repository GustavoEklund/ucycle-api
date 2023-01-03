export abstract class Entity {
  protected constructor({ id }: { id: string }) {
    this._id = id
  }

  protected _id: string

  public get id(): string {
    return this._id
  }

  public equals(other: Entity): boolean {
    return this._id === other.id
  }
}
