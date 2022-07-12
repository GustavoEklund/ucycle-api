import { InvalidEmailError } from '@/domain/entities/errors'
import { Email, EmailType } from '@/domain/value-objects/contact'

describe('Email', () => {
  it('should be a valid email', () => {
    ;['test@test.com', 'mail+mail@gmail.com', 'mail.email@e.test.com'].forEach((email) => {
      const sut = new Email(email, EmailType.primary)

      expect(sut.label).toBe(EmailType.primary)
      expect(sut.verified).toBe(false)
      expect(sut.value).toEqual({ address: email })
      expect(sut.type).toBe('EMAIL')
    })
  })

  it('should be a invalid email', () => {
    ;[
      '',
      'test',
      'a@a.a',
      '@test.com',
      'mail@test@test.com',
      'test.test@',
      'test.@test.com',
      'test@.test.com',
      'test@test..com',
      'test@test.com.',
      '.test@test.com',
    ].forEach((email) => {
      expect(() => new Email(email, EmailType.primary)).toThrow(new InvalidEmailError())
    })
  })
})
