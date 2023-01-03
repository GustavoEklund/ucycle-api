import { Document, DocumentType } from '@/domain/value-objects'
import { InvalidDocumentError } from '@/domain/entities/errors/user'

describe('Document', () => {
  it('should be a valid cpf document', () => {
    ;[
      '342.444.198-88',
      '342.444.198.88',
      '350.45261819',
      '693-319-118-40',
      '3.6.8.8.9.2.5.5.4.8.8',
      '11598647644',
      '86734718697',
      '86223423284',
      '24845408333',
      '95574461102',
    ].forEach((cpf) => {
      const sut = new Document(cpf)

      expect(sut.type).toBe(DocumentType.cpf)
      expect(sut.number).toBe(cpf.replace(/\D/g, ''))
    })
  })

  it('should be a invalid cpf document', () => {
    ;[
      '',
      '01234567890',
      '000.000.000-00',
      '111.222.444-05',
      '999999999.99',
      '8.8.8.8.8.8.8.8.8.8.8',
      '693-319-110-40',
      '698.111-111.00',
      '11111111111',
      '22222222222',
      '12345678900',
      '99299929384',
      '84434895894',
      '44242340000',
      '1',
      '22',
      '123',
      '992999999999929384',
    ].forEach((cpf) => {
      expect(() => new Document(cpf)).toThrow(new InvalidDocumentError())
    })
  })

  it('should be a valid cnpj document', () => {
    ;[
      '32.063.364/0001-07',
      '24.663.454/0001-00',
      '57.535.083/0001-30',
      '24.760.428/0001-09',
      '27.355.204/0001-00',
      '36.310.327/0001-07',
      '38175021000110',
      '37550610000179',
      '12774546000189',
      '77456211000168',
      '02023077000102',
    ].forEach((cnpj) => {
      const sut = new Document(cnpj)

      expect(sut.type).toBe(DocumentType.cnpj)
      expect(sut.number).toBe(cnpj.replace(/\D/g, ''))
    })
  })

  it('should be a invalid cnpj document', () => {
    ;[
      '12.345.678/9012-34',
      '11.111.111/1111-11',
      '00000000000000',
      '11111111111111',
      '22222222222222',
      '33333333333333',
      '44444444444444',
      '55555555555555',
      '66666666666666',
      '77777777777777',
      '88888888888888',
      '99999999999999',
      '12345678900123',
      '99299929384987',
      '84434895894444',
      '44242340000000',
      '1',
      '22',
      '123',
      '992999999999929384',
      '99-010-0.',
    ].forEach((cnpj) => {
      try {
        const sut = new Document(cnpj)
        console.log('cnpj válido: ', cnpj, ' tipo: ', sut.type)
      } catch (error) {}
      expect(() => new Document(cnpj)).toThrow(new InvalidDocumentError())
    })
  })
})
