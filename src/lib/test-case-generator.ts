import type { TestCase, TestCaseGenerator } from '@/types/test-cases'

// Gerador de números pseudo-aleatórios baseado em seed
class SeededRandom {
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

// Gerador específico para o problema Two Sum
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
      challenge_id: 'two-sum', // ID do desafio
      seed: seed,
      input,
      expected_output: JSON.stringify(expectedOutput),
      description: `Test case ${index + 1} (seed: ${seed})`,
      is_hidden: index >= 3, // Primeiros 3 casos são visíveis
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
    // Garantir que sempre existe uma solução
    const i = random.nextInt(0, nums.length - 1)
    const j = random.nextInt(0, nums.length - 1)
    if (i === j) return this.generateTarget(random, nums)
    return nums[i] + nums[j]
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
      // Parse input: "[1,2,3], 5"
      const [numsStr, targetStr] = input.split(', ')
      const nums = JSON.parse(numsStr)
      const target = parseInt(targetStr)
      
      // Parse output: "[0,1]"
      const result = JSON.parse(output)
      
      if (!Array.isArray(result) || result.length !== 2) {
        return false
      }
      
      const [i, j] = result
      if (i < 0 || j < 0 || i >= nums.length || j >= nums.length || i === j) {
        return false
      }
      
      return nums[i] + nums[j] === target
    } catch {
      return false
    }
  }
}

// Gerador genérico para outros tipos de problemas
export class GenericTestCaseGenerator implements TestCaseGenerator {
  constructor(
    private challengeId: string,
    private inputGenerator: (random: SeededRandom) => string,
    private outputValidator: (input: string, output: string) => boolean,
    private solutionGenerator: (input: string) => string
  ) {}

  generateTestCases(seed: number, count: number): TestCase[] {
    const random = new SeededRandom(seed)
    const testCases: TestCase[] = []

    for (let i = 0; i < count; i++) {
      const input = this.inputGenerator(random)
      const expectedOutput = this.solutionGenerator(input)
      
      const testCase: TestCase = {
        id: `test_${this.challengeId}_${seed}_${i}`,
        challenge_id: this.challengeId,
        seed,
        input,
        expected_output: expectedOutput,
        description: `Test case ${i + 1} (seed: ${seed})`,
        is_hidden: i >= 3,
        created_at: new Date().toISOString()
      }
      
      testCases.push(testCase)
    }

    return testCases
  }

  validateOutput(input: string, output: string): boolean {
    return this.outputValidator(input, output)
  }
}

// Factory para criar geradores específicos
export class TestCaseGeneratorFactory {
  static createGenerator(challengeId: string): TestCaseGenerator {
    switch (challengeId) {
      case 'two-sum':
        return new TwoSumTestCaseGenerator()
      
      // Adicionar outros desafios aqui
      default:
        throw new Error(`No generator found for challenge: ${challengeId}`)
    }
  }
}
