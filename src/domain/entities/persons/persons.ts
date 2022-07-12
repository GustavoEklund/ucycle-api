// TODO: create document and contact repository

type personsData = {
  firstName: string
  lastName: string
  // document: Address;
  // contact: number;
  birthDate?: string
  professional?: string
  marriedStatus?: string
  specialNeeds: boolean
  specialNeedsDescription?: string
}

export class Person {
  public readonly firstName: string
  public readonly lastName: string
  // public readonly document: Address;
  // public readonly contact: number;
  public readonly birthDate?: string
  public readonly professional?: string
  public readonly marriedStatus?: string
  public readonly specialNeeds: boolean
  public readonly specialNeedsDescription?: string

  constructor({
    firstName,
    lastName,
    // document,
    // contact,
    birthDate,
    professional,
    marriedStatus,
    specialNeeds,
    specialNeedsDescription,
  }: personsData) {
    this.firstName = firstName
    this.lastName = lastName
    // this.document = document
    // this.contact = contact
    this.birthDate = birthDate
    this.professional = professional
    this.marriedStatus = marriedStatus
    this.specialNeeds = specialNeeds
    this.specialNeedsDescription = specialNeedsDescription
  }
}
