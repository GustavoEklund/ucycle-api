import { Entity } from '@/domain/entities'

export class Category extends Entity {
  public readonly _name: string

  public constructor(input: { id: string; name: string }) {
    super({ id: input.id })
    this._name = input.name
  }

  public get name(): string {
    return this._name
  }
}
