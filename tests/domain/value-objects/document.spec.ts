import { Document, DocumentType } from '@/domain/value-objects'

describe('Document', () => {
  it('should be a valid cpf document', () => {
    const sut = new Document('342.444.198-88')

    expect(sut.type).toBe(DocumentType.cpf)
    expect(sut.number).toBe('34244419888')
  })
})
