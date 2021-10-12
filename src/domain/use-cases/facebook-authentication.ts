import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos'
import { AuthenticationError } from '@/domain/entities/errors'
import { AccessToken, FacebookAccount } from '@/domain/entities'
import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'

type Setup = (
  facebook: LoadFacebookUser,
  userAccount: LoadUserAccount & SaveFacebookAccount,
  token: TokenGenerator
) => FacebookAuthentication
type Input = { token: string }
type Output = { accessToken: string }
export type FacebookAuthentication = (params: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (
  facebook,
  userAccount,
  token
) => async params => {
  const fbData = await facebook.loadUser(params)
  if (fbData !== undefined) {
    const accountData = await userAccount.load({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await userAccount.saveWithFacebook(fbAccount)
    const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }
  throw new AuthenticationError()
}
