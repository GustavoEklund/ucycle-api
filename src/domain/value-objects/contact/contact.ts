export class Contact {
  public readonly value: any

  protected constructor(
    public readonly type: string,
    public readonly label: string,
    public readonly verified: boolean,
    public readonly isPrivate: boolean
  ) {}
}
