import PreChallengePageRoute from "./pre-challenge-client"

export function generateStaticParams() {
  return [{ id: "_" }]
}

export default function PreChallengePage() {
  return <PreChallengePageRoute />
}
