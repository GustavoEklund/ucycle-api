export interface ShippingCalculatorGateway {
  calculate: (input: ShippingCalculatorGateway.Input) => Promise<ShippingCalculatorGateway.Output>
}

export namespace ShippingCalculatorGateway {
  export type Input = {
    zipcode: string
    buildingNumber: string
    item: {
      dimensions: {
        height: number
        width: number
        length: number
      }
      weight: number
    }
  }
  export type Output = {
    estimatedDeliveryDate: Date
    valueInCents: number
  }
}
