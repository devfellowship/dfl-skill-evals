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

// Menu principal
export const mainMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Meus Assessments",
    url: "/my-assessments",
    icon: BookOpen,
  },
  {
    title: "Resultados",
    url: "/results",
    icon: BarChart3,
  },
]

// Menu de progresso e achievements
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

// Menu de configurações
export const settingsMenuItems: MenuItem[] = [
  {
    title: "Criar Assessment",
    url: "/create-assessment",
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

// Dados do usuário mockados
export const currentUser: User = {
  name: "Alex Costa",
  email: "alex@devshaper.com",
  avatar: "/placeholder-user.jpg",
  initials: "AC",
} 