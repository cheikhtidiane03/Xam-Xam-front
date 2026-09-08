# Xaam-Xaam+ — Frontend

Frontend React + Vite + TypeScript de la plateforme Xaam-Xaam+, connecté au backend
Spring Boot déjà développé.

## Stack

- **React 18** + **TypeScript** + **Vite 6**
- **Tailwind CSS v4** (via `@tailwindcss/vite`, pas de `tailwind.config.js` nécessaire)
- **React Router v6** (routing + garde d'accès par rôle)
- **Zustand** (état global : session auth, préférence de thème — persistés en `localStorage`)
- **Axios** (client API avec intercepteurs JWT)
- **react-hot-toast** (notifications)
- **lucide-react** (icônes)

## Démarrage

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer l'URL du backend

```bash
cp .env.example .env
```

Par défaut, `VITE_API_URL=http://localhost:8080` — adapte si ton backend tourne ailleurs
(ou pointe directement vers ton instance Render une fois déployée).

### 3. Lancer le serveur de développement

```bash
npm run dev
```

Ouvre **http://localhost:5173**.

### 4. Build de production

```bash
npm run build
npm run preview   # pour tester le build localement
```

Le dossier `dist/` contient les fichiers statiques prêts à déployer (Vercel, Netlify,
Render Static Site, etc.).

## Déploiement (Vercel)

### 1. Pousser le repo sur GitHub

Vercel se connecte à un repo Git (pas à un zip) — pousse `xaamxaam-frontend` sur GitHub
si ce n'est pas déjà fait.

### 2. Importer le projet sur Vercel

1. [vercel.com](https://vercel.com) → **Add New... → Project** → sélectionne le repo
2. Vercel détecte automatiquement le framework **Vite** — build command
   (`npm run build`) et dossier de sortie (`dist`) sont préremplis, rien à changer
3. Avant de cliquer sur **Deploy**, ajoute la variable d'environnement :
   - **Name** : `VITE_API_URL`
   - **Value** : l'URL de ton backend Render (ex : `https://xaamxaam-backend.onrender.com`)
4. **Deploy**

Le fichier `vercel.json` (déjà dans le repo) configure la réécriture nécessaire pour que
le routing côté client (React Router) fonctionne correctement au rafraîchissement d'une
page — sans lui, rafraîchir `/eleve/exercices` renverrait un 404.

### 3. Connecter le backend à cette URL Vercel

Une fois déployé, Vercel affiche l'URL de production (ex :
`https://xaamxaam-frontend.vercel.app`). **Copie-la** dans le dashboard Render du
backend, variables d'environnement :
- `CORS_ALLOWED_ORIGINS` = cette URL Vercel
- `FRONTEND_URL` = la même URL (utilisée dans les liens des emails)

Puis redéploie/redémarre le service backend pour que le changement soit pris en compte.

### Redéploiements automatiques

Vercel redéploie automatiquement à chaque push sur la branche connectée (comme Render
pour le backend) — aucune action manuelle nécessaire ensuite.

### Variables d'environnement par environnement

Vercel permet de définir des valeurs différentes pour **Production**, **Preview** et
**Development**. Si tu veux que les previews de pull request pointent vers un backend
de test séparé plutôt que la prod, configure `VITE_API_URL` différemment par
environnement dans les paramètres du projet Vercel.

## Prérequis côté backend

Le backend Spring Boot doit tourner (voir son propre README) :

```bash
docker compose up -d   # PostgreSQL, dans le dossier backend
```

Et avoir `CORS_ALLOWED_ORIGINS` configuré pour accepter `http://localhost:5173` en dev
(déjà la valeur par défaut dans `application.yml` du backend).

## Architecture

```
src/
├── api/                  Client Axios + un module par domaine (auth, eleve, parent...)
│   ├── client.ts         Intercepteurs : injection JWT, normalisation des erreurs
│   ├── auth.ts
│   ├── eleve.ts
│   ├── parent.ts
│   ├── enseignant.ts
│   ├── adminEtablissement.ts
│   └── superadmin.ts
│
├── components/
│   ├── ui/                Design system minimal (Button, Input, Card, Modal, Badge...)
│   ├── layout/             AppShell, Sidebar, Topbar, ThemeToggle, navConfig
│   ├── shared/             NotificationProvider (toasts)
│   ├── eleve/              Composants spécifiques au rôle Élève
│   └── parent/             Composants spécifiques au rôle Parent
│
├── hooks/
│   ├── useAuth.ts          Raccourci vers le store d'auth
│   ├── useTheme.ts         Gestion du thème clair/sombre/système
│   ├── useFetch.ts         Hook de fetch générique (loading/erreur/refetch)
│   └── useApiError.ts      Extraction de message d'erreur lisible
│
├── stores/                 Zustand : authStore, themeStore (persistés en localStorage)
│
├── routes/
│   ├── router.tsx          Toutes les routes, organisées par rôle
│   └── ProtectedRoute.tsx  Garde d'accès (authentification + rôle autorisé)
│
├── pages/
│   ├── public/              Accueil, Connexion, Inscription, Mot de passe oublié...
│   ├── eleve/                Tableau de bord, Exercices, Détail exercice, Bibliothèque, Badges
│   ├── parent/                Liste enfants, Détail enfant (suivi/consentement/export)
│   ├── enseignant/            Statistiques, Bibliothèque
│   ├── admin-etablissement/   Vue d'ensemble, Élèves, Enseignants
│   └── superadmin/            Vue globale, Établissements, Comptes, Signalements
│
├── types/                  Types TypeScript miroirs des DTOs backend
├── lib/notify.ts           Helpers de notification uniformes
├── index.css                Tailwind v4 + tokens de design + dark mode
├── App.tsx
└── main.tsx
```

## Fonctionnalités transverses

### Thème clair/sombre

- Piloté par une classe `.dark` sur `<html>` (voir `@custom-variant dark` dans `index.css`).
- Préférence persistée en `localStorage` (3 valeurs : `light`, `dark`, `system`).
- Un script inline dans `index.html` applique le thème **avant** le premier rendu React,
  pour éviter tout flash visuel au chargement.
- Bouton de bascule dans la Topbar (icône lune/soleil) et sur les pages publiques.

### Notifications

Le backend n'expose pas de flux de notifications temps réel (websocket/SSE) — c'est donc
un système **purement client**, déclenché après chaque action (succès/échec d'appel API)
via les helpers de `lib/notify.ts` (`notify.succes()`, `notify.erreur()`, `notify.info()`).

### Authentification & rôles

- Le token JWT est stocké dans le store Zustand `authStore`, persisté en `localStorage`
  sous la clé `xaamxaam-auth`.
- `api/client.ts` lit directement cette clé pour injecter le header `Authorization` sur
  chaque requête (évite une dépendance circulaire entre le client API et le store).
- `ProtectedRoute` redirige vers `/connexion` si non authentifié, ou vers l'espace du
  rôle courant si l'utilisateur tente d'accéder à un espace qui n'est pas le sien.
- Sur 401 (token expiré/révoqué), la session locale est nettoyée automatiquement.

## Ce qui est câblé, endpoint par endpoint

Tous les endpoints backend développés sont consommés par ce frontend, à l'exception de :
- Aucun — chaque module `api/*.ts` correspond exactement à un contrôleur backend, et
  chaque page utilise les endpoints pertinents pour son rôle.

## Actions destructives — confirmations implémentées

Toutes les actions destructives sont désormais exposées dans l'UI avec une confirmation
explicite via le composant réutilisable `ConfirmDialog` :

- **Suppression de compte élève** (droit à l'oubli) : page `/eleve/profil` (accessible
  depuis le menu utilisateur), zone de danger avec saisie du mot `SUPPRIMER` obligatoire.
- **Détachement d'un enfant** (Parent) : bouton discret (icône) sur chaque carte enfant
  dans `/parent`, confirmation simple avant action.
- **Suspension de compte** (Superadmin) : bouton sur `/superadmin/comptes`, confirmation
  avant suspension.
- **Retrait d'établissement** (Superadmin) : bouton sur `/superadmin/etablissements`,
  confirmation avec saisie du nom de l'établissement pour les cas les plus sensibles.

## Points à compléter avant la mise en production

- **Édition du profil** (changer nom/email/mot de passe) : la page `/eleve/profil`
  affiche les informations et propose l'export/suppression, mais pas encore la
  modification des informations elles-mêmes.
- **Pagination** : toutes les listes (élèves, enseignants, établissements...) chargent
  tout en une fois. À revoir si le volume grossit (le backend ne pagine pas non plus
  actuellement, voir son README).
- **Tests** : aucun test frontend pour l'instant (le backend en a, voir son propre repo).
