export interface Mailer {
  send: (input: Mailer.Input) => Promise<Mailer.Output>
  sendWithTemplate: (input: Mailer.InputWithTemplate) => Promise<Mailer.Output>
}

export namespace Mailer {
  export type Input = {
    subject?: string
    recipient: {
      name?: string
      email: string
    }
    sender?: {
      name?: string
      email: string
    }
    body?: string
  }
  export type InputWithTemplate = Input & {
    template: {
      code: string
      data: { [key: string]: any }
    }
  }
  export type Output = void
}
