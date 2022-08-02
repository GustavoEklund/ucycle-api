import { Entity } from '@/domain/entities'

type Input = {
  id: string
  code: string
  message: string
  stack: string | undefined
}

export class ErrorLog extends Entity {
  private readonly code: string
  private readonly message: string
  private readonly stack: string | undefined

  public constructor(input: Input) {
    super({ id: input.id })
    this.code = input.code
    this.message = input.message
    this.stack = input.stack
  }
}
