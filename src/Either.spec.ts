import { validateUUIDAll, uuidValidationFn } from './Either'
import { NEA, E } from './lib'

describe('validateUUIDAll', () => {
  it('should return all errors', () => {
    expect(validateUUIDAll('123!', uuidValidationFn)).toEqual(
      E.left(
        NEA.of([
          'The input length is not 32',
          'The character should be digital or [a-f]',
          'The structure should be like ********-****-****-****-************',
        ])
      )
    )
  })
})
