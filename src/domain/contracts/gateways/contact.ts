import { Contact } from '@/domain/entities/contact'

export interface RequestContactVerification {
  requestVerification: (input: RequestContactVerification.Input) => Promise<void>
}

export namespace RequestContactVerification {
  export type Input = Contact
}

export interface VerifyContact {
  verify: (input: VerifyContact.Input) => Promise<VerifyContact.Output>
}

export namespace VerifyContact {
  export type Input = {
    contact: Contact
    code: string
  }
  export type Output = {
    didVerificationSucceed: boolean
  }
}
