import { ShippingCalculatorGateway } from '@/domain/contracts/gateways/shipping'
import { HttpGetClient } from '@/infra/gateways'
import Xml2js from 'xml2js'

export class CorreiosShippingHttpClientGateway implements ShippingCalculatorGateway {
  public constructor(
    private readonly httpClient: HttpGetClient,
    private readonly baseCorreiosUrl: string,
    private readonly companyCode: string,
    private readonly password: string,
    private readonly originZipcode: string
  ) {}

  public async calculate(
    input: ShippingCalculatorGateway.Input
  ): Promise<ShippingCalculatorGateway.Output> {
    const urlSearchParams = new URLSearchParams({
      StrRetorno: 'xml',
      nCdEmpresa: '',
      sDsSenha: '',
      nCdServico: '04014',
      sCepOrigem: this.originZipcode,
      sCepDestino: input.zipcode,
      nVlPeso: String(input.item.weight),
      nCdFormato: '1',
      nVlComprimento: String(input.item.dimensions.length),
      nVlAltura: String(input.item.dimensions.height),
      nVlLargura: String(input.item.dimensions.width),
      nVlDiametro: '0',
      sCdMaoPropria: 'S',
      nVlValorDeclarado: '0',
      sCdAvisoRecebimento: 'N',
    })
    const httpResponse = await this.httpClient.get<{ Valor: number; PrazoEntrega: string }>({
      url: `${this.baseCorreiosUrl}/calculador/CalcPrecoPrazo.aspx?${urlSearchParams.toString()}`,
    })
    const shippingData: { freightPrice: number; estimatedDeliveryDate: Date } = await new Promise(
      (resolve, reject) => {
        new Xml2js.Parser().parseString(httpResponse, (error, result) => {
          if (error) return reject(error)
          const { Valor, PrazoEntrega } = result.Servicos.cServico[0]
          const freightPrice = parseFloat(Valor[0].replace(',', '.').replace(/[^\d.-]/g, ''))
          const freightDeadline = parseInt(PrazoEntrega[0])
          const estimatedDeliveryDate = new Date()
          estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + freightDeadline)
          return resolve({
            freightPrice,
            estimatedDeliveryDate,
          })
        })
      }
    )
    return {
      valueInCents: shippingData.freightPrice * 100,
      estimatedDeliveryDate: new Date(shippingData.estimatedDeliveryDate),
    }
  }
}
