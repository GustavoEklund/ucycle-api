import { Entity } from '@/domain/entities'

type Input = {
  id: string
  code: string
  message: string
  stack: string | undefined
  userId: string | undefined
}

export class ErrorLog extends Entity {
  public readonly code: string
  public readonly message: string
  public readonly stack: string | undefined
  public readonly userId: string | undefined

  public constructor(input: Input) {
    super({ id: input.id })
    this.code = input.code
    this.message = input.message
    this.stack = input.stack
    this.userId = input.userId
  }
}
