import { UniqueId } from '@/infra/gateways'

import { reset, set } from 'mockdate'

describe('UniqueId', () => {
  let sut = new UniqueId()

  beforeAll(() => {
    set(new Date(2021, 9, 3, 10, 10, 10))
    sut = new UniqueId()
  })

  afterAll(() => {
    reset()
  })

  it('should create a unique id', () => {
    const uuid = sut.uuid()

    expect(uuid).toBe('20211003101010')
  })
})
