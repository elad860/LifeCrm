import {
  Briefcase,
  Shield,
  Heart,
  Users,
  Code,
  Activity,
  Building2,
  GraduationCap,
  HeartHandshake,
  Network,
  type LucideIcon,
} from 'lucide-react'

export const categoryIconMap: Record<string, LucideIcon> = {
  Briefcase,
  Shield,
  Heart,
  Users,
  Code,
  Activity,
  Building2,
  GraduationCap,
  HeartHandshake,
  Network,
}

export function getCategoryIcon(name: string): LucideIcon {
  return categoryIconMap[name] ?? Briefcase
}
