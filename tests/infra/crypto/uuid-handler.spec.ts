import { v4 } from 'uuid'
import { UUIDGenerator } from '@/domain/contracts/gateways'

jest.mock('uuid')

class UUIDHandler {
  uuid ({ key }: UUIDGenerator.Input): void {
    v4()
  }
}

describe('', () => {
  it('should call uuid.v4', () => {
    const sut = new UUIDHandler()

    sut.uuid({ key: 'any_key' })

    expect(v4).toHaveBeenCalledTimes(1)
  })
})
