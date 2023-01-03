import { EmailTemplate } from '@/domain/entities/email-template'

export interface LoadEmailTemplate {
  load: (input: LoadEmailTemplate.Input) => Promise<LoadEmailTemplate.Output>
}

export namespace LoadEmailTemplate {
  export type Input = {
    code: string
  }
  export type Output = EmailTemplate | undefined
}
