import { LoadDocument } from '@/domain/contracts/repos'
import { SignUp, SignUpUseCase } from '@/domain/use-cases/users'
import { mock, MockProxy } from 'jest-mock-extended'
import { DocumentAlreadyExistsError } from '@/domain/entities/errors'

describe('SignUpUseCase', () => {
  let inputStub: SignUp.Input
  let sut: SignUpUseCase
  let documentRepoSpy: MockProxy<LoadDocument>

  beforeAll(() => {
    inputStub = {
      account: {
        name: 'any_name',
        phones: ['any_phone_number'],
        emails: ['any_email'],
        documents: ['any_document_number'],
      },
      profile: {
        socialName: 'any_social_name',
      },
    }
    documentRepoSpy = mock()
  })

  beforeEach(() => {
    sut = new SignUpUseCase(documentRepoSpy)
  })

  it('should call load document with correct input', async () => {
    await sut.perform(inputStub)

    expect(documentRepoSpy.load).toHaveBeenCalledTimes(1)
    expect(documentRepoSpy.load).toHaveBeenCalledWith({ number: 'any_document_number' })
  })

  it('should return DocumentAlreadyExistsError if LoadDocument returns a document', async () => {
    const output = await sut.perform(inputStub)

    expect(output).toEqual(new DocumentAlreadyExistsError('any_document_number'))
  })
})
