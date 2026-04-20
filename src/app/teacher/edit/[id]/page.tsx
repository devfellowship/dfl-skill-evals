import TeacherEditClient from "./teacher-edit-client"

export function generateStaticParams() {
  return [{ id: "_" }]
}

export default function TeacherEditPage() {
  return <TeacherEditClient />
}
