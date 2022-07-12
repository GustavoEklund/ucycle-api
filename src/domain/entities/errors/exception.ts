export class Exception extends Error {
  public readonly code: string

  public constructor(name: string, message: string) {
    super(message)
    this.name = name
    this.code = Exception.pascalCaseToSnakeCase(this.name)
  }

  private static pascalCaseToSnakeCase(str: string): string {
    return str
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/^_/, '')
      .toUpperCase()
  }
}
