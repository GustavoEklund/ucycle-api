import { Publisher } from '@/domain/events'
import { LoadContact, LoadDocument, SaveUserAccount } from '@/domain/contracts/repos'
import { User, UserAccount, UserAccountStatus, UserProfile } from '@/domain/entities/user'
import { EmailType, Phone, PhoneType } from '@/domain/entities/contact'
import { SaveKeycloakUserAccount, UUIDGenerator } from '@/domain/contracts/gateways'
import { Document, Name } from '@/domain/value-objects'
import { UserSignedUpEvent } from '@/domain/events/user'
import { DocumentAlreadyExistsError } from '@/domain/entities/errors/user'
import { ContactAlreadyExistsError } from '@/domain/entities/errors/contact'

export interface SignUp {
  perform: (input: SignUp.Input) => Promise<SignUp.Output>
}

export class SignUpUseCase extends Publisher implements SignUp {
  public constructor(
    private readonly userAccountRepo: SaveUserAccount,
    private readonly documentRepo: LoadDocument,
    private readonly contactRepo: LoadContact,
    private readonly crypto: UUIDGenerator,
    private readonly userAccountApi: SaveKeycloakUserAccount
  ) {
    super()
  }

  public async perform({ account, profile }: SignUp.Input): Promise<SignUp.Output> {
    const document = await this.documentRepo.load({
      number: Document.removeNonNumbers(account.document),
    })
    if (document !== undefined) return new DocumentAlreadyExistsError(account.document)
    const emailContact = await this.contactRepo.load({ value: account.email })
    if (emailContact !== undefined) return new ContactAlreadyExistsError(account.email)
    const phoneContact = await this.contactRepo.load({
      value: Phone.removeNonNumbers(account.phone),
    })
    if (phoneContact !== undefined) return new ContactAlreadyExistsError(account.phone)
    const userId = this.crypto.uuid()
    const profileUser = new UserProfile({ socialName: profile.socialName })
    const accountUser = new UserAccount({
      name: account.name,
      emails: [
        { value: account.email, label: EmailType.primary, verified: false, isPrivate: true },
      ],
      documents: [account.document],
      phones: [
        { value: account.phone, label: PhoneType.primary, verified: false, isPrivate: true },
      ],
      verified: false,
      status: UserAccountStatus.disabled,
      userId,
    })
    const userName = new Name({ value: account.name })
    const user = new User({
      id: userId,
      profile: profileUser,
      account: accountUser,
    })
    const { id: keycloakUserId } = await this.userAccountApi.saveWithKeycloak({
      firstName: userName.first,
      lastName: userName.last,
      email: account.email,
      password: account.password,
    })
    user.assignNewId(keycloakUserId)
    await this.userAccountRepo.save(user)
    const userSignedUpEvent = new UserSignedUpEvent({ user })
    await this.notify(userSignedUpEvent)
  }
}

export namespace SignUp {
  export type Input = {
    account: {
      name: string
      email: string
      phone: string
      document: string
      password: string
    }
    profile: {
      socialName: string
    }
  }
  export type Output = undefined | DocumentAlreadyExistsError | ContactAlreadyExistsError
}
