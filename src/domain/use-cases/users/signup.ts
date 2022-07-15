import { Publisher } from '@/domain/events'
import { LoadContact, LoadDocument, SaveUserAccount } from '@/domain/contracts/repos'
import { ContactAlreadyExistsError, DocumentAlreadyExistsError } from '@/domain/entities/errors'
import { User, UserAccount, UserAccountStatus, UserProfile } from '@/domain/entities/user'
import { EmailType, PhoneType } from '@/domain/value-objects/contact'
import { UUIDGenerator } from '@/domain/contracts/gateways'

export interface SignUp {
  perform: (input: SignUp.Input) => Promise<SignUp.Output>
}

export class SignUpUseCase extends Publisher implements SignUp {
  public constructor(
    private readonly userAccountRepo: SaveUserAccount,
    private readonly documentRepo: LoadDocument,
    private readonly contactRepo: LoadContact,
    private readonly crypto: UUIDGenerator
  ) {
    super()
  }

  public async perform({ account, profile }: SignUp.Input): Promise<SignUp.Output> {
    const document = await this.documentRepo.load({ number: account.document })
    if (document !== undefined) return new DocumentAlreadyExistsError(account.document)
    const emailContact = await this.contactRepo.load({ value: account.email })
    if (emailContact !== undefined) return new ContactAlreadyExistsError(account.email)
    const phoneContact = await this.contactRepo.load({ value: account.phone })
    if (phoneContact !== undefined) return new ContactAlreadyExistsError(account.phone)
    const profileUser = new UserProfile({ socialName: profile.socialName })
    const accountUser = new UserAccount({
      name: account.name,
      emails: [{ value: account.email, label: EmailType.primary }],
      documents: [account.document],
      phones: [{ value: account.phone, label: PhoneType.whatsapp }],
      verified: false,
      status: UserAccountStatus.disabled,
    })
    const userId = this.crypto.uuid()
    const userCreate = new User({
      id: userId,
      profile: profileUser,
      account: accountUser,
    })
    await this.userAccountRepo.save(userCreate)
  }
}

export namespace SignUp {
  export type Input = {
    account: {
      name: string
      email: string
      phone: string
      document: string
    }
    profile: {
      socialName: string
    }
  }
  export type Output = void | undefined | DocumentAlreadyExistsError
}
