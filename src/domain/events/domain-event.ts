export abstract class DomainEvent {
  readonly id: string | undefined
  readonly name: string
  readonly when: Date

  protected constructor({ name, when }: { name: string; when?: Date }) {
    this.id = undefined
    this.name = name
    this.when = when ?? new Date()
  }

  private static flatten(event: DomainEvent): string {
    return JSON.stringify(event)
  }

  public equals(other: DomainEvent): boolean {
    return DomainEvent.flatten(this) === DomainEvent.flatten(other)
  }
}
