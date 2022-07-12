import { Name, ValueObject } from '@/domain/value-objects'

export class UserProfile extends ValueObject {
  initials?: string
  pictureUrl?: string
  public socialName?: Name

  public constructor({ socialName }: { socialName?: string }) {
    super()
    if (socialName !== undefined) this.socialName = new Name({ value: socialName })
  }

  public updatePicture({ pictureUrl, name }: { pictureUrl?: string; name?: string }): void {
    this.pictureUrl = pictureUrl
    if (pictureUrl !== undefined || name === undefined || name === '') return
    const firstLetters = name.match(/\b(.)/g)!
    this.initials =
      firstLetters.length > 1
        ? `${firstLetters.shift()!}${firstLetters.pop()!}`.toUpperCase()
        : name.substring(0, 2).toUpperCase()
  }

  public updateSocialName({ name }: { name: string }): void {
    this.socialName = new Name({ value: name })
  }
}
