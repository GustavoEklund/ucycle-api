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
    addPersonsSpy.mockResolvedValue({ id: 'any_id' })
  })

  beforeEach(() => {
    sut = new AddPersonsController(addPersonsSpy)
  })

  it('should extend Controller', () => {
    expect(sut).toBeInstanceOf(Controller)
  })

  it('should call AddPersons with correct input', async () => {
    await sut.handle({
      ...personsData,
    })

    expect(addPersonsSpy).toHaveBeenCalledWith({
      ...personsData,
    })
    expect(addPersonsSpy).toHaveBeenCalledTimes(1)
  })

  it('should return 200 authentication succeeds', async () => {
    const httpResponse = await sut.handle({
      ...personsData,
    })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { id: 'any_id' },
    })
  })
})
