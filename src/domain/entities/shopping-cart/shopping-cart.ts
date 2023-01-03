import { Entity } from '@/domain/entities'

export class ShoppingCart extends Entity {
  private readonly _userId?: string

  public constructor(input: { id: string; userId?: string }) {
    super({ id: input.id })
    this._userId = input.userId
  }

  public get userId(): string | undefined {
    return this._userId
  }
}
