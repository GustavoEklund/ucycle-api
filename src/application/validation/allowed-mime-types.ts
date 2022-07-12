import { InvalidMimeTypeError } from '@/application/errors'
import { Validator } from '@/application/validation/validator'

export type Extension = 'png' | 'jpg' | 'csv'

export class AllowedMimeTypes implements Validator {
  public constructor(private readonly allowed: Extension[], private readonly mimeType: string) {}

  public validate(): Error[] {
    let isValid = false
    if (this.isPng()) isValid = true
    else if (this.isJpg()) isValid = true
    else if (this.isCsv()) isValid = true
    if (isValid) return []
    return [new InvalidMimeTypeError(this.allowed)]
  }

  private isPng(): boolean {
    return this.allowed.includes('png') && this.mimeType === 'image/png'
  }

  private isJpg(): boolean {
    return this.allowed.includes('jpg') && /image\/jpe?g/.test(this.mimeType)
  }

  private isCsv(): boolean {
    return this.allowed.includes('csv') && this.mimeType === 'text/csv'
  }
}
