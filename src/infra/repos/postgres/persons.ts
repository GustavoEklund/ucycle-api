import { PgRepository } from '@/infra/repos/postgres/repository'
import { LoadPersons, SavePersons } from '@/domain/contracts/repos'
import { PgPerson, PgPersonMaritalStatus } from '@/infra/repos/postgres/entities'

export class PgPersonRepository extends PgRepository implements LoadPersons, SavePersons {
  public async load({ id }: LoadPersons.Input): Promise<LoadPersons.Output> {
    const personsRepo = this.getRepository(PgPerson)
    const pgPerson = await personsRepo.findOne({ id: id })
    if (pgPerson !== undefined) {
      return { id: pgPerson!.id }
    }
  }

  public async save(input: SavePersons.Input): Promise<SavePersons.Output> {
    const pgPersonRepo = this.getRepository(PgPerson)
    const pgPersons = await pgPersonRepo.save(
      input.map((personData) => ({
        firstName: personData.firstName,
        lastName: personData.lastName,
        birthDate: personData.birthDate,
        professional: personData.professional,
        maritalStatus: personData.maritalStatus as PgPersonMaritalStatus,
        hasSpecialNeeds: personData.specialNeeds,
        specialNeedsDescription: personData.specialNeedsDescription,
      }))
    )
    return pgPersons.map((pgPerson) => ({ id: pgPerson.id }))
  }
}
