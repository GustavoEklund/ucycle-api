import { Entity } from '@/domain/entities'

export class EmailTemplate extends Entity {
  private readonly _code: string
  private readonly _version: string
  private readonly _previousVersionId?: string
  private readonly _nextVersionId?: string
  private readonly _title: string
  private readonly _content: string

  public constructor(input: {
    id: string
    code: string
    version: string
    previousVersionId?: string
    nextVersionId?: string
    title: string
    content: string
  }) {
    super({ id: input.id })
    this._code = input.code
    this._version = input.version
    this._nextVersionId = input.nextVersionId
    this._previousVersionId = input.previousVersionId
    this._title = input.title
    this._content = input.content
  }

  public get code(): string {
    return this._code
  }

  public get version(): string {
    return this._version
  }

  public get content(): string {
    return this._content
  }
}
