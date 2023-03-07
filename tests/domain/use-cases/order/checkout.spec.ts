import { Checkout, CheckoutUseCase } from '@/domain/use-cases/order'
import { LoadCoupon, LoadProduct, LoadUserAccount, SaveOrder } from '@/domain/contracts/repos'
import { OrderMustHaveAtLeastOneItemError } from '@/domain/entities/errors/order'
import { Publisher } from '@/domain/events'
import { OrderPlacedEvent } from '@/domain/events/order'
import { UUIDGenerator } from '@/domain/contracts/gateways'
import { UserNotFoundError } from '@/domain/entities/errors/user'
import { ProductNotFoundError } from '@/domain/entities/errors/product'
import { User } from '@/domain/entities/user'
import { Product } from '@/domain/entities/product'
import { mockProduct, mockUser } from '@/tests/domain/mocks/entities'

import { mock, MockProxy } from 'jest-mock-extended'
import { Order } from '@/domain/entities/order'

describe('CheckoutUseCase', () => {
  let sut: CheckoutUseCase
  let cryptoGatewaySpy: MockProxy<UUIDGenerator>
  let userRepositorySpy: MockProxy<LoadUserAccount>
  let productRepositorySpy: MockProxy<LoadProduct>
  let couponRepositorySpy: MockProxy<LoadCoupon>
  let orderRepositorySpy: MockProxy<SaveOrder>
  let inputStub: Checkout.Input
  let productStub: Product
  let userStub: User

  beforeAll(() => {
    userStub = mockUser()
    productStub = mockProduct()
    cryptoGatewaySpy = mock()
    cryptoGatewaySpy.uuid.mockReturnValue('any_uuid')
    userRepositorySpy = mock()
    userRepositorySpy.load.mockResolvedValue(userStub)
    productRepositorySpy = mock()
    productRepositorySpy.load.mockResolvedValue(productStub)
    couponRepositorySpy = mock()
    couponRepositorySpy.load.mockResolvedValue(undefined)
    orderRepositorySpy = mock()
  })

  beforeEach(() => {
    inputStub = {
      user: { id: 'any_user_id' },
      shipping: {
        address: { id: 'any_address_id' },
      },
      items: [
        {
          id: 'any_product_id',
          amount: 2,
        },
      ],
      coupons: ['any_coupon_code'],
    }
    sut = new CheckoutUseCase(
      cryptoGatewaySpy,
      userRepositorySpy,
      productRepositorySpy,
      couponRepositorySpy,
      orderRepositorySpy,
      mock()
    )
  })

  it('should extends Publisher', () => {
    expect(sut).toBeInstanceOf(Publisher)
  })

  it('should call load user with correct input', async () => {
    await sut.perform(inputStub)

    expect(userRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(userRepositorySpy.load).toHaveBeenCalledWith({ id: 'any_user_id' })
  })

  it('should return UserNotFoundError if load user return undefined', async () => {
    userRepositorySpy.load.mockResolvedValueOnce(undefined)
    const expectedOutput = new UserNotFoundError('any_user_id')

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedOutput)
  })

  it('should return OrderMustHaveAtLeastOneItemError if items array is empty', async () => {
    const expectedOutput = new OrderMustHaveAtLeastOneItemError()
    inputStub.items = []

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedOutput)
    expect(output).toBeInstanceOf(OrderMustHaveAtLeastOneItemError)
  })

  it('should call load product with correct input for each item', async () => {
    await sut.perform(inputStub)

    expect(productRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(productRepositorySpy.load).toHaveBeenCalledWith({ id: 'any_product_id' })
  })

  it('should return ProductNotFoundError if load product return undefined for any item', async () => {
    productRepositorySpy.load.mockResolvedValueOnce(undefined)
    const expectedOutput = new ProductNotFoundError('any_product_id')

    const output = await sut.perform(inputStub)

    expect(output).toEqual(expectedOutput)
  })

  it('should call load coupon with correct input for each coupon code', async () => {
    await sut.perform(inputStub)

    expect(couponRepositorySpy.load).toHaveBeenCalledTimes(1)
    expect(couponRepositorySpy.load).toHaveBeenCalledWith({ code: 'any_coupon_code' })
  })

  it('should call save order with correct input', async () => {
    const expectedOrder = new Order({
      id: 'any_uuid',
      shippingAddressId: 'any_shipping_address_uuid',
      userId: userStub.id,
    })
    expectedOrder.addItem(productStub, 2)

    await sut.perform(inputStub)

    expect(orderRepositorySpy.save).toHaveBeenCalledTimes(1)
    expect(orderRepositorySpy.save).toHaveBeenCalledWith(expectedOrder)
    expect(orderRepositorySpy.save).toHaveBeenCalledAfter(productRepositorySpy.load)
  })

  it('should call notify with correct input on success', async () => {
    const expectedOrder = new Order({
      id: 'any_uuid',
      shippingAddressId: 'any_shipping_address_uuid',
      userId: userStub.id,
    })
    expectedOrder.addItem(productStub, 2)
    const expectedEvent = new OrderPlacedEvent({ order: expectedOrder })
    const notifySpy = jest.spyOn(sut, 'notify')

    await sut.perform(inputStub)

    expect(notifySpy).toHaveBeenCalledTimes(1)
    expect(notifySpy).toHaveBeenCalledWith(expectedEvent)
    expect(notifySpy).toHaveBeenCalledAfter(orderRepositorySpy.save)
  })
})
