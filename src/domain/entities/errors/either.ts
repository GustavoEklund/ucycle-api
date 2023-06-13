import { Exception } from '@/domain/entities/errors/exception'

export class Either<T, E extends Exception> {
  private readonly _value?: T
  private readonly _error?: E

  public constructor(value?: T, error?: E) {
    if (value !== undefined && error !== undefined) {
      throw new Error('only one of value or error should be provided')
    }
    this._value = value
    this._error = error
  }

  public static valueOf<T, E extends Exception>(value: T): Either<T, E> {
    return new Either<T, E>(value)
  }

  public static errorOf<T, E extends Exception>(error: E): Either<T, E> {
    return new Either<T, E>(undefined, error)
  }

  public get isError(): boolean {
    return this._error !== undefined
  }

  public get isValue(): boolean {
    return this._value !== undefined
  }

  public get value(): T {
    if (this._value === undefined) throw new Error('value is undefined')
    return this._value
  }

  public get error(): E {
    if (this._error === undefined) throw new Error('error is undefined')
    return this._error
  }
}
