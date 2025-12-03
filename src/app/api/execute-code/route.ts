import { NextRequest, NextResponse } from 'next/server'
import { executeCodeWithJudge0, checkRateLimit, isLanguageSupported, getLanguageName } from '@/lib/execution/judge0-executor'
import { validateCodeBeforeExecution } from '@/lib/validation/malicious-code-detector'
import { getToken, serverClientWithToken } from '@/lib/supabase/server-clients'
import type { ExecutionRequest, ExecutionResponse } from '@/types/editor/execution'
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const token = getToken(request)
    const supabase = serverClientWithToken(token)
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
    }

    const body: ExecutionRequest = await request.json()
    const { code, testCases, languageId, timeoutMs = 5000, functionName } = body
    const clientIp = request.headers.get('x-forwarded-for') || 'unknown'

    if (!code || !testCases || !languageId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: code, testCases, languageId' },
        { status: 400 }
      )
    }

    const validation = validateCodeBeforeExecution(code, functionName || 'solution', languageId)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      )
    }

    if (!checkRateLimit(user.id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
          testResults: [],
          totalExecutionTime: 0,
        },
        { status: 429 }
      )
    }

    if (!isLanguageSupported(languageId)) {
      return NextResponse.json(
        { success: false, error: `Language ID ${languageId} is not supported` },
        { status: 400 }
      )
    }
    if (testCases.length === 0) {
      return NextResponse.json(
        { success: false, error: 'At least one test case is required' },
        { status: 400 }
      )
    }
    const startTime = Date.now()
    try {
      const testResults = await executeCodeWithJudge0(code, testCases, languageId, timeoutMs, functionName)
      const totalExecutionTime = Date.now() - startTime
      const allTestsPassed = testResults.every(r => r.status === 'passed')
      const response: ExecutionResponse = {
        success: allTestsPassed,
        testResults,
        totalExecutionTime,
      }
      return NextResponse.json(response)
    } catch (error) {
      if (error instanceof Error && error.message.includes('Compilation')) {
        return NextResponse.json({
          success: false,
          compilationError: error.message,
          testResults: [],
          totalExecutionTime: Date.now() - startTime,
        })
      }
      throw error
    }
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        testResults: [],
        totalExecutionTime: 0,
      },
      { status: 500 }
    )
  }
}