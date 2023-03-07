import { ShippingCalculatorGateway } from '@/domain/contracts/gateways/shipping'
import { HttpGetClient } from '@/infra/gateways'

export class CorreiosShippingGateway implements ShippingCalculatorGateway {
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
    const url = new URL(`${this.baseCorreiosUrl}/calculador/CalcPrecoPrazo.aspx`)
    url.searchParams.append('nCdEmpresa', '')
    url.searchParams.append('sDsSenha', '')
    url.searchParams.append('nCdServico', '04014')
    url.searchParams.append('sCepOrigem', this.originZipcode)
    url.searchParams.append('sCepDestino', input.zipcode)
    url.searchParams.append('nVlPeso', String(input.item.weight))
    url.searchParams.append('nCdFormato', '1')
    url.searchParams.append('nVlComprimento', String(input.item.dimensions.length))
    url.searchParams.append('nVlAltura', String(input.item.dimensions.height))
    url.searchParams.append('nVlLargura', String(input.item.dimensions.width))
    url.searchParams.append('nVlDiametro', '0')
    url.searchParams.append('sCdMaoPropria', 'S')
    url.searchParams.append('nVlValorDeclarado', '0')
    url.searchParams.append('sCdAvisoRecebimento', 'N')
    const httpResponse = await this.httpClient.get<{ Valor: number; PrazoEntrega: string }>({
      url: url.toString(),
    })
    return {
      valueInCents: httpResponse.data.Valor * 100,
      estimatedDeliveryDate: new Date(httpResponse.data.PrazoEntrega),
    }
  }
}
