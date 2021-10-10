import { TokenGenerator } from '@/domain/contracts/crypto'
import { sign } from 'jsonwebtoken'

type Input = TokenGenerator.Params
type Output = TokenGenerator.Result

export class JwtTokenHandler implements TokenGenerator {
  constructor (private readonly secret: string) {}

  async generateToken ({ expirationInMs, key }: Input): Promise<Output> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }
}
