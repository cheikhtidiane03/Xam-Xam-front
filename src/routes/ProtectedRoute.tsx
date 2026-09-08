import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import type { Role } from '@/types/auth'

interface ProtectedRouteProps {
  rolesAutorises?: Role[]
}

/**
 * Garde d'acces : redirige vers /connexion si non authentifie, ou vers
 * l'espace du role courant si authentifie mais avec un role non autorise
 * pour cette section (evite qu'un Eleve navigue manuellement vers /superadmin).
 */
export function ProtectedRoute({ rolesAutorises }: ProtectedRouteProps) {
  const { estConnecte, role } = useAuth()
  const location = useLocation()

  if (!estConnecte || !role) {
    return <Navigate to="/connexion" state={{ from: location }} replace />
  }

  if (rolesAutorises && !rolesAutorises.includes(role)) {
    return <Navigate to={cheminEspaceRole(role)} replace />
  }

  return <Outlet />
}

export function cheminEspaceRole(role: Role): string {
  switch (role) {
    case 'ELEVE':
      return '/eleve'
    case 'PARENT':
      return '/parent'
    case 'ENSEIGNANT':
      return '/enseignant'
    case 'ADMIN_ETABLISSEMENT':
      return '/admin-etablissement'
    case 'SUPERADMIN':
      return '/superadmin'
  }
}
