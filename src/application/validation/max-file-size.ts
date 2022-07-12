import { MaxFileSizeError } from '@/application/errors'
import { Validator } from '@/application/validation/validator'

export class MaxFileSize implements Validator {
  public constructor(private readonly maxSizeInMb: number, private readonly value: Buffer) {}

  public validate(): Error[] {
    const maxFileSizeInBytes = this.maxSizeInMb * 1024 * 1024
    if (this.value.length > maxFileSizeInBytes) return [new MaxFileSizeError(this.maxSizeInMb)]
    return []
  }
}
