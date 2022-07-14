import { LoadContact, LoadDocument } from '@/domain/contracts/repos'
import { SignUp, SignUpUseCase } from '@/domain/use-cases/users'
import { mock, MockProxy } from 'jest-mock-extended'
import { ContactAlreadyExistsError, DocumentAlreadyExistsError } from '@/domain/entities/errors'
import { Document } from '@/domain/value-objects'
import { faker } from '@faker-js/faker'
import { Email, EmailType, Phone, PhoneType } from '@/domain/value-objects/contact'

describe('SignUpUseCase', () => {
  let inputStub: SignUp.Input
  let sut: SignUpUseCase
  let documentRepoSpy: MockProxy<LoadDocument>
  let contactRepoSpy: MockProxy<LoadContact>
  let cpf: string
  let emailFaker: string
  let phoneFaker: string

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
    inputStub = {
      account: {
        name: 'any_name',
        phone: phoneFaker,
        email: emailFaker,
        document: cpf,
      },
      profile: {
        socialName: 'any_social_name',
      },
    }
    documentRepoSpy = mock()
    documentRepoSpy.load.mockResolvedValue(undefined)
    contactRepoSpy = mock()
    contactRepoSpy.load.mockResolvedValue(undefined)
  })

  beforeEach(() => {
    sut = new SignUpUseCase(documentRepoSpy, contactRepoSpy)
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
})
