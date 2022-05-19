import { AlreadyExistsError } from '@/domain/entities/errors'

describe('AlreadyExistsError', () => {
    let sut: AlreadyExistsError

  beforeEach(() => {
    sut = new AlreadyExistsError('any_entity', 'any_id')
  })

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error)
  })
})
