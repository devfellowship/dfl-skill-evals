import ChallengePageRoute from "./challenge-client"

export function generateStaticParams() {
  return [{ id: "_" }]
}

export default function ChallengePage() {
  return <ChallengePageRoute />
}
