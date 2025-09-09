export interface MentorStats {
  totalChallenges: number
  approvedChallenges: number
  pendingChallenges: number
  rejectedChallenges: number
}

export interface MentorStatsCardsProps {
  stats: MentorStats
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
