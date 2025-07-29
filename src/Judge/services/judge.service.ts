import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'http://localhost:2358'
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY

export interface Judge0Submission {
  source_code: string
  language_id: number
  stdin?: string
  expected_output?: string
  cpu_time_limit?: number
  memory_limit?: number
}

export interface Judge0Response {
  token: string
  status: {
    id: number
    description: string
  }
  stdout?: string
  stderr?: string
  compile_output?: string
  time?: string
  memory?: number
}

export async function submitToJudge0(payload: Judge0Submission): Promise<Judge0Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = JUDGE0_API_KEY
  }

  const response = await axios.post(
    `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`,
    payload,
    { headers }
  )
  return response.data as Judge0Response
}

export async function getLanguages(): Promise<any> {
  const headers: Record<string, string> = {}
  if (JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = JUDGE0_API_KEY
  }
  const response = await axios.get(`${JUDGE0_API_URL}/languages`, { headers })
  return response.data
}

export async function getSubmission(token: string): Promise<any> {
  const headers: Record<string, string> = {}
  if (JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = JUDGE0_API_KEY
  }
  const response = await axios.get(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`, { headers })
  return response.data
}

export async function getStatuses(): Promise<any> {
  const headers: Record<string, string> = {}
  if (JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = JUDGE0_API_KEY
  }
  const response = await axios.get(`${JUDGE0_API_URL}/statuses`, { headers })
  return response.data
}

export async function getAbout(): Promise<any> {
  const headers: Record<string, string> = {}
  if (JUDGE0_API_KEY) {
    headers['X-RapidAPI-Key'] = JUDGE0_API_KEY
  }
  const response = await axios.get(`${JUDGE0_API_URL}/about`, { headers })
  return response.data
}
