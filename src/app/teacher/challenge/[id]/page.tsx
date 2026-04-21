import TeacherChallengeClient from "./teacher-challenge-client"

export function generateStaticParams() {
  return [{ id: "_" }]
}

export default function TeacherChallengePage() {
  return <TeacherChallengeClient />
}
