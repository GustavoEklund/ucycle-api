import { HttpResponse, ok } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { AddPersons } from '@/domain/use-cases'

// TODO: create document and contact repository

type HttpRequest = {
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

type Model = Error | { id: string }[]

export class AddPersonsController extends Controller {
  constructor(private readonly addPersons: AddPersons) {
    super()
  }

  async perform(received: HttpRequest): Promise<HttpResponse<Model>> {
    const persons: HttpRequest = received.map((personData) => {
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
    const response = await this.addPersons(persons)
    return ok(response)
  }
}
