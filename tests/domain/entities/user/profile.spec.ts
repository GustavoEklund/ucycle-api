import { UserProfile } from '@/domain/entities/user'
import { Name, ValueObject } from '@/domain/value-objects'

describe('UserProfile', () => {
  let sut: UserProfile

  beforeEach(() => {
    sut = new UserProfile({ socialName: 'any social name' })
  })

  it('should extend ValueObject', () => {
    expect(sut).toBeInstanceOf(ValueObject)
  })

  it('should begin with empty initials', () => {
    expect(sut.initials).toBeUndefined()
  })

  it('should begin with empty pictureUrl', () => {
    expect(sut.pictureUrl).toBeUndefined()
  })

  it('should begin with empty socialName when not provided', () => {
    sut = new UserProfile({})

    expect(sut.socialName).toBeUndefined()
  })

  describe('updatePicture', () => {
    it('should create with empty initials when pictureUrl is provided', () => {
      sut.updatePicture({ pictureUrl: 'any_url', name: 'any_name' })

      expect(sut).toEqual({
        pictureUrl: 'any_url',
        initials: undefined,
        socialName: new Name({ value: 'any social name' }),
      })
    })

    it('should create with empty initials when pictureUrl is provided', () => {
      sut.updatePicture({ pictureUrl: 'any_url' })

      expect(sut).toEqual({
        pictureUrl: 'any_url',
        initials: undefined,
        socialName: new Name({ value: 'any social name' }),
      })
    })

    it('should create initials with first letter of first and last names', () => {
      sut.updatePicture({ name: 'Gustavo Camargo Eklund' })

      expect(sut).toEqual({
        pictureUrl: undefined,
        initials: 'GE',
        socialName: new Name({ value: 'any social name' }),
      })
    })

    it('should create initials with first two letters of first name', () => {
      sut.updatePicture({ name: 'Gustavo' })

      expect(sut).toEqual({
        pictureUrl: undefined,
        initials: 'GU',
        socialName: new Name({ value: 'any social name' }),
      })
    })

    it('should create initials with first letter', () => {
      sut.updatePicture({ name: 'G' })

      expect(sut).toEqual({
        pictureUrl: undefined,
        initials: 'G',
        socialName: new Name({ value: 'any social name' }),
      })
    })

    it('should create with empty initials when name and pictureUrl are not provided', () => {
      sut.updatePicture({})

      expect(sut).toEqual({
        pictureUrl: undefined,
        initials: undefined,
        socialName: new Name({ value: 'any social name' }),
      })
    })

    it('should create with empty initials when name and pictureUrl are not provided', () => {
      sut.updatePicture({ name: '' })

      expect(sut).toEqual({
        pictureUrl: undefined,
        initials: undefined,
        socialName: new Name({ value: 'any social name' }),
      })
    })
  })

  describe('updateSocialName', () => {
    it('should update the social name', function () {
      sut.updateSocialName({ name: 'any other name' })

      expect(sut).toEqual({
        pictureUrl: undefined,
        initials: undefined,
        socialName: new Name({ value: 'any other name' }),
      })
    })
  })
})
