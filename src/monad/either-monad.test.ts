import { describe, it, expect, vi } from 'vitest'
import { Either } from './either-monad'

/**
 * Set of helper functions to test the Either monad
 *
 * @returns - Object containing helper functions
 */
const helpers = () => {
  const safeDivide = (a: number, b: number): Either<Error, number> => {
    return b === 0
      ? Either.Left(new Error('Cannot divide by zero'))
      : Either.Right(a / b)
  }

  return {
    worldToLogTranseptor: (str: string) =>
      str.replace(/world/, 'LogTranseptor'),
    parseNumber: (input: string): Either<Error, number> => {
      const num = parseFloat(input)
      return isNaN(num)
        ? Either.Left(new Error('Invalid number'))
        : Either.Right(num)
    },

    addTen: (num: number): number => num + 10,

    divideByTwo: (num: number): Either<Error, number> => {
      return safeDivide(num, 2)
    },

    divideByZero: (num: number): Either<Error, number> => {
      return safeDivide(num, 0)
    },

    stringifyResult: (num: number): Either<Error, string> => {
      return Either.Right(`Result is: ${num}`)
    },
  }
}

describe('Either monad', () => {
  describe('Right', () => {
    describe('map', () => {
      it('should transform the value in Right', async () => {
        const hp = helpers()
        const worldToLogTranseptorSpy = vi.spyOn(hp, 'worldToLogTranseptor')
        const { worldToLogTranseptor } = hp

        const rightHello = Either.Right('Hello world')

        const resRight = rightHello.map(worldToLogTranseptor)
        const mutatedVal = resRight.getOrElse(null)

        expect(resRight.isRight()).toEqual(true)
        expect(mutatedVal).toEqual('Hello LogTranseptor')
        expect(worldToLogTranseptorSpy).toHaveBeenCalledOnce()
      })
    })

    describe('flatMap', () => {
      it('should chain computation', async () => {
        const hp = helpers()
        const parseNumberSpy = vi.spyOn(hp, 'parseNumber')
        const addTenSpy = vi.spyOn(hp, 'addTen')
        const divideByTwoSpy = vi.spyOn(hp, 'divideByTwo')
        const stringifyResultSpy = vi.spyOn(hp, 'stringifyResult')
        const { parseNumber, addTen, divideByTwo, stringifyResult } = hp

        const res = parseNumber('20')
          .map(addTen) // Adds 10 to the parsed number
          .flatMap(divideByTwo) // Safely divides by 2
          .flatMap(stringifyResult) // Formats the result as a string

        // result
        const chainComputationVal = res.getOrElse(null)
        expect(res.isRight()).toEqual(true)
        expect(chainComputationVal).toEqual('Result is: 15')

        // calls
        expect(parseNumberSpy).toHaveBeenCalledOnce()
        expect(addTenSpy).toHaveBeenCalledOnce()
        expect(divideByTwoSpy).toHaveBeenCalledOnce()
        expect(stringifyResultSpy).toHaveBeenCalledOnce()
      })
    })

    describe('fold', () => {
      it('should only run right function', async () => {
        const { parseNumber, addTen } = helpers()

        const res = parseNumber('20').map(addTen)

        res.fold(
          (_) => {
            // should force the test to fail if this function is called
            expect(true).toEqual(false)
          },
          (success) => {
            expect(success).toEqual(30)
          },
        )
      })
    })
  })

  describe('Left', () => {
    describe('map', () => {
      it('should not transform the value in Left', async () => {
        const hp = helpers()
        const worldToLogTranseptorSpy = vi.spyOn(hp, 'worldToLogTranseptor')
        const { worldToLogTranseptor } = hp

        const leftError = Either.Left(new Error('Sorry got an error'))

        const resLeft = leftError.map(worldToLogTranseptor)
        const mutatedVal = resLeft.getOrElse(null)

        expect(resLeft.isLeft()).toEqual(true)
        expect(mutatedVal).toEqual(null)
        expect(worldToLogTranseptorSpy).not.toHaveBeenCalled()
      })
    })

    describe('flatMap', () => {
      it('should stop chain computation when Left returned', async () => {
        const hp = helpers()
        const parseNumberSpy = vi.spyOn(hp, 'parseNumber')
        const addTenSpy = vi.spyOn(hp, 'addTen')
        const divideByZeroSpy = vi.spyOn(hp, 'divideByZero')
        const stringifyResultSpy = vi.spyOn(hp, 'stringifyResult')

        const { parseNumber, addTen, divideByZero, stringifyResult } = hp

        const res = parseNumber('10')
          .map(addTen) // Adds 10 to the parsed number
          .flatMap(divideByZero) // (should return Left) since division by zero
          .flatMap(stringifyResult) // Formats the result as a string (should not be called)

        // result
        const chainComputationVal = res.getOrElse(null)
        expect(res.isLeft()).toEqual(true)
        expect(chainComputationVal).toEqual(null)

        // calls
        expect(parseNumberSpy).toHaveBeenCalledOnce()
        expect(addTenSpy).toHaveBeenCalledOnce()
        expect(divideByZeroSpy).toHaveBeenCalledOnce()
        expect(stringifyResultSpy).not.toHaveBeenCalled()
      })
    })

    describe('fold', () => {
      it('should only run left function', async () => {
        const { parseNumber, addTen, divideByZero } = helpers()

        const res = parseNumber('20').map(addTen).flatMap(divideByZero)

        res.fold(
          (error) => {
            expect(error).toEqual(new Error('Cannot divide by zero'))
          },
          (_) => {
            // should force the test to fail if this function is called
            expect(true).toEqual(false)
          },
        )
      })
    })
  })
})
