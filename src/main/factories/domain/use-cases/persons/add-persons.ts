import { AddPersons, setupAddPersons } from '@/domain/use-cases'
  import { makePgPersonsRepo } from '@/main/factories/infra/repos/postgres/persons/persons'
  
  export const makeAddPersons = (): AddPersons => {
    return setupAddPersons(makePgPersonsRepo())
  }
  