import type { ExecutionRequest, ExecutionResponse } from "@/types/execution"

export class LogService {
  private static formatEmoji(type: 'info' | 'success' | 'error' | 'warning' | 'debug') {
    const emojiMap = {
      info: '🔍',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      debug: '🐛'
    }
    return emojiMap[type]
  }

  private static formatPrefix(context: string, type: 'info' | 'success' | 'error' | 'warning' | 'debug') {
    const emoji = this.formatEmoji(type)
    return `${emoji} ${context.toUpperCase()}`
  }

  // Judge0 Connection Logs
  static logJudge0ConnectionTest() {
    console.log(`${this.formatPrefix('debug frontend', 'info')} - Testando conectividade com Judge0...`)
  }

  static logJudge0ConnectionSuccess() {
    console.log(`${this.formatPrefix('debug frontend', 'success')} - Judge0 está conectado, executando código...`)
  }

  static logJudge0ConnectionError() {
    console.error(`${this.formatPrefix('debug frontend', 'error')} - Judge0 não está disponível`)
  }

  // Problem Debug Logs
  static logProblemDebug(data: {
    currentProblem: number
    problemTitle?: string
    functionName?: string
    testCasesCount?: number
  }) {
    console.log(`${this.formatPrefix('debug frontend', 'debug')} - Problem:`, {
      currentProblem: data.currentProblem,
      problemTitle: data.problemTitle,
      functionName: data.functionName,
      testCasesCount: data.testCasesCount
    })
  }

  // Request Debug Logs
  static logExecutionRequest(request: ExecutionRequest, codeLength: number) {
    console.log(`${this.formatPrefix('debug frontend', 'info')} - Request sendo enviado:`, {
      codeLength,
      testCasesCount: request.testCases.length,
      languageId: request.languageId,
      timeoutMs: request.timeoutMs,
      functionName: request.functionName,
      fullRequest: request
    })
  }

  // Response Debug Logs
  static logExecutionResponse(result: ExecutionResponse) {
    console.log(`${this.formatPrefix('debug frontend', 'info')} - Response recebida:`, {
      success: result.success,
      testResultsCount: result.testResults?.length,
      totalExecutionTime: result.totalExecutionTime,
      fullResponse: result
    })
  }

  // Error Logs
  static logExecutionError(error: unknown) {
    console.error(`${this.formatPrefix('debug frontend', 'error')} - Error executing code:`, error)
  }

  // Generic Debug Log
  static logDebug(context: string, message: string, data?: any) {
    const prefix = `${this.formatPrefix(`debug frontend - ${context}`, 'debug')}`
    if (data) {
      console.log(`${prefix} - ${message}:`, data)
    } else {
      console.log(`${prefix} - ${message}`)
    }
  }

  // Generic Info Log
  static logInfo(context: string, message: string, data?: any) {
    const prefix = `${this.formatPrefix(`debug frontend - ${context}`, 'info')}`
    if (data) {
      console.log(`${prefix} - ${message}:`, data)
    } else {
      console.log(`${prefix} - ${message}`)
    }
  }

  // Generic Success Log
  static logSuccess(context: string, message: string, data?: any) {
    const prefix = `${this.formatPrefix(`debug frontend - ${context}`, 'success')}`
    if (data) {
      console.log(`${prefix} - ${message}:`, data)
    } else {
      console.log(`${prefix} - ${message}`)
    }
  }

  // Generic Warning Log
  static logWarning(context: string, message: string, data?: any) {
    const prefix = `${this.formatPrefix(`debug frontend - ${context}`, 'warning')}`
    if (data) {
      console.warn(`${prefix} - ${message}:`, data)
    } else {
      console.warn(`${prefix} - ${message}`)
    }
  }

  // Generic Error Log
  static logError(context: string, message: string, error?: any) {
    const prefix = `${this.formatPrefix(`debug frontend - ${context}`, 'error')}`
    if (error) {
      console.error(`${prefix} - ${message}:`, error)
    } else {
      console.error(`${prefix} - ${message}`)
    }
  }
}
