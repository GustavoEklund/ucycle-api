import { DomainEvent, Observer, Publisher } from '@/domain/events'

class PublisherStub extends Publisher {
  public constructor() {
    super()
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

class ObserverStub1 extends Observer {
  public constructor() {
    super({ domainEvents: ['EVENT_HAPPENED_1', 'EVENT_HAPPENED_2'] })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(event: DomainEvent): Promise<void> {
    return Promise.resolve(undefined)
  }
}

class ObserverStub2 extends Observer {
  public constructor() {
    super({ domainEvents: ['EVENT_HAPPENED_2', 'EVENT_HAPPENED_3'] })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async handle(event: DomainEvent): Promise<void> {
    return Promise.resolve(undefined)
  }
}

describe('Publisher', () => {
  it('should not notify observers not subscribed to', async () => {
    const sut = new PublisherStub()
    const observer1 = new ObserverStub1()
    const observer1Handle = jest.spyOn(observer1, 'handle')

    await sut.notify(new EventHappenedStub1())
    await sut.notify(new EventHappenedStub2())
    await sut.notify(new EventHappenedStub3())

    expect(observer1Handle).toHaveBeenCalledTimes(0)
  })

  it('should notify observers subscribed to', async () => {
    const sut = new PublisherStub()
    const observer1 = new ObserverStub1()
    const observer1Handle = jest.spyOn(observer1, 'handle')
    const observer2 = new ObserverStub2()
    const observer2Handle = jest.spyOn(observer2, 'handle')
    sut.subscribe(observer1)
    sut.subscribe(observer2)

    await sut.notify(new EventHappenedStub1())
    await sut.notify(new EventHappenedStub2())
    await sut.notify(new EventHappenedStub3())

    expect(observer1Handle).toHaveBeenCalledTimes(2)
    expect(observer1Handle.mock.calls[0][0].name).toBe('EVENT_HAPPENED_1')
    expect(observer1Handle.mock.calls[1][0].name).toBe('EVENT_HAPPENED_2')
    expect(observer2Handle).toHaveBeenCalledTimes(2)
    expect(observer2Handle.mock.calls[0][0].name).toBe('EVENT_HAPPENED_2')
    expect(observer2Handle.mock.calls[1][0].name).toBe('EVENT_HAPPENED_3')
  })

  it('should unsubscribe observer', async () => {
    const sut = new PublisherStub()
    const observer1 = new ObserverStub1()
    const observer1Handle = jest.spyOn(observer1, 'handle')
    const observer2 = new ObserverStub2()
    const observer2Handle = jest.spyOn(observer2, 'handle')
    sut.subscribe(observer1)
    sut.subscribe(observer2)
    sut.unsubscribe(observer1)

    await sut.notify(new EventHappenedStub1())
    await sut.notify(new EventHappenedStub2())
    await sut.notify(new EventHappenedStub3())

    expect(observer1Handle).toHaveBeenCalledTimes(0)
    expect(observer2Handle).toHaveBeenCalledTimes(2)
    expect(observer2Handle.mock.calls[0][0].name).toBe('EVENT_HAPPENED_2')
    expect(observer2Handle.mock.calls[1][0].name).toBe('EVENT_HAPPENED_3')
  })

  it('should not unsubscribe observer if not subscribed', async () => {
    const sut = new PublisherStub()
    const observer1 = new ObserverStub1()
    const observer1Handle = jest.spyOn(observer1, 'handle')
    const observer2 = new ObserverStub2()
    const observer2Handle = jest.spyOn(observer2, 'handle')
    sut.subscribe(observer1)
    sut.unsubscribe(observer2)

    await sut.notify(new EventHappenedStub1())
    await sut.notify(new EventHappenedStub2())

    expect(observer1Handle).toHaveBeenCalledTimes(2)
    expect(observer1Handle.mock.calls[0][0].name).toBe('EVENT_HAPPENED_1')
    expect(observer1Handle.mock.calls[1][0].name).toBe('EVENT_HAPPENED_2')
    expect(observer2Handle).toHaveBeenCalledTimes(0)
  })
})
