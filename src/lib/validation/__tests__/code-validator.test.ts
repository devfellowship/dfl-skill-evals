import { describe, it, expect } from 'vitest'
import { validateCodeStructure, validateNoExtraCode } from '../code-validator'

describe('validateCodeStructure', () => {
  it('accepts a standard function declaration', () => {
    const code = 'function twoSum(nums, target) { return []; }'
    expect(validateCodeStructure(code, 'twoSum').isValid).toBe(true)
  })

  it('accepts a const arrow function', () => {
    const code = 'const twoSum = (nums, target) => { return []; }'
    expect(validateCodeStructure(code, 'twoSum').isValid).toBe(true)
  })

  it('accepts a const function expression', () => {
    const code = 'const twoSum = function(nums, target) { return []; }'
    expect(validateCodeStructure(code, 'twoSum').isValid).toBe(true)
  })

  it('rejects code missing the target function', () => {
    const code = 'function wrongName(a) { return a; }'
    const result = validateCodeStructure(code, 'twoSum')
    expect(result.isValid).toBe(false)
    expect(result.error).toContain('twoSum')
  })

  it('rejects empty code', () => {
    const result = validateCodeStructure('', 'twoSum')
    expect(result.isValid).toBe(false)
  })
})

describe('validateNoExtraCode', () => {
  it('passes when there is no code after the function closing brace', () => {
    const code = 'function add(a, b) { return a + b; }'
    expect(validateNoExtraCode(code, 'add').isValid).toBe(true)
  })

  it('fails when there is code after the function closing brace', () => {
    const code = 'function add(a, b) { return a + b; }\nconsole.log("extra")'
    const result = validateNoExtraCode(code, 'add')
    expect(result.isValid).toBe(false)
    expect(result.error).toMatch(/extra/i)
  })

  it('passes when the function name is not found (no extra code possible)', () => {
    // If the function doesn't exist the parser can't find extra code, returns valid
    const result = validateNoExtraCode('', 'notfound')
    expect(result.isValid).toBe(true)
  })
})
