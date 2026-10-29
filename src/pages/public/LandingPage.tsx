
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
    titre: 'Submit Your Exercise',
    description: 'Type your exercise or upload a photo — Xaam-Xaam+ reads the instructions, so you never need to type them out.',
  },
  {
    icon: MessageCircleQuestion,
    titre: 'The AI Asks You Questions',
    description: 'Never a ready-made answer: just a question to help you move forward on your own.',
  },
  {
    icon: Lightbulb,
    titre: 'Hints When You Need Them',
    description: '3 levels of progressive hints, unlocked one at a time, only when you really get stuck.',
  },
  {
    icon: LineChart,
    titre: 'Explain Your Approach',
    description: 'The final step: explain your reasoning in your own words. This is where your understanding is assessed.',
  },
]

const PUBLICS = [
  {
    icon: GraduationCap,
    titre: 'Pupils & Students',
    description: 'From middle school to higher education — a guided learning journey tailored to your level, never a copied-and-pasted answer.',
  },
  {
    icon: Users,
    titre: 'Parents',
    description: "Track your child's actual thinking effort, not just their grades.",
  },
  {
    icon: School,
    titre: 'Educational Institutions',
    description: 'Class statistics to support teaching and encourage thoughtful AI use.',
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
              Socratic Method · Guided AI
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl">
              Learn to Think,
              <br />
              Don't Just Copy.
            </h1>
            <p className="mt-5 text-lg text-slate-600 dark:text-slate-300">
              Xaam-Xaam+ turns AI into an educational tool: it asks questions that help you make
              progress, never ready-made answers to copy.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/inscription">
                <Button size="lg" className="gap-2">
                  Get Started for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/connexion">
                <Button size="lg" variant="outline">I Already Have an Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="mx-auto max-w-6xl px-4 py-16 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-100">
          How It Works
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-center text-sm text-slate-500 dark:text-slate-400">
          A 4-step learning journey designed to strengthen your thinking, not replace it.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ETAPES.map((etape, i) => (
            <Card key={etape.titre} className="relative">
              <CardBody>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                  <etape.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 text-xs font-medium text-brand-500">Step {i + 1}</p>
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
            Designed for the Entire Learning Community
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
                Designed with Minors' Safety as a Priority
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Parental consent, student-controlled access to personal data, and data export
                and deletion upon request.
              </p>
            </div>
          </CardBody>
        </Card>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-3xl px-4 pb-20 text-center lg:px-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Ready to Change the Way You Learn?
        </h2>
        <div className="mt-6">
          <Link to="/inscription">
            <Button size="lg" className="gap-2">
              Create My Free Account <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
