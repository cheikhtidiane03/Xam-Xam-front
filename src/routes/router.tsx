import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { AppShell } from '@/components/layout/AppShell'

import { LandingPage } from '@/pages/public/LandingPage'
import { LoginPage } from '@/pages/public/LoginPage'
import { RegisterPage } from '@/pages/public/RegisterPage'
import { ForgotPasswordPage } from '@/pages/public/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/public/ResetPasswordPage'
import { VerifyEmailPage } from '@/pages/public/VerifyEmailPage'

import { EleveDashboardPage } from '@/pages/eleve/EleveDashboardPage'
import { EleveExercicesPage } from '@/pages/eleve/EleveExercicesPage'
import { EleveExerciceDetailPage } from '@/pages/eleve/EleveExerciceDetailPage'
import { EleveBibliothequePage } from '@/pages/eleve/EleveBibliothequePage'
import { EleveBadgesPage } from '@/pages/eleve/EleveBadgesPage'
import { EleveProfilPage } from '@/pages/eleve/EleveProfilPage'

import { ParentDashboardPage } from '@/pages/parent/ParentDashboardPage'
import { ParentEnfantDetailPage } from '@/pages/parent/ParentEnfantDetailPage'

import { EnseignantDashboardPage } from '@/pages/enseignant/EnseignantDashboardPage'
import { EnseignantBibliothequePage } from '@/pages/enseignant/EnseignantBibliothequePage'

import { AdminEtablissementDashboardPage } from '@/pages/admin-etablissement/AdminEtablissementDashboardPage'
import { AdminEtablissementElevesPage } from '@/pages/admin-etablissement/AdminEtablissementElevesPage'
import { AdminEtablissementEnseignantsPage } from '@/pages/admin-etablissement/AdminEtablissementEnseignantsPage'

import { SuperadminDashboardPage } from '@/pages/superadmin/SuperadminDashboardPage'
import { SuperadminEtablissementsPage } from '@/pages/superadmin/SuperadminEtablissementsPage'
import { SuperadminComptesPage } from '@/pages/superadmin/SuperadminComptesPage'
import { SuperadminSignalementsPage } from '@/pages/superadmin/SuperadminSignalementsPage'

export const router = createBrowserRouter([
  // ===== Public =====
  { path: '/', element: <LandingPage /> },
  { path: '/connexion', element: <LoginPage /> },
  { path: '/inscription', element: <RegisterPage /> },
  { path: '/mot-de-passe-oublie', element: <ForgotPasswordPage /> },
  { path: '/reinitialiser-mot-de-passe', element: <ResetPasswordPage /> },
  { path: '/verifier-email', element: <VerifyEmailPage /> },

  // ===== Elève =====
  {
    element: <ProtectedRoute rolesAutorises={['ELEVE']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/eleve', element: <EleveDashboardPage /> },
          { path: '/eleve/exercices', element: <EleveExercicesPage /> },
          { path: '/eleve/exercices/:exerciceId', element: <EleveExerciceDetailPage /> },
          { path: '/eleve/bibliotheque', element: <EleveBibliothequePage /> },
          { path: '/eleve/badges', element: <EleveBadgesPage /> },
          { path: '/eleve/profil', element: <EleveProfilPage /> },
        ],
      },
    ],
  },

  // ===== Parent =====
  {
    element: <ProtectedRoute rolesAutorises={['PARENT']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/parent', element: <ParentDashboardPage /> },
          { path: '/parent/enfants/:eleveId', element: <ParentEnfantDetailPage /> },
        ],
      },
    ],
  },

  // ===== Enseignant =====
  {
    element: <ProtectedRoute rolesAutorises={['ENSEIGNANT']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/enseignant', element: <EnseignantDashboardPage /> },
          { path: '/enseignant/bibliotheque', element: <EnseignantBibliothequePage /> },
        ],
      },
    ],
  },

  // ===== Admin établissement =====
  {
    element: <ProtectedRoute rolesAutorises={['ADMIN_ETABLISSEMENT']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/admin-etablissement', element: <AdminEtablissementDashboardPage /> },
          { path: '/admin-etablissement/eleves', element: <AdminEtablissementElevesPage /> },
          { path: '/admin-etablissement/enseignants', element: <AdminEtablissementEnseignantsPage /> },
        ],
      },
    ],
  },

  // ===== Superadmin =====
  {
    element: <ProtectedRoute rolesAutorises={['SUPERADMIN']} />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/superadmin', element: <SuperadminDashboardPage /> },
          { path: '/superadmin/etablissements', element: <SuperadminEtablissementsPage /> },
          { path: '/superadmin/comptes', element: <SuperadminComptesPage /> },
          { path: '/superadmin/signalements', element: <SuperadminSignalementsPage /> },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
])
