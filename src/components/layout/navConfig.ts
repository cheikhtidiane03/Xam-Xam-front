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
    { label: 'Tableau de bord', to: '/eleve', icon: LayoutDashboard },
    { label: 'Mes exercices', to: '/eleve/exercices', icon: BookOpen },
    { label: 'Bibliothèque', to: '/eleve/bibliotheque', icon: Library },
    { label: 'Mes badges', to: '/eleve/badges', icon: Award },
  ],
  PARENT: [
    { label: 'Mes enfants', to: '/parent', icon: Baby },
  ],
  ENSEIGNANT: [
    { label: 'Statistiques', to: '/enseignant', icon: BarChart3 },
    { label: 'Bibliothèque', to: '/enseignant/bibliotheque', icon: Library },
  ],
  ADMIN_ETABLISSEMENT: [
    { label: "Vue d'ensemble", to: '/admin-etablissement', icon: LayoutDashboard },
    { label: 'Élèves', to: '/admin-etablissement/eleves', icon: GraduationCap },
    { label: 'Enseignants', to: '/admin-etablissement/enseignants', icon: Users },
  ],
  SUPERADMIN: [
    { label: 'Vue globale', to: '/superadmin', icon: LayoutDashboard },
    { label: 'Établissements', to: '/superadmin/etablissements', icon: Building2 },
    { label: 'Utilisateurs', to: '/superadmin/utilisateurs', icon: Users },
    { label: 'Comptes en attente', to: '/superadmin/comptes', icon: UserCog },
    { label: 'Signalements', to: '/superadmin/signalements', icon: ShieldAlert },
  ],
}

export const LABEL_ROLE: Record<Role, string> = {
  ELEVE: 'Élève',
  PARENT: 'Parent',
  ENSEIGNANT: 'Enseignant',
  ADMIN_ETABLISSEMENT: "Administrateur d'établissement",
  SUPERADMIN: 'Superadmin',
}