import { DomainEvent } from '@/domain/events/domain-event'

export abstract class Observer {
  private readonly domainEvents: DomainEvent[]

  protected constructor({ domainEvents }: { domainEvents: DomainEvent[] }) {
    this.domainEvents = domainEvents
  }

  public isSubscribedTo(event: DomainEvent): boolean {
    return this.domainEvents.filter((e) => e.name === event.name).length > 0
  }

  public abstract handle(event: DomainEvent): void
}
