import { AddPersons, setupAddPersons } from '@/domain/use-cases/persons/add-persons'
import { Persons } from '@/domain/entities/persons/persons'
import { mockPerson } from '../../../infra/repos/postgres/mocks/person'
import { SavePersons } from '@/domain/contracts/repos/persons/persons'
import { mock, MockProxy } from 'jest-mock-extended'

let generatePerson = () => {
  const persons = new Persons(mockPerson())

  return {
    firstName: persons.firstName,
    lastName: persons.lastName,

    // document: persons.document,
    // contact: persons.contact,

    birthDate: persons.birthDate,
    professional: persons.professional,
    marriedStatus: persons.marriedStatus,

    specialNeeds: persons.specialNeeds,
    specialNeedsDescription: persons.specialNeedsDescription,
  }
}

jest.mock('@/domain/entities/persons/persons')

describe('use-cases add-persons', () => {
  let sut: AddPersons
  let mockAddPersonsContract: MockProxy<SavePersons>

  beforeAll(() => {
    mockAddPersonsContract = mock()
    mockAddPersonsContract.save.mockResolvedValue({ id: '1' })
  })

  beforeEach(() => {
    sut = setupAddPersons(mockAddPersonsContract)
  })

  it('should call personsRepo.save with correct values', async () => {
    const person = generatePerson()
    await sut(person)

    expect(mockAddPersonsContract.save).toHaveBeenCalledWith(person)
  })

  it('should return an id on success', async () => {
    let person = generatePerson()

    const response = await sut(person)

    expect(response).toEqual({ id: '1' })
  })
})
