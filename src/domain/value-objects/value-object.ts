export abstract class ValueObject {
  private static flatten(valueObject: ValueObject): string {
    return JSON.stringify(valueObject)
  }

  public equals(other: ValueObject): boolean {
    return ValueObject.flatten(this) === ValueObject.flatten(other)
  }
}
