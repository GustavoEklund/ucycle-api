import { AddPersonsController, Controller } from '@/application/controllers'

const personsData = {
  firstName: 'any_first_name',
  lastName: 'any_last_name',

  birthDate: '14/05/1999',
  professional: 'any_professional',
  marriedStatus: 'any_married_status',

  specialNeeds: false,
  specialNeedsDescription: 'any_special_needs_description',
}

describe('AddPersonsController', () => {
  let sut: AddPersonsController
  let addPersonsSpy: jest.Mock

  beforeAll(() => {
    addPersonsSpy = jest.fn()
    addPersonsSpy.mockResolvedValue([{ id: 'any_id' }])
  })

  beforeEach(() => {
    sut = new AddPersonsController(addPersonsSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

it('should call addPersons with correct values', async () => {
  const person = [personsData]
  await sut.handle(person)

  expect(addPersonsSpy).toHaveBeenCalledWith(person)
  expect(addPersonsSpy).toHaveBeenCalledTimes(1)
})

  it('should return an id on success', async () => {
    const person = [personsData]
    const response = await sut.handle(person)

    expect(response).toEqual({
      statusCode: 200,
      data: [{ id: 'any_id' }],
    })
  })
})
