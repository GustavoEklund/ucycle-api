import { Publisher } from '@/domain/events'
import { LoadContact, LoadDocument } from '@/domain/contracts/repos'
import { ContactAlreadyExistsError, DocumentAlreadyExistsError } from '@/domain/entities/errors'

export interface SignUp {
  perform: (input: SignUp.Input) => Promise<SignUp.Output>
}

export class SignUpUseCase extends Publisher implements SignUp {
  public constructor(
    private readonly documentRepo: LoadDocument,
    private readonly contactRepo: LoadContact
  ) {
    super()
  }

  public async perform({ account, profile }: SignUp.Input): Promise<SignUp.Output> {
    const cpf = account.documents[0]
    const document = await this.documentRepo.load({ number: cpf })
    if (document !== undefined) return new DocumentAlreadyExistsError(cpf)
    const emailContact = await this.contactRepo.load({ value: account.emails[0] })
    if (emailContact !== undefined) return new ContactAlreadyExistsError(account.emails[0])
    await this.contactRepo.load({ value: account.phones[0] })
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
  export type Output = void | undefined | DocumentAlreadyExistsError
}
