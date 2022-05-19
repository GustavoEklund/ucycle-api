import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { Controller } from '@/application/controllers'
import { AuthenticationError } from '@/domain/entities/errors'
import { AddPersons } from '@/domain/use-cases'

//TODO: create document and contact repository

type HttpRequest = {
  firstName: string
  lastName: string

  // document: Address;
  // contact: number;

  birthDate?: number
  professional?: string
  marriedStatus?: string

  specialNeeds: boolean
  specialNeedsDescription?: string
}

type Model = Error | { id: string }

export class AddPersonsController extends Controller {
  constructor(private readonly addPersons: AddPersons) {
    super()
  }

  async perform({
    firstName,
    lastName,

    // document,
    // contact,

    birthDate,
    professional,
    marriedStatus,

    specialNeeds,
    specialNeedsDescription,
  }: HttpRequest): Promise<HttpResponse<Model>> {
      const response = await this.addPersons({
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
      return ok(response)
  }
}
