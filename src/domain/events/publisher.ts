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
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  public notify(event: DomainEvent): void {
    this.observers.forEach((observer) => {
      if (observer.isSubscribedTo(event)) observer.handle(event)
    })
  }
}
