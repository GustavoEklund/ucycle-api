import { DomainEvent } from '@/domain/events/domain-event'

export abstract class Observer {
  private readonly domainEvents: string[]

  protected constructor({ domainEvents }: { domainEvents: string[] }) {
    this.domainEvents = domainEvents
  }

  public isSubscribedTo(event: DomainEvent): boolean {
    return this.domainEvents.filter((eventName) => eventName === event.name).length > 0
  }

  public abstract handle(event: DomainEvent): Promise<void>
}
