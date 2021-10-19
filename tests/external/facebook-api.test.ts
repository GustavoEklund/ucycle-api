import { FacebookApi, AxiosHttpClient } from '@/infra/gateways'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({ token: 'EAAOZByg2qcXwBAPzKo8sWIiPNnTtdMfyMjb7dQvJKlUQZBgkZCAGtI4ZBlEBb3vFxQwKPZAsZBkurSdpGYe0906joQayx9eLrcjWirTWTsxmaqnig7xttMZAGpPhRF0wc8tTX0da4IrGG3bSSxgn6miF5fZCA7qZAdTYVgSNuLsSzNZAeej7rJD469kUhgZCx9lxBZBwcswhZCVSSIjCEVAtoivab' })

    expect(fbUser).toEqual({
      facebookId: '102784078829237',
      email: 'gustavo_hlmdyje_teste@tfbnw.net',
      name: 'Gustavo Teste'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid' })

    expect(fbUser).toBeUndefined()
  })
})
