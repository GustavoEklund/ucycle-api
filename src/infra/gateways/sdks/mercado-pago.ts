import MercadoPago from 'mercadopago'
import { CreatePayment } from '@/domain/contracts/gateways'

export class MercadoPagoSdkGateway implements CreatePayment {
  public constructor(
    private readonly accessToken: string,
    private readonly mercadoPagoPaymentRepository: any
  ) {
    MercadoPago.configurations.setAccessToken(accessToken)
  }

  public async createPayment(input: CreatePayment.Input): Promise<CreatePayment.Output> {
    const response = await MercadoPago.payment.create({
      payment_method_id: input.method.id,
      transaction_amount: input.totalInCents / 100,
      installments: input.installments,
      token: input.token,
      payer: {
        email: input.payer.email,
        type: 'customer',
      },
    })
    console.log(response)
    if (response.status !== 201) throw new Error('error creating payment')
    // await this.mercadoPagoPaymentRepository.save({
    //   id: response.body.id,
    //   orderCode: input.order.code,
    // })
    return response.body
  }
}
