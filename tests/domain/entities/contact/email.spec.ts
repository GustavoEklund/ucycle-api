import { InvalidEmailError } from '@/domain/entities/errors/contact'
import { Email, EmailType } from '@/domain/entities/contact'

describe('Email', () => {
  it('should be a valid email', () => {
    ;['test@test.com', 'mail+mail@gmail.com', 'mail.email@e.test.com'].forEach((email) => {
      const sut = new Email({
        value: email,
        label: EmailType.primary,
        verified: false,
        isPrivate: false,
        userId: 'any_user_id',
      })

      expect(sut.label).toBe(EmailType.primary)
      expect(sut.verified).toBe(false)
      expect(sut.value).toEqual({ address: email })
      expect(sut.type).toBe('EMAIL')
      expect(sut.userId).toBe('any_user_id')
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
      expect(
        () =>
          new Email({
            value: email,
            label: EmailType.primary,
            verified: false,
            isPrivate: false,
            userId: 'any_user_id',
          })
      ).toThrow(new InvalidEmailError(email))
    })
  })
})
