export abstract class DomainEvent {
  readonly id: string | undefined
  readonly name: string
  readonly when: Date

  protected constructor({ name }: { name: string }) {
    this.id = undefined
    this.name = name
    this.when = new Date('now')
  }

  private static flatten(event: DomainEvent): string {
    return JSON.stringify(event)
  }

  public equals(other: DomainEvent): boolean {
    return DomainEvent.flatten(this) === DomainEvent.flatten(other)
  }
}
