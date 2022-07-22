import { LoadContact, LoadDocument, SaveUserAccount } from '@/domain/contracts/repos'
import { SignUp, SignUpUseCase } from '@/domain/use-cases/users'
import { mock, MockProxy } from 'jest-mock-extended'
import { ContactAlreadyExistsError, DocumentAlreadyExistsError } from '@/domain/entities/errors'
import { Document } from '@/domain/value-objects'
import { faker } from '@faker-js/faker'
import { Email, EmailType, Phone, PhoneType } from '@/domain/value-objects/contact'
import { SaveKeycloakUserAccount, UUIDGenerator } from '@/domain/contracts/gateways'
import { User, UserAccount, UserAccountStatus, UserProfile } from '@/domain/entities/user'

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

  it('should call load document with correct input', async () => {
    await sut.perform(inputStub)

    expect(documentRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(documentRepoSpy.load).toHaveBeenCalledWith({ number: cpf })
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
    contactRepoSpy.load.mockResolvedValueOnce(new Email(emailFaker, EmailType.primary))

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new ContactAlreadyExistsError(emailFaker))
  })

  it('should call load contact with correct phone input', async () => {
    await sut.perform(inputStub)

    expect(contactRepoSpy.load).toHaveBeenCalledTimes(2)
    expect(contactRepoSpy.load).toHaveBeenNthCalledWith(2, { value: phoneFaker })
  })

  it('should return ContactAlreadyExistsError if LoadContact returns an phone', async () => {
    contactRepoSpy.load
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(new Phone(phoneFaker, PhoneType.whatsapp))

    const output = await sut.perform(inputStub)

    expect(output).toEqual(new ContactAlreadyExistsError(phoneFaker))
  })

  it('should call save user with correct input', async () => {
    await sut.perform(inputStub)

    const userProfile = new UserProfile({ socialName: inputStub.profile.socialName })
    const userAccount = new UserAccount({
      name: inputStub.account.name,
      documents: [inputStub.account.document],
      phones: [{ value: inputStub.account.phone, label: PhoneType.whatsapp }],
      emails: [{ value: inputStub.account.email, label: EmailType.primary }],
      verified: false,
      status: UserAccountStatus.disabled,
    })
    expect(userRepoSpy.save).toHaveBeenCalledTimes(1)
    expect(userRepoSpy.save).toHaveBeenCalledWith(
      new User({
        id: 'any_uuid',
        profile: userProfile,
        account: userAccount,
      })
    )
  })

  it('should call SaveKeycloakUserAccount with correct input', async () => {
    await sut.perform(inputStub)

    expect(userAccountApiSpy.saveWithKeycloak).toHaveBeenCalledTimes(1)
    expect(userAccountApiSpy.saveWithKeycloak).toHaveBeenCalledWith({
      id: 'any_uuid',
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
})
