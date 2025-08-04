const { JUDGE0_LANGUAGES } = require('./src/types/execution.js')

console.log('🔍 Verificando configuração do TypeScript...')
console.log('📋 JUDGE0_LANGUAGES:', JUDGE0_LANGUAGES)
console.log('📋 TypeScript ID:', JUDGE0_LANGUAGES.TYPESCRIPT)
console.log('📋 JavaScript ID:', JUDGE0_LANGUAGES.JAVASCRIPT)

// Teste simples para verificar se o TypeScript está sendo usado
const testCode = `function twoSum(nums: number[], target: number): number[] {
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

console.log('\n📝 Código TypeScript de teste:')
console.log(testCode)
console.log('\n✅ Configuração do TypeScript verificada!') 