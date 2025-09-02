import { 
  Calendar,
  Home,
  Settings,
  Trophy,
  Target,
  BookOpen,
  BarChart3,
  Users,
  PlusCircle,
  Crown,
  Activity
} from "lucide-react"
import type { MenuItem, User } from "@/types"


export const mainMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Meus Challenges",
    url: "/my-challenges",
    icon: BookOpen,
  },

]


export const progressMenuItems: MenuItem[] = [
  {
    title: "Achievements",
    url: "/achievements", 
    icon: Trophy,
    badge: "3",
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Crown,
  },
  {
    title: "Meu Progresso",
    url: "/progress",
    icon: Activity,
  },
  {
    title: "Tarefas Diárias",
    url: "/daily-tasks",
    icon: Target,
    badge: "2",
  },
]


export const settingsMenuItems: MenuItem[] = [
  {
    title: "Criar Challenge",
    url: "/create-challenge",
    icon: PlusCircle,
  },
  {
    title: "Comunidade",
    url: "/community",
    icon: Users,
  },
  {
    title: "Calendário",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
]


export const currentUser: User = {
  name: "Alex Costa",
  email: "alex@devshaper.com",
  avatar: "/placeholder-user.jpg",
  initials: "AC",
} 