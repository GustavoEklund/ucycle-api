//TODO: create document and contact repository
import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadPersons, SavePersons } from '@/domain/contracts/repos'
import { PgPersons } from '@/infra/repos/postgres/entities'

export class PgPersonsRepository extends PgRepository implements LoadPersons, SavePersons {
  public async load({ id }: LoadPersons.Input): Promise<LoadPersons.Output> {
    const personsRepo = this.getRepository(PgPersons)
    const persons = await personsRepo.findOne({ id: Number(id) })

    if (persons !== undefined) {
      return { id: String(persons!.id) }
    }
  }

  public async save({
    firstName,
    lastName,

    // document,
    // contact,

    birthDate,
    professional,
    marriedStatus,

    specialNeeds,
    specialNeedsDescription,
  }: SavePersons.Input): Promise<SavePersons.Output> {
    const personsRepo = this.getRepository(PgPersons)
    const persons = await personsRepo.save({
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

    return { id: String(persons.id) }
  }
}
