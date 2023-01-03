import { LoadContact, LoadDocument, SaveUserAccount } from '@/domain/contracts/repos'
import { SignUp, SignUpUseCase } from '@/domain/use-cases/users'
import { Document } from '@/domain/value-objects'
import { Email, EmailType, Phone, PhoneType } from '@/domain/entities/contact'
import { SaveKeycloakUserAccount, UUIDGenerator } from '@/domain/contracts/gateways'
import { User, UserAccount, UserAccountStatus, UserProfile } from '@/domain/entities/user'
import { UserSignedUpEvent } from '@/domain/events/user'
import { DocumentAlreadyExistsError } from '@/domain/entities/errors/user'
import { ContactAlreadyExistsError } from '@/domain/entities/errors/contact'

import { mock, MockProxy } from 'jest-mock-extended'
import { faker } from '@faker-js/faker'

describe('SignUpUseCase', () => {
  let inputStub: SignUp.Input
  let sut: SignUpUseCase
  let documentRepoSpy: MockProxy<LoadDocument>
  let contactRepoSpy: MockProxy<LoadContact>
  let userRepoSpy: MockProxy<SaveUserAccount>
  let cryptoSpy: MockProxy<UUIDGenerator>
  let userAccountApiSpy: MockProxy<SaveKeycloakUserAccount>
  let cpf: string
  let emailFaker: string
  let phoneFaker: string
  let firstName: string
  let lastName: string
  let nameFaker: string
  let socialNameFaker: string

  beforeAll(() => {
    cpf = faker.helpers.arrayElement([
      '342.444.198-88',
      '342.444.198.88',
      '350.45261819',
      '693-319-118-40',
      '3.6.8.8.9.2.5.5.4.8.8',
      '11598647644',
      '86734718697',
      '86223423284',
      '24845408333',
      '95574461102',
    ])
    emailFaker = faker.internet.email()
    phoneFaker = faker.phone.phoneNumber('+55 (##) #####-####')
    firstName = faker.name.firstName()
    lastName = faker.name.lastName()
    nameFaker = firstName + ' ' + lastName
    socialNameFaker = faker.name.findName()
    inputStub = {
      account: {
        name: nameFaker,
        phone: phoneFaker,
        email: emailFaker,
        document: cpf,
        password: 'any_password',
      },
      profile: {
        socialName: socialNameFaker,
      },
    }
    cryptoSpy = mock()
    cryptoSpy.uuid.mockReturnValue('any_uuid')
    documentRepoSpy = mock()
    documentRepoSpy.load.mockResolvedValue(undefined)
    contactRepoSpy = mock()
    contactRepoSpy.load.mockResolvedValue(undefined)
    userRepoSpy = mock()
    userAccountApiSpy = mock()
    userAccountApiSpy.saveWithKeycloak.mockResolvedValue({ id: 'any_uuid' })
  })

  beforeEach(() => {
    sut = new SignUpUseCase(
      userRepoSpy,
      documentRepoSpy,
      contactRepoSpy,
      cryptoSpy,
      userAccountApiSpy
    )
  })

  const makeUser = (): User => {
    const userProfile = new UserProfile({ socialName: inputStub.profile.socialName })
    const userAccount = new UserAccount({
      name: inputStub.account.name,
      documents: [inputStub.account.document],
      phones: [
        {
          value: inputStub.account.phone,
          label: PhoneType.primary,
          verified: false,
          isPrivate: true,
        },
      ],
      emails: [
        {
          value: inputStub.account.email,
          label: EmailType.primary,
          verified: false,
          isPrivate: true,
        },
      ],
      verified: false,
      status: UserAccountStatus.disabled,
      userId: 'any_uuid',
    })
    return new User({
      id: 'any_uuid',
      profile: userProfile,
      account: userAccount,
    })
  }

  it('should call load document with correct input', async () => {
    await sut.perform(inputStub)

    expect(documentRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(documentRepoSpy.load).toHaveBeenCalledWith({ number: Document.removeNonNumbers(cpf) })
  })

  it('should return DocumentAlreadyExistsError if LoadDocument returns a document', async () => {
    documentRepoSpy.load.mockResolvedValueOnce(new Document(cpf))

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new DocumentAlreadyExistsError(cpf))
  })

  it('should call load contact with correct email input', async () => {
    await sut.perform(inputStub)

    expect(contactRepoSpy.load).toHaveBeenCalledTimes(2)
    expect(contactRepoSpy.load).toHaveBeenNthCalledWith(1, { value: emailFaker })
  })

  it('should return ContactAlreadyExistsError if LoadContact returns an email', async () => {
    contactRepoSpy.load.mockResolvedValueOnce(
      new Email({
        value: emailFaker,
        label: EmailType.primary,
        verified: true,
        isPrivate: false,
        userId: 'any_uuid',
      })
    )

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new ContactAlreadyExistsError(emailFaker))
  })

  it('should call load contact with correct phone input', async () => {
    await sut.perform(inputStub)

    expect(contactRepoSpy.load).toHaveBeenCalledTimes(2)
    expect(contactRepoSpy.load).toHaveBeenNthCalledWith(2, {
      value: Phone.removeNonNumbers(phoneFaker),
    })
  })

  it('should return ContactAlreadyExistsError if LoadContact returns an phone', async () => {
    contactRepoSpy.load.mockResolvedValueOnce(undefined).mockResolvedValueOnce(
      new Phone({
        value: phoneFaker,
        label: PhoneType.whatsapp,
        verified: true,
        isPrivate: false,
        userId: 'any_uuid',
      })
    )

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new ContactAlreadyExistsError(phoneFaker))
  })

  it('should call save user with correct input', async () => {
    const user = makeUser()

    await sut.perform(inputStub)

    expect(userRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.save).toHaveBeenCalledWith(user)
  })

  it('should call SaveKeycloakUserAccount with correct input', async () => {
    await sut.perform(inputStub)

    expect(userAccountApiSpy.saveWithKeycloak).toHaveBeenCalledTimes(1)
    expect(userAccountApiSpy.saveWithKeycloak).toHaveBeenCalledWith({
      email: inputStub.account.email,
      password: 'any_password',
      firstName: firstName,
      lastName: lastName,
    })
  })

  it('should throw if SaveKeycloakUserAccount throws', async () => {
    const error = new Error('any_error')
    userAccountApiSpy.saveWithKeycloak.mockRejectedValueOnce(error)

    const promise = sut.perform(inputStub)

    await expect(promise).rejects.toThrow(error)
  })

  it('should call notify with correct input on success', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022-03-01T10:00:00'))
    const user = makeUser()
    const expectedEvent = new UserSignedUpEvent({ user })
    const notifySpy = jest.spyOn(sut, 'notify')

    await sut.perform(inputStub)

    expect(notifySpy).toHaveBeenCalledTimes(1)
    expect(notifySpy).toHaveBeenCalledWith(expectedEvent)
    expect(notifySpy).toHaveBeenCalledAfter(userRepoSpy.save)
  })
})
