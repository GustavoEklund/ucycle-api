// TODO: create document and contact repository
import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadPersons, SavePersons } from '@/domain/contracts/repos'
import { PgPersons } from '@/infra/repos/postgres/entities'

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

export class PgPersonsRepository extends PgRepository implements LoadPersons, SavePersons {
  public async load({ id }: LoadPersons.Input): Promise<LoadPersons.Output> {
    const personsRepo = this.getRepository(PgPersons)
    const persons = await personsRepo.findOne({ id: id })

    if (persons !== undefined) {
      return { id: persons!.id }
    }
  }

  public async save(receivedData: SavePersons.Input): Promise<SavePersons.Output> {
    const personsRepo = this.getRepository(PgPersons)
    const personsToSave: Input = receivedData.map((personData) => {
      return {
        firstName: personData.firstName,
        lastName: personData.lastName,
        birthDate: personData.birthDate,
        professional: personData.professional,
        marriedStatus: personData.marriedStatus,
        specialNeeds: personData.specialNeeds,
        specialNeedsDescription: personData.specialNeedsDescription,
      }
    })

    const persons = await personsRepo.save(personsToSave)

    return persons.map((i) => {
      return { id: i.id }
    })
  }
}
