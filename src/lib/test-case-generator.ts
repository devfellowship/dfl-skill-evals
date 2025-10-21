import type { TestCase, TestCaseGenerator } from '@/types/challenges/test-cases'
export class SeededRandom {
  private seed: number
  constructor(seed: number) {
    this.seed = seed
  }
  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280
    return this.seed / 233280
  }
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min
  }
  nextArray<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)]
  }
}
export class TwoSumTestCaseGenerator implements TestCaseGenerator {
  generateTestCases(seed: number, count: number): TestCase[] {
    const random = new SeededRandom(seed)
    const testCases: TestCase[] = []
    for (let i = 0; i < count; i++) {
      const testCase = this.generateSingleTestCase(random, i, seed)
      testCases.push(testCase)
    }
    return testCases
  }
  private generateSingleTestCase(random: SeededRandom, index: number, seed: number): TestCase {
    const arraySize = random.nextInt(5, 20)
    const nums = this.generateRandomArray(random, arraySize)
    const target = this.generateTarget(random, nums)
    const input = `[${nums.join(',')}], ${target}`
    const expectedOutput = this.solveTwoSum(nums, target)
    return {
      id: `test_${seed}_${index}`,
      challenge_id: 'two-sum', 
      seed: seed,
      input,
      expected_output: JSON.stringify(expectedOutput),
      description: `Test case ${index + 1} (seed: ${seed})`,
      is_hidden: index >= 3,
      created_at: new Date().toISOString()
    }
  }
  private generateRandomArray(random: SeededRandom, size: number): number[] {
    const nums: number[] = []
    for (let i = 0; i < size; i++) {
      nums.push(random.nextInt(-100, 100))
    }
    return nums
  }
  private generateTarget(random: SeededRandom, nums: number[]): number {
    const indices = [random.nextInt(0, nums.length - 1), random.nextInt(0, nums.length - 1)]
    return nums[indices[0]] + nums[indices[1]]
  }
  private solveTwoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>()
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i]
      if (map.has(complement)) {
        return [map.get(complement)!, i]
      }
      map.set(nums[i], i)
    }
    return []
  }
  validateOutput(input: string, output: string): boolean {
    try {
      const [numsStr, targetStr] = input.split(', ')
      const nums = JSON.parse(numsStr)
      const target = parseInt(targetStr)
      const result = JSON.parse(output)
      if (!Array.isArray(result) || result.length !== 2) return false
      const [i, j] = result
      return nums[i] + nums[j] === target
    } catch {
      return false
    }
  }
}
export class FibonacciTestCaseGenerator implements TestCaseGenerator {
  generateTestCases(seed: number, count: number): TestCase[] {
    const random = new SeededRandom(seed)
    const testCases: TestCase[] = []
    for (let i = 0; i < count; i++) {
      const testCase = this.generateSingleTestCase(random, i, seed)
      testCases.push(testCase)
    }
    return testCases
  }
  private generateSingleTestCase(random: SeededRandom, index: number, seed: number): TestCase {
    const n = random.nextInt(0, 20)
    const input = n.toString()
    const expectedOutput = this.solveFibonacci(n)
    return {
      id: `test_${seed}_${index}`,
      challenge_id: 'fibonacci',
      seed: seed,
      input,
      expected_output: expectedOutput.toString(),
      description: `Test case ${index + 1} (seed: ${seed})`,
      is_hidden: index >= 3,
      created_at: new Date().toISOString()
    }
  }
  private solveFibonacci(n: number): number {
    if (n <= 1) return n
    let a = 0, b = 1
    for (let i = 2; i <= n; i++) {
      const temp = a + b
      a = b
      b = temp
    }
    return b
  }
  validateOutput(input: string, output: string): boolean {
    try {
      const n = parseInt(input)
      const expected = this.solveFibonacci(n)
      const result = parseInt(output)
      return result === expected
    } catch {
      return false
    }
  }
}
export class PalindromeTestCaseGenerator implements TestCaseGenerator {
  generateTestCases(seed: number, count: number): TestCase[] {
    const random = new SeededRandom(seed)
    const testCases: TestCase[] = []
    for (let i = 0; i < count; i++) {
      const testCase = this.generateSingleTestCase(random, i, seed)
      testCases.push(testCase)
    }
    return testCases
  }
  private generateSingleTestCase(random: SeededRandom, index: number, seed: number): TestCase {
    const isPalindrome = random.next() > 0.5
    const input = this.generateString(random, isPalindrome)
    const expectedOutput = this.solvePalindrome(input)
    return {
      id: `test_${seed}_${index}`,
      challenge_id: 'palindrome',
      seed: seed,
      input: `"${input}"`,
      expected_output: expectedOutput.toString(),
      description: `Test case ${index + 1} (seed: ${seed})`,
      is_hidden: index >= 3,
      created_at: new Date().toISOString()
    }
  }
  private generateString(random: SeededRandom, shouldBePalindrome: boolean): string {
    const length = random.nextInt(3, 15)
    const chars = 'abcdefghijklmnopqrstuvwxyz'
    let str = ''
    for (let i = 0; i < length; i++) {
      str += chars[random.nextInt(0, chars.length - 1)]
    }
    if (shouldBePalindrome) {
      const half = Math.floor(str.length / 2)
      for (let i = 0; i < half; i++) {
        str = str.substring(0, str.length - 1 - i) + str[i] + str.substring(str.length - i)
      }
    }
    return str
  }
  private solvePalindrome(s: string): boolean {
    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '')
    let left = 0
    let right = cleaned.length - 1
    while (left < right) {
      if (cleaned[left] !== cleaned[right]) {
        return false
      }
      left++
      right--
    }
    return true
  }
  validateOutput(input: string, output: string): boolean {
    try {
      const cleanInput = input.replace(/"/g, '')
      const expected = this.solvePalindrome(cleanInput)
      const result = output.toLowerCase() === 'true'
      return result === expected
    } catch {
      return false
    }
  }
}
export class ArraySumTestCaseGenerator implements TestCaseGenerator {
  generateTestCases(seed: number, count: number): TestCase[] {
    const random = new SeededRandom(seed)
    const testCases: TestCase[] = []
    for (let i = 0; i < count; i++) {
      const testCase = this.generateSingleTestCase(random, i, seed)
      testCases.push(testCase)
    }
    return testCases
  }
  private generateSingleTestCase(random: SeededRandom, index: number, seed: number): TestCase {
    const arraySize = random.nextInt(3, 10)
    const nums = this.generateRandomArray(random, arraySize)
    const input = `[${nums.join(',')}]`
    const expectedOutput = this.solveArraySum(nums)
    return {
      id: `test_${seed}_${index}`,
      challenge_id: 'array-sum',
      seed: seed,
      input,
      expected_output: expectedOutput.toString(),
      description: `Test case ${index + 1} (seed: ${seed})`,
      is_hidden: index >= 3,
      created_at: new Date().toISOString()
    }
  }
  private generateRandomArray(random: SeededRandom, size: number): number[] {
    const nums: number[] = []
    for (let i = 0; i < size; i++) {
      nums.push(random.nextInt(-50, 50))
    }
    return nums
  }
  private solveArraySum(nums: number[]): number {
    return nums.reduce((sum, num) => sum + num, 0)
  }
  validateOutput(input: string, output: string): boolean {
    try {
      const nums = JSON.parse(input)
      const expected = this.solveArraySum(nums)
      const result = parseInt(output)
      return result === expected
    } catch {
      return false
    }
  }
}
export const testCaseGenerators = {
  'two-sum': new TwoSumTestCaseGenerator(),
  'fibonacci': new FibonacciTestCaseGenerator(),
  'palindrome': new PalindromeTestCaseGenerator(),
  'array-sum': new ArraySumTestCaseGenerator()
}
export function generateTestCases(challengeId: string, seed: number, count: number): TestCase[] {
  const generator = testCaseGenerators[challengeId as keyof typeof testCaseGenerators]
  if (!generator) {
    throw new Error(`No test case generator found for challenge: ${challengeId}`)
  }
  return generator.generateTestCases(seed, count)
}