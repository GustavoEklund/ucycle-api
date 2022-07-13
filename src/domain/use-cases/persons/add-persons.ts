// TODO: create document and contact repository
import { SavePersons } from '@/domain/contracts/repos'
import { Person } from '@/domain/entities'

type Input = {
  firstName: string
  lastName: string

  // document: Address;
  // contact: number;

  birthDate?: string
  professional?: string
  marriedStatus?: string

  specialNeeds: boolean
  specialNeedsDescription?: string
}[]

type Output = {
  id: string
}[]

export type AddPersons = (params: Input) => Promise<Output>
type Setup = (personsRepo: SavePersons) => AddPersons

export const setupAddPersons: Setup = (personsRepo) => {
  return async (Input) => {
    const persons: Input = Input.map((personData) => {
      const person = new Person(personData)
      return {
        firstName: person.firstName,
        lastName: person.lastName,
        // document: person.document,
        // contact: person.contact,
        birthDate: person.birthDate,
        professional: person.professional,
        marriedStatus: person.marriedStatus,
        specialNeeds: person.specialNeeds,
        specialNeedsDescription: person.specialNeedsDescription,
      }
    })
    return await personsRepo.save(persons)
  }
}
