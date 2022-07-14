import { Publisher } from '@/domain/events'
import { LoadDocument } from '@/domain/contracts/repos'

export interface SignUp {
  perform: (input: SignUp.Input) => Promise<SignUp.Output>
}

export class SignUpUseCase extends Publisher implements SignUp {
  public constructor(private readonly documentRepo: LoadDocument) {
    super()
  }

  public async perform({ account, profile }: SignUp.Input): Promise<SignUp.Output> {
    await this.documentRepo.load({ number: account.documents[0] })
  }
}

export namespace SignUp {
  export type Input = {
    account: {
      name: string
      emails: string[]
      phones: string[]
      documents: string[]
    }
    profile: {
      socialName: string
    }
  }
  export type Output = void
}
