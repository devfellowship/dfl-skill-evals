import { describe, it, expect } from 'vitest'
import {
  getRoleInfo,
  getDefaultRoleInfo,
  getLoadingRoleInfo,
  getUnauthenticatedRoleInfo,
} from '../user-role-utils'

describe('getRoleInfo', () => {
  it('returns correct info for admin role', () => {
    const info = getRoleInfo('admin')
    expect(info.role).toBe('admin')
    expect(info.isAdmin).toBe(true)
    expect(info.isMentor).toBe(true)
    expect(info.canCreateChallenges).toBe(true)
    expect(info.isLoading).toBe(false)
  })

  it('returns correct info for mentor role', () => {
    const info = getRoleInfo('mentor')
    expect(info.role).toBe('mentor')
    expect(info.isAdmin).toBe(false)
    expect(info.isMentor).toBe(true)
    expect(info.canCreateChallenges).toBe(true)
    expect(info.isLoading).toBe(false)
  })

  it('returns correct info for community_member role', () => {
    const info = getRoleInfo('community_member')
    expect(info.role).toBe('community_member')
    expect(info.isAdmin).toBe(false)
    expect(info.isMentor).toBe(false)
    expect(info.canCreateChallenges).toBe(false)
    expect(info.isLoading).toBe(false)
  })

  it('includes a label and color for each role', () => {
    expect(getRoleInfo('admin').label).toBeTruthy()
    expect(getRoleInfo('mentor').label).toBeTruthy()
    expect(getRoleInfo('community_member').label).toBeTruthy()

    expect(getRoleInfo('admin').color).toMatch(/^bg-/)
    expect(getRoleInfo('mentor').color).toMatch(/^bg-/)
    expect(getRoleInfo('community_member').color).toMatch(/^bg-/)
  })
})

describe('getDefaultRoleInfo', () => {
  it('returns a loading state for community_member', () => {
    const info = getDefaultRoleInfo()
    expect(info.role).toBe('community_member')
    expect(info.isLoading).toBe(true)
    expect(info.isAdmin).toBe(false)
    expect(info.canCreateChallenges).toBe(false)
  })
})

describe('getLoadingRoleInfo', () => {
  it('returns isLoading true', () => {
    expect(getLoadingRoleInfo().isLoading).toBe(true)
  })
})

describe('getUnauthenticatedRoleInfo', () => {
  it('returns isLoading false for unauthenticated state', () => {
    const info = getUnauthenticatedRoleInfo()
    expect(info.isLoading).toBe(false)
    expect(info.isAdmin).toBe(false)
    expect(info.canCreateChallenges).toBe(false)
  })
})
