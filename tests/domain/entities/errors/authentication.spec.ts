import { AuthenticationError } from '@/domain/entities/errors'

describe('AuthenticationError', () => {
  let sut: AuthenticationError

  beforeEach(() => {
    sut = new AuthenticationError()
  })

  it('should extend Error', () => {
    expect(sut).toBeInstanceOf(Error)
  })

})
