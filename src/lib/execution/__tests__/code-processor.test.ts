import { describe, it, expect } from 'vitest'
import { transpileTsToJs, parseTestCaseInput, createExecutableCode } from '../code-processor'

describe('transpileTsToJs', () => {
  it('removes TypeScript type annotations', () => {
    const ts = 'function add(a: number, b: number): number { return a + b; }'
    const js = transpileTsToJs(ts)
    expect(js).not.toContain(': number')
  })

  it('removes export keyword', () => {
    const ts = 'export function foo() { return 1; }'
    const js = transpileTsToJs(ts)
    expect(js).not.toContain('export ')
  })

  it('removes import statements', () => {
    const ts = "import { foo } from './bar';\nfunction test() {}"
    const js = transpileTsToJs(ts)
    expect(js).not.toContain('import')
  })

  it('returns a trimmed string', () => {
    const ts = '  function noop() {}  '
    expect(transpileTsToJs(ts).trim()).toBe(transpileTsToJs(ts))
  })
})

describe('parseTestCaseInput', () => {
  it('parses a single number', () => {
    expect(parseTestCaseInput('5')).toEqual([5])
  })

  it('parses a single string in quotes', () => {
    expect(parseTestCaseInput('"hello"')).toEqual(['hello'])
  })

  it('parses an array literal', () => {
    expect(parseTestCaseInput('[1, 2, 3]')).toEqual([[1, 2, 3]])
  })

  it('parses multiple comma-separated arguments', () => {
    const result = parseTestCaseInput('[1,2], 3')
    expect(result[0]).toEqual([1, 2])
    expect(result[1]).toBe(3)
  })

  it('parses true / false booleans', () => {
    expect(parseTestCaseInput('true')).toEqual([true])
    expect(parseTestCaseInput('false')).toEqual([false])
  })
})

describe('createExecutableCode', () => {
  const userCode = 'function add(a, b) { return a + b; }'

  it('wraps the function for TypeScript (languageId 74)', () => {
    const code = createExecutableCode(userCode, 'add', '1, 2', 74)
    expect(code).toContain('add(1, 2)')
    expect(code).toContain('console.log')
    expect(code).toContain(userCode)
  })

  it('wraps the function for JavaScript Node.js (languageId 63)', () => {
    const code = createExecutableCode(userCode, 'add', '1, 2', 63)
    expect(code).toContain('add(1, 2)')
    expect(code).toContain('console.log')
  })

  it('wraps the function for other language IDs', () => {
    const code = createExecutableCode(userCode, 'add', '1, 2', 71)
    expect(code).toContain('add(1, 2)')
  })
})
