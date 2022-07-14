import { LoadDocument } from '@/domain/contracts/repos'
import { SignUp, SignUpUseCase } from '@/domain/use-cases/users'
import { mock, MockProxy } from 'jest-mock-extended'

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
    expect(documentRepoSpy.load).toHaveBeenCalledWith({ number: inputStub.account.documents[0] })
  })
})
