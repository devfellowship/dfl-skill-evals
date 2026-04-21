import AdminChallengeClient from "./admin-challenge-client"

// Static export requires generateStaticParams. A single placeholder param
// is emitted; actual ids are resolved client-side via useParams() and
// Nginx is expected to fall back to /admin/challenge/_.html for unknown ids.
export function generateStaticParams() {
  return [{ id: "_" }]
}

export default function AdminChallengePage() {
  return <AdminChallengeClient />
}
