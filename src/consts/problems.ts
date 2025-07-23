import type { Problem } from "@/types/problems"

export const problems: Problem[] = [
  {
    id: 1,
    title: "Two Sum",
    difficulty: "Easy",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists.",
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Again, the best way to approach this problem is to use a HashMap.",
      "For each element, we try to find its complement by looking up the HashMap.",
    ],
    functionName: "twoSum",
    testCases: [
      { 
        input: "[2,7,11,15], 9", 
        expectedOutput: [0,1], 
        description: "Basic case with target found",
        hidden: false 
      },
      { 
        input: "[3,2,4], 6", 
        expectedOutput: [1,2], 
        description: "Another valid case",
        hidden: false 
      },
      { 
        input: "[3,3], 6", 
        expectedOutput: [0,1], 
        description: "Duplicate numbers",
        hidden: false 
      },
      { 
        input: "[1,2,3,4,5], 8", 
        expectedOutput: [2,4], 
        description: "Hidden test case 1",
        hidden: true 
      },
      { 
        input: "[-1,-2,-3,-4,-5], -8", 
        expectedOutput: [2,4], 
        description: "Hidden test case with negatives",
        hidden: true 
      },
    ],
  },
]

export const DEFAULT_CODE_TEMPLATE = `function twoSum(nums: number[], target: number): number[] {
    // Your solution here
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}` 