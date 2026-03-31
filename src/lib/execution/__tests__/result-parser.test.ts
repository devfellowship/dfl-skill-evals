import { describe, it, expect } from 'vitest'
import { parseJudge0Result } from '../result-parser'
import type { Judge0Result } from '../../judge0-config'

const makeTestCase = (input = '5', expectedOutput: string | number[] = '5') => ({
  input,
  expectedOutput,
})

const makeResult = (overrides: Partial<Judge0Result> = {}): Judge0Result => ({
  id: 'test-id',
  status: { id: 3, description: 'Accepted' },
  stdout: String((overrides as any).stdout ?? '5'),
  ...overrides,
})

describe('parseJudge0Result', () => {
  it('returns error status on compile_output', () => {
    const result = makeResult({ compile_output: 'SyntaxError: unexpected token' })
    const parsed = parseJudge0Result(result, makeTestCase())
    expect(parsed.status).toBe('error')
    expect(parsed.error).toMatch(/Compilation Error/)
  })

  it('returns error status on stderr', () => {
    const result = makeResult({ stderr: 'ReferenceError: x is not defined', stdout: undefined })
    const parsed = parseJudge0Result(result, makeTestCase())
    expect(parsed.status).toBe('error')
    expect(parsed.error).toMatch(/Runtime Error/)
  })

  it('returns error for status id 6 (compile error)', () => {
    const result = makeResult({ status: { id: 6, description: 'Compilation Error' }, stdout: undefined })
    const parsed = parseJudge0Result(result, makeTestCase())
    expect(parsed.status).toBe('error')
    expect(parsed.error).toBe('Compilation Error')
  })

  it('returns error for status id 5 (TLE)', () => {
    const result = makeResult({ status: { id: 5, description: 'TLE' }, stdout: undefined })
    const parsed = parseJudge0Result(result, makeTestCase())
    expect(parsed.status).toBe('error')
    expect(parsed.error).toBe('Time Limit Exceeded')
  })

  it('returns error for status id 4 (wrong answer)', () => {
    const result = makeResult({ status: { id: 4, description: 'Wrong Answer' }, stdout: undefined })
    const parsed = parseJudge0Result(result, makeTestCase())
    expect(parsed.status).toBe('error')
    expect(parsed.error).toBe('Wrong Answer')
  })

  it('returns error when no stdout', () => {
    const result = makeResult({ stdout: undefined })
    const parsed = parseJudge0Result(result, makeTestCase())
    expect(parsed.status).toBe('error')
    expect(parsed.error).toBe('No output generated')
  })

  it('returns error when stdout begins with ERROR:', () => {
    const result = makeResult({ stdout: 'ERROR: division by zero' })
    const parsed = parseJudge0Result(result, makeTestCase())
    expect(parsed.status).toBe('error')
    expect(parsed.error).toBe('division by zero')
  })

  it('marks as passed when output matches expected', () => {
    const result = makeResult({ stdout: '5' })
    const parsed = parseJudge0Result(result, makeTestCase('5', '5'))
    expect(parsed.status).toBe('passed')
    expect(parsed.actualOutput).toBe('5')
  })

  it('marks as failed when output does not match expected', () => {
    const result = makeResult({ stdout: '10' })
    const parsed = parseJudge0Result(result, makeTestCase('5', '5'))
    expect(parsed.status).toBe('failed')
  })

  it('handles array expected output via JSON comparison', () => {
    const result = makeResult({ stdout: '[1,2,3]' })
    const parsed = parseJudge0Result(result, makeTestCase('[1,2,3]', [1, 2, 3]))
    expect(parsed.status).toBe('passed')
  })

  it('propagates memory from result', () => {
    const result = makeResult({ stdout: '5', memory: '1024' })
    const parsed = parseJudge0Result(result, makeTestCase())
    expect(parsed.memory).toBe('1024')
  })
})
