export interface TeacherStats {
  totalChallenges: number
  approvedChallenges: number
  pendingChallenges: number
  rejectedChallenges: number
}

export interface TeacherStatsCardsProps {
  stats: TeacherStats
}

export interface AdminStats {
  totalChallenges: number
  publishedChallenges: number
  draftChallenges: number
  archivedChallenges: number
}

export interface AdminStatsCardsProps {
  stats: AdminStats
}
