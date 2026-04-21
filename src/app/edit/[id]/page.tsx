import EditChallengeClient from "./edit-challenge-client"

export function generateStaticParams() {
  return [{ id: "_" }]
}

export default function EditChallengePage() {
  return <EditChallengeClient />
}
