export abstract class Either<L, R> {
  constructor(protected value: L | R) {}

  /**
   * Transforms the value in a `Right`, does nothing for a `Left`.
   */
  abstract map(f: (value: R) => any): Either<L, any>

  /**
   * Chains computations that return an `Either`.
   * Propagates `Left` if the current value is `Left`.
   */
  abstract flatMap(f: (value: R) => Either<L, R>): Either<L, any>

  /**
   * Returns the value inside a `Right` or the provided default value if `Left`.
   */
  abstract getOrElse(defaultValue: R): R

  /**
   * Determines if the instance is `Left`.
   */
  abstract isLeft(): boolean

  /**
   * Determines if the instance is `Right`.
   */
  abstract isRight(): boolean

  /**
   * Returns a string representation of the instance.
   */
  abstract toString(): string

  /**
   * Handles both `Left` and `Right` cases with provided functions.
   *
   * @param onLeft - Function to handle `Left`.
   * @param onRight - Function to handle `Right`.
   * @returns The result of the function that matches the instance.
   */
  fold<U>(onLeft: (error: L) => U, onRight: (value: R) => U): U {
    return this.isLeft() ? onLeft(this.value as L) : onRight(this.value as R)
  }

  /**
   * Factory method for creating a `Right` instance.
   *
   * @param value - The value to wrap in a `Right`.
   * @returns A `Right` instance.
   */
  static of<R>(value: R): Either<never, R> {
    return new Right(value)
  }

  /**
   * Factory method for creating a `Left` instance.
   *
   * @param value - The value to wrap in a `Left`.
   * @returns A `Left` instance.
   */
  static Left<L>(value: L): Either<L, never> {
    return new Left(value)
  }

  /**
   * Factory method for creating a `Right` instance.
   *
   * @param value - The value to wrap in a `Right`.
   * @returns A `Right` instance.
   */
  static Right<R>(value: R): Either<never, R> {
    return new Right(value)
  }
}

class Left<L, R> extends Either<L, R> {
  constructor(value: L) {
    // TODO: Force Left to be of type BundlerRpcError at compile time using TypeScript
    // intead of runtime check throwing an error
    // if (!(value instanceof BundlerRpcError)) {
    //   throw new Error('Left must be of type BundlerRpcError')
    // }
    super(value)
  }

  map(_: (value: R) => any): Either<L, any> {
    return this
  }

  flatMap(_: (value: R) => Either<L, any>): Either<L, any> {
    return this
  }

  getOrElse(defaultValue: R): R {
    return defaultValue
  }

  isLeft(): boolean {
    return true
  }

  isRight(): boolean {
    return false
  }

  toString() {
    const str = JSON.stringify(this.value)
    return `Left(${str})`
  }
}

class Right<L, R> extends Either<L, R> {
  constructor(value: R) {
    super(value)
  }

  map<U>(f: (value: R) => U): Either<L, U> {
    return Either.of(f(this.value as R))
  }

  flatMap<U>(f: (value: R) => Either<L, U>): Either<L, U> {
    return f(this.value as R)
  }

  getOrElse(_: R): R {
    return this.value as R
  }

  isLeft(): boolean {
    return false
  }

  isRight(): boolean {
    return true
  }

  toString() {
    const str = JSON.stringify(this.value)
    return `Right(${str})`
  }
}
