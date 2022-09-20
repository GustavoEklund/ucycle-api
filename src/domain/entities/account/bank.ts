export class Bank {
  private _ispb: string // Identificador de Sistema de Pagamento Brasileiro
  private _compe: string // Código do Sistema de Operações Monetárias e Compensações de Outros Papéis
  private _name: string

  public constructor(input: { ispb: string; compe: string; name: string }) {
    this._ispb = input.ispb
    this._compe = input.compe
    this._name = input.name
  }
}
