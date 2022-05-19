import { AddPersonsController, Controller } from '@/application/controllers'
import { RequiredInteger, RequiredString } from '@/application/validation'

describe('AddPersonsController', () => {
  let firstName: string
  let lastName: string
  
  let birthDate: string
  let professional: string
  let marriedStatus: string

  let specialNeeds: boolean
  let specialNeedsDescription: string

  let sut: AddPersonsController
  let addPersonsSpy: jest.Mock

  beforeAll(() => {
    firstName: 'any_first_name'
    lastName: 'any_last_name'

    birthDate: '14/05/1999'
    professional: 'any_professional'
    marriedStatus: 'any_married_status'

    specialNeeds: false
    specialNeedsDescription: 'any_special_needs_description'

    addPersonsSpy = jest.fn()
    addPersonsSpy.mockResolvedValue({ id: 'any_id' })
  })

  beforeEach(() => {
    sut = new AddPersonsController(addPersonsSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })
})
