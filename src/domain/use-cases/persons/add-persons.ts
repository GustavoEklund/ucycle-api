// TODO: create document and contact repository
import { SavePersons, LoadPersons } from '@/domain/contracts/repos'
import { Persons } from '@/domain/entities'

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
}

type Output = {
  id: string
}

export type AddPersons = (params: Input) => Promise<Output>
type Setup = (personsRepo: SavePersons) => AddPersons

export const setupAddPersons: Setup = (personsRepo) => {
  return async ({
    firstName,
    lastName,

    // document,
    // contact,

    birthDate,
    professional,
    marriedStatus,

    specialNeeds,
    specialNeedsDescription,
  }) => {
    const persons = new Persons({
      firstName,
      lastName,

      // document,
      // contact,

      birthDate,
      professional,
      marriedStatus,

      specialNeeds,
      specialNeedsDescription,
    })

    const response = await personsRepo.save({
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

    return response
  }
}
