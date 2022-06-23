import { Person } from '@/domain/entities/persons'

const personsData = {
  firstName: 'any_first_name',
  lastName: 'any_last_name',
  birthDate: 'any_birth_date',
  professional: 'any_professional',
  marriedStatus: 'any_married_status',
  specialNeeds: true,
  specialNeedsDescription: 'any_special_needs_description',
}

describe('Entity Persons', () => {
  let sut: Person

  beforeEach(() => {
    sut = new Person(personsData)
  })

  test('should be instantiated with proper values', () => {
    expect(sut).toEqual(personsData)
  })
})
