export interface CreatePayment {
  createPayment: (input: CreatePayment.Input) => Promise<CreatePayment.Output>
}

export namespace CreatePayment {
  export type Input = {
    order: {
      code: string
    }
    method: {
      id: string
    }
    payer: {
      id: string
      email: string
    }
    totalInCents: number
    installments: number
    token: string
  }
  export type Output = any
}
