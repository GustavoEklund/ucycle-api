import { PgAddress, PgImage, PgUser } from '@/infra/repos/postgres/entities'

export const mockOrganization = ({
  ownerUser,
  address,
  pictures,
}: {
  ownerUser?: PgUser
  address?: PgAddress
  pictures?: PgImage[]
}) => ({
  name: 'any_name',
  ownerUser,
  pictures: Promise.resolve(pictures),
  address,
})
