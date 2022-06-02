import { Controller, AddPersonsController } from '@/application/controllers'
import { makeAddPersons } from '@/main/factories/domain/use-cases'

export const makeAddPersonsController = (): Controller => {
  return new AddPersonsController(makeAddPersons())
}
