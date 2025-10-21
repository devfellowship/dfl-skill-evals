import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { ChallengeOperationData } from '@/hooks/useChallengeOperations'

export interface TestCase {
  input: string
  expectedOutput: string
  description?: string
  hidden?: boolean
}

export interface Example {
  input: string
  output: string
  explanation?: string
}

interface UseChallengeFormOptions {
  initialData?: Partial<ChallengeOperationData>
  mode?: 'create' | 'edit'
}

export function useChallengeForm(options: UseChallengeFormOptions = {}) {
  const { initialData, mode = 'create' } = options

  const [formData, setFormData] = useState<ChallengeOperationData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    difficulty: initialData?.difficulty || 'easy',
    category: initialData?.category || [],
    function_name: initialData?.function_name || '',
    initial_code: initialData?.initial_code || `function solution() {\n    return null;\n}`,
    skills: initialData?.skills || [],
    test_cases: initialData?.test_cases || [],
    examples: initialData?.examples || [],
    constraints: initialData?.constraints || [],
    hints: initialData?.hints || [],
    status: initialData?.status || 'draft',
    mentor: initialData?.mentor || '',
    trending: initialData?.trending || false,
    trending_priority: initialData?.trending_priority || null,
  })

  const [testCases, setTestCases] = useState<TestCase[]>(
    initialData?.test_cases?.map(tc => ({
      input: tc.input || '',
      expectedOutput: tc.expectedOutput || tc.expected_output || '',
      description: tc.description || '',
      hidden: tc.hidden || tc.is_hidden || false
    })) || []
  )

  const [examples, setExamples] = useState<Example[]>(
    initialData?.examples?.map(ex => ({
      input: ex.input || '',
      output: ex.output || '',
      explanation: ex.explanation || ''
    })) || []
  )

  const [skills, setSkills] = useState<string[]>(initialData?.skills || [])
  const [constraints, setConstraints] = useState<string[]>(initialData?.constraints || [])
  const [hints, setHints] = useState<string[]>(initialData?.hints || [])

  const handleInputChange = useCallback((field: keyof ChallengeOperationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    setFormData(prev => {
      const currentCategories = Array.isArray(prev.category) ? prev.category : []
      return {
        ...prev,
        category: checked 
          ? [...currentCategories, category]
          : currentCategories.filter((c: string) => c !== category)
      }
    })
  }, [])

  const addTestCase = useCallback((testCase: TestCase) => {
    if (!testCase.input.trim() || !testCase.expectedOutput.trim()) {
      toast.error('Input e Output são obrigatórios')
      return false
    }
    setTestCases(prev => [...prev, testCase])
    setFormData(prev => ({ ...prev, test_cases: [...prev.test_cases || [], testCase] }))
    return true
  }, [])

  const removeTestCase = useCallback((index: number) => {
    setTestCases(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({ 
      ...prev, 
      test_cases: (prev.test_cases || []).filter((_, i) => i !== index) 
    }))
  }, [])

  const updateTestCase = useCallback((index: number, field: keyof TestCase, value: string | boolean) => {
    setTestCases(prev => prev.map((tc, i) => 
      i === index ? { ...tc, [field]: value } : tc
    ))
    setFormData(prev => ({
      ...prev,
      test_cases: (prev.test_cases || []).map((tc, i) => 
        i === index ? { ...tc, [field]: value } : tc
      )
    }))
  }, [])

  const addExample = useCallback((example: Example) => {
    if (!example.input.trim() || !example.output.trim()) {
      toast.error('Input e Output do exemplo são obrigatórios')
      return false
    }
    setExamples(prev => [...prev, example])
    setFormData(prev => ({ ...prev, examples: [...prev.examples || [], example] }))
    return true
  }, [])

  const removeExample = useCallback((index: number) => {
    setExamples(prev => prev.filter((_, i) => i !== index))
    setFormData(prev => ({ 
      ...prev, 
      examples: (prev.examples || []).filter((_, i) => i !== index) 
    }))
  }, [])

  const addSkill = useCallback((skill: string) => {
    if (!skill.trim()) {
      toast.error('Skill não pode estar vazia')
      return false
    }
    if (skills.includes(skill)) {
      toast.error('Skill já adicionada')
      return false
    }
    const newSkills = [...skills, skill]
    setSkills(newSkills)
    setFormData(prev => ({ ...prev, skills: newSkills }))
    return true
  }, [skills])

  const removeSkill = useCallback((index: number) => {
    const newSkills = skills.filter((_, i) => i !== index)
    setSkills(newSkills)
    setFormData(prev => ({ ...prev, skills: newSkills }))
  }, [skills])

  const addConstraint = useCallback((constraint: string) => {
    if (!constraint.trim()) {
      toast.error('Constraint não pode estar vazia')
      return false
    }
    const newConstraints = [...constraints, constraint]
    setConstraints(newConstraints)
    setFormData(prev => ({ ...prev, constraints: newConstraints }))
    return true
  }, [constraints])

  const removeConstraint = useCallback((index: number) => {
    const newConstraints = constraints.filter((_, i) => i !== index)
    setConstraints(newConstraints)
    setFormData(prev => ({ ...prev, constraints: newConstraints }))
  }, [constraints])

  const addHint = useCallback((hint: string) => {
    if (!hint.trim()) {
      toast.error('Hint não pode estar vazia')
      return false
    }
    const newHints = [...hints, hint]
    setHints(newHints)
    setFormData(prev => ({ ...prev, hints: newHints }))
    return true
  }, [hints])

  const removeHint = useCallback((index: number) => {
    const newHints = hints.filter((_, i) => i !== index)
    setHints(newHints)
    setFormData(prev => ({ ...prev, hints: newHints }))
  }, [hints])

  const validateForm = useCallback((): boolean => {
    if (!formData.title?.trim()) {
      toast.error('Título é obrigatório')
      return false
    }

    if (formData.title.trim().length < 5) {
      toast.error('Título deve ter pelo menos 5 caracteres')
      return false
    }

    if (!formData.description?.trim()) {
      toast.error('Descrição é obrigatória')
      return false
    }

    if (formData.description.trim().length < 20) {
      toast.error('Descrição deve ter pelo menos 20 caracteres')
      return false
    }

    if (!formData.function_name?.trim()) {
      toast.error('Nome da função é obrigatório')
      return false
    }

    const functionNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/
    if (!functionNameRegex.test(formData.function_name.trim())) {
      toast.error('Nome da função inválido. Use apenas letras, números e underscore')
      return false
    }

    if (!formData.initial_code?.trim()) {
      toast.error('Código inicial é obrigatório')
      return false
    }

    const categories = Array.isArray(formData.category) ? formData.category : []
    if (categories.length === 0) {
      toast.error('Selecione pelo menos uma categoria')
      return false
    }

    return true
  }, [formData])

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'easy',
      category: [],
      function_name: '',
      initial_code: `function solution() {\n    return null;\n}`,
      skills: [],
      test_cases: [],
      examples: [],
      constraints: [],
      hints: [],
      status: 'draft',
      mentor: '',
      trending: false,
      trending_priority: null,
    })
    setTestCases([])
    setExamples([])
    setSkills([])
    setConstraints([])
    setHints([])
  }, [])

  const loadFormData = useCallback((data: Partial<ChallengeOperationData>) => {
    setFormData(prev => ({ ...prev, ...data }))
    
    if (data.test_cases) {
      setTestCases(data.test_cases.map(tc => ({
        input: tc.input || '',
        expectedOutput: tc.expectedOutput || tc.expected_output || '',
        description: tc.description || '',
        hidden: tc.hidden || tc.is_hidden || false
      })))
    }
    
    if (data.examples) {
      setExamples(data.examples.map(ex => ({
        input: ex.input || '',
        output: ex.output || '',
        explanation: ex.explanation || ''
      })))
    }
    
    if (data.skills) setSkills(data.skills)
    if (data.constraints) setConstraints(data.constraints)
    if (data.hints) setHints(data.hints)
  }, [])

  return {
    formData,
    testCases,
    examples,
    skills,
    constraints,
    hints,
    setFormData,
    setTestCases,
    setExamples,
    handleInputChange,
    handleCategoryChange,
    addTestCase,
    removeTestCase,
    updateTestCase,
    addExample,
    removeExample,
    addSkill,
    removeSkill,
    addConstraint,
    removeConstraint,
    addHint,
    removeHint,
    validateForm,
    resetForm,
    loadFormData,
    mode
  }
}

