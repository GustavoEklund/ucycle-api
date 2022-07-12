import { mock, MockProxy } from 'jest-mock-extended'
import { ValidationComposite, Validator } from '@/application/validation'

describe('ValidationComposite', () => {
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>
  let validators: Validator[]
  let sut: ValidationComposite

  beforeAll(() => {
    validator1 = mock()
    validator1.validate.mockReturnValue([])
    validator2 = mock()
    validator2.validate.mockReturnValue([])
    validators = [validator1, validator2]
  })

  beforeEach(() => {
    sut = new ValidationComposite(validators)
  })

  it('should return an empty array if all validators return undefined', () => {
    const errors = sut.validate()

    expect(errors.length).toBe(0)
  })

  it('should return all errors', () => {
    validator1.validate.mockReturnValueOnce([new Error('error_1')])
    validator2.validate.mockReturnValueOnce([new Error('error_2')])

    const errors = sut.validate()

    expect(errors).toEqual([new Error('error_1'), new Error('error_2')])
  })

  it('should return the error', () => {
    validator2.validate.mockReturnValueOnce([new Error('error_2')])

    const errors = sut.validate()

    expect(errors).toEqual([new Error('error_2')])
  })
})
