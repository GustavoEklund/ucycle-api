import { AddPersons, setupAddPersons } from '@/domain/use-cases/persons/add-persons'
import { Person } from '@/domain/entities/persons/persons'
import { mockPerson } from '@/tests/infra/repos/postgres/mocks/person'
import { SavePersons } from '@/domain/contracts/repos/person'
import { mock, MockProxy } from 'jest-mock-extended'

const generatePerson = (number = 1) => {
  const returnPerson = []

  for (let i = 0; i < number; i++) {
    const persons = new Person(mockPerson())

    returnPerson.push({
      firstName: persons.firstName,
      lastName: persons.lastName,

      // document: persons.document,
      // contact: persons.contact,

      birthDate: persons.birthDate,
      professional: persons.professional,
      marriedStatus: persons.marriedStatus,

      specialNeeds: persons.specialNeeds,
      specialNeedsDescription: persons.specialNeedsDescription,
    })
  }

  return returnPerson
}

jest.mock('@/domain/entities/persons/persons')

describe('use-cases add-persons', () => {
  let sut: AddPersons
  let mockAddPersonsContract: MockProxy<SavePersons>

  beforeAll(() => {
    mockAddPersonsContract = mock()
    mockAddPersonsContract.save.mockResolvedValue([{ id: '1' }])
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
    const person = generatePerson()
    const response = await sut(person)

    expect(response).toEqual([{ id: '1' }])
  })
  it('should return an list id on success', async () => {
    const person = generatePerson(2)
    mockAddPersonsContract.save.mockResolvedValue([{ id: '1' }, { id: '2' }])
    const response = await sut(person)

    expect(response).toEqual([{ id: '1' }, { id: '2' }])
  })

  it('should throw if personsRepo throws', async () => {
    mockAddPersonsContract.save.mockRejectedValueOnce(new Error('any_error'))

    const person = generatePerson()

    await expect(sut(person)).rejects.toThrow()
  })
})
