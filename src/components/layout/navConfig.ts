
import {
  LayoutDashboard, BookOpen, Award, Library, Users, BarChart3,
  Building2, ShieldAlert, UserCog, GraduationCap, Baby,
} from 'lucide-react'
import type { Role } from '@/types/auth'
import type { ComponentType } from 'react'

export interface NavItem {
  label: string
  to: string
  icon: ComponentType<{ className?: string }>
}

export const NAV_PAR_ROLE: Record<Role, NavItem[]> = {
  ELEVE: [
    { label: 'Dashboard', to: '/eleve', icon: LayoutDashboard },
    { label: 'My Exercises', to: '/eleve/exercices', icon: BookOpen },
    { label: 'Library', to: '/eleve/bibliotheque', icon: Library },
    { label: 'My Badges', to: '/eleve/badges', icon: Award },
  ],
  PARENT: [
    { label: 'My Children', to: '/parent', icon: Baby },
  ],
  ENSEIGNANT: [
    { label: 'Statistics', to: '/enseignant', icon: BarChart3 },
    { label: 'Library', to: '/enseignant/bibliotheque', icon: Library },
  ],
  ADMIN_ETABLISSEMENT: [
    { label: 'Overview', to: '/admin-etablissement', icon: LayoutDashboard },
    { label: 'Students', to: '/admin-etablissement/eleves', icon: GraduationCap },
    { label: 'Teachers', to: '/admin-etablissement/enseignants', icon: Users },
  ],
  SUPERADMIN: [
    { label: 'Global Overview', to: '/superadmin', icon: LayoutDashboard },
    { label: 'Institutions', to: '/superadmin/etablissements', icon: Building2 },
    { label: 'Users', to: '/superadmin/utilisateurs', icon: Users },
    { label: 'Pending Accounts', to: '/superadmin/comptes', icon: UserCog },
    { label: 'Reports', to: '/superadmin/signalements', icon: ShieldAlert },
  ],
}

export const LABEL_ROLE: Record<Role, string> = {
  ELEVE: 'Student',
  PARENT: 'Parent',
  ENSEIGNANT: 'Teacher',
  ADMIN_ETABLISSEMENT: 'Institution Administrator',
  SUPERADMIN: 'Superadmin',
}
