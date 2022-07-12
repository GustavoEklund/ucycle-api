import { Observer } from '@/domain/events/observer'
import { DomainEvent } from '@/domain/events/domain-event'

export abstract class Publisher {
  private readonly observers: Observer[]

  protected constructor() {
    this.observers = []
  }

  public subscribe(observer: Observer): void {
    this.observers.push(observer)
  }

  public unsubscribe(observer: Observer): void {
    const index = this.observers.indexOf(observer)
    if (index > -1) this.observers.splice(index, 1)
  }

  public async notify(event: DomainEvent): Promise<void> {
    for (const observer of this.observers)
      if (observer.isSubscribedTo(event)) await observer.handle(event)
  }
}
