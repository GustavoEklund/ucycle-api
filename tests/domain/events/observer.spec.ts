import { DomainEvent, Observer } from '@/domain/events'

class ObserverStub extends Observer {
  public constructor() {
    super({ domainEvents: ['EVENT_HAPPENED_1', 'EVENT_HAPPENED_2'] })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(event: DomainEvent): Promise<void> {
    return Promise.resolve(undefined)
  }
}

class EventHappenedStub1 extends DomainEvent {
  public constructor() {
    super({ name: 'EVENT_HAPPENED_1' })
  }
}

class EventHappenedStub2 extends DomainEvent {
  public constructor() {
    super({ name: 'EVENT_HAPPENED_2' })
  }
}

class EventHappenedStub3 extends DomainEvent {
  public constructor() {
    super({ name: 'EVENT_HAPPENED_3' })
  }
}

describe('Observer', () => {
  it('should be subscribed to domainEvents', () => {
    const sut = new ObserverStub()
    const event1 = new EventHappenedStub1()
    const event2 = new EventHappenedStub2()

    expect(sut.isSubscribedTo(event1)).toBeTruthy()
    expect(sut.isSubscribedTo(event2)).toBeTruthy()
  })

  it('should not be subscribed to domainEvents', () => {
    const sut = new ObserverStub()
    const event3 = new EventHappenedStub3()

    expect(sut.isSubscribedTo(event3)).toBeFalsy()
  })
})
