import { Link } from 'react-router-dom'
import {
  MessageCircleQuestion, Lightbulb, PenLine, LineChart,
  GraduationCap, Users, School, ShieldCheck, ArrowRight,
} from 'lucide-react'
import { PublicHeader, PublicFooter } from './PublicChrome'
import { Button } from '@/components/ui/Button'
import { Card, CardBody } from '@/components/ui/Card'

const ETAPES = [
  {
    icon: PenLine,
    titre: 'Tu poses ton exercice',
    description: 'Texte libre ou photo — Xaam-Xaam+ lit ton énoncé, jamais besoin de le retaper.',
  },
  {
    icon: MessageCircleQuestion,
    titre: "L'IA te questionne",
    description: "Jamais de réponse toute faite : une question qui t'aide à avancer par toi-même.",
  },
  {
    icon: Lightbulb,
    titre: 'Des indices si besoin',
    description: '3 niveaux d\'indices progressifs, débloqués un par un, seulement si tu bloques vraiment.',
  },
  {
    icon: LineChart,
    titre: 'Tu expliques ta démarche',
    description: 'La dernière étape : reformule avec tes mots. C\'est là que la compréhension se vérifie.',
  },
]

const PUBLICS = [
  {
    icon: GraduationCap,
    titre: 'Élèves & étudiants',
    description: 'Du collège au supérieur — un parcours guidé adapté à ton niveau, jamais une réponse copiée-collée.',
  },
  {
    icon: Users,
    titre: 'Parents',
    description: 'Suis l\'effort réel de réflexion de ton enfant, pas juste ses notes.',
  },
  {
    icon: School,
    titre: 'Établissements',
    description: 'Des statistiques de classe pour piloter et sensibiliser à un usage réfléchi de l\'IA.',
  },
]

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 to-transparent dark:from-brand-500/5" />
        <div className="mx-auto max-w-6xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
              Méthode socratique · IA guidée
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              Apprends à réfléchir,
              <br />
              pas à copier.
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
              Xaam-Xaam+ transforme l'IA en outil pédagogique : elle pose des questions qui te font
              avancer, jamais des réponses toutes faites à recopier.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/inscription">
                <Button size="lg" className="gap-2">
                  Commencer gratuitement <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/connexion">
                <Button size="lg" variant="outline">J'ai déjà un compte</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
          Comment ça marche
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-500 dark:text-slate-400">
          Un parcours en 4 étapes pensé pour renforcer ta réflexion, pas la remplacer.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ETAPES.map((etape, i) => (
            <Card key={etape.titre} className="relative">
              <CardBody>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  <etape.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs font-medium text-brand-500">Étape {i + 1}</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{etape.titre}</p>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{etape.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      {/* Publics */}
      <section className="bg-slate-50 py-16 dark:bg-white/[0.02]">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
            Pensé pour toute la famille éducative
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PUBLICS.map((p) => (
              <div key={p.titre} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-ink-900 shadow-sm dark:bg-ink-900 dark:text-brand-400">
                  <p.icon className="h-6 w-6" />
                </div>
                <p className="mt-3 font-semibold text-slate-900 dark:text-slate-100">{p.titre}</p>
                <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Confiance / protection des donnees */}
      <section className="mx-auto max-w-4xl px-4 py-16 lg:px-8">
        <Card>
          <CardBody className="flex flex-col items-center gap-4 py-10 text-center sm:flex-row sm:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                Conçu en priorité pour la sécurité des mineurs
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Consentement parental, contrôle par le compte élève de qui accède à ses données,
                export et suppression sur demande.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-3xl px-4 pb-20 text-center lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Prêt à changer ta façon d'apprendre ?
        </h2>
        <div className="mt-6">
          <Link to="/inscription">
            <Button size="lg" className="gap-2">
              Créer mon compte gratuitement <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
