import { TokenGenerator } from '@/domain/contracts/crypto'
import { JwtTokenHandler } from '@/infra/crypto'
import { env } from '@/main/config/env'

export const makeJwtTokenGenerator = (): TokenGenerator => {
  return new JwtTokenHandler(env.jwtSecret)
}
