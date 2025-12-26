import { useCallback, useEffect, useMemo, useState } from 'react'

type Scenario = 'any' | 'coffee' | 'event' | 'street' | 'work'
type Archetype = 'calm' | 'playful' | 'direct' | 'warm'

type Phrase = {
  id: string
  text: string
  supportive?: string
  scenario: Scenario | 'any'
  archetype: Archetype | 'any'
}

const scenarios: { id: Scenario; label: string; hint?: string }[] = [
  { id: 'any', label: 'Anywhere', hint: 'Default' },
  { id: 'coffee', label: 'Café' },
  { id: 'event', label: 'Event' },
  { id: 'street', label: 'Street' },
  { id: 'work', label: 'Work' },
]

const archetypes: { id: Archetype; label: string; tone: string }[] = [
  { id: 'calm', label: 'Calm', tone: 'steady & gentle' },
  { id: 'warm', label: 'Warm', tone: 'encouraging' },
  { id: 'playful', label: 'Playful', tone: 'light energy' },
  { id: 'direct', label: 'Direct', tone: 'clear & brief' },
]

const phrases: Phrase[] = [
  {
    id: 'any-calm-1',
    scenario: 'any',
    archetype: 'calm',
    text: 'Mind if I stand here?',
    supportive: 'Simple opener; no pressure.',
  },
  {
    id: 'any-warm-1',
    scenario: 'any',
    archetype: 'warm',
    text: 'Hey, how’s your day going?',
    supportive: 'Invites a small share.',
  },
  {
    id: 'any-playful-1',
    scenario: 'any',
    archetype: 'playful',
    text: 'I’m picking your vibe—what’s the story today?',
    supportive: 'Keeps it light and curious.',
  },
  {
    id: 'any-direct-1',
    scenario: 'any',
    archetype: 'direct',
    text: 'Hi, I’m just saying hello.',
    supportive: 'Clear and low stakes.',
  },
  {
    id: 'coffee-warm-1',
    scenario: 'coffee',
    archetype: 'warm',
    text: 'Tried anything good here?',
    supportive: 'Shared taste is an easy bridge.',
  },
  {
    id: 'coffee-calm-1',
    scenario: 'coffee',
    archetype: 'calm',
    text: 'Is the line usually this calm?',
    supportive: 'Starts small talk naturally.',
  },
  {
    id: 'event-playful-1',
    scenario: 'event',
    archetype: 'playful',
    text: 'What pulled you to this event?',
    supportive: 'Opens space for their reason.',
  },
  {
    id: 'event-direct-1',
    scenario: 'event',
    archetype: 'direct',
    text: 'Hi—I’m [you]. What are you here for?',
    supportive: 'Direct intro tied to context.',
  },
  {
    id: 'street-calm-1',
    scenario: 'street',
    archetype: 'calm',
    text: 'Is this the right way to the main street?',
    supportive: 'Neutral, easy to answer.',
  },
  {
    id: 'street-playful-1',
    scenario: 'street',
    archetype: 'playful',
    text: 'Is there a better route than my map says?',
    supportive: 'Softly playful; invites help.',
  },
  {
    id: 'work-calm-1',
    scenario: 'work',
    archetype: 'calm',
    text: 'How’s your day going so far?',
    supportive: 'Low-pressure workplace opener.',
  },
  {
    id: 'work-direct-1',
    scenario: 'work',
    archetype: 'direct',
    text: 'Quick hello—I’m [you]. What team are you on?',
    supportive: 'Direct and specific.',
  },
]

const selectPhrases = (scenario: Scenario, archetype: Archetype): Phrase[] => {
  const byScenario = phrases.filter(
    (phrase) => phrase.scenario === scenario || phrase.scenario === 'any',
  )
  const refined = byScenario.filter(
    (phrase) => phrase.archetype === archetype || phrase.archetype === 'any',
  )

  if (refined.length) {
    console.info('[Icebreak] matched phrase pool', {
      scenario,
      archetype,
      poolSize: refined.length,
    })
    return refined
  }

  if (byScenario.length) {
    console.warn('[Icebreak] no archetype-specific match, falling back', {
      scenario,
      archetype,
      poolSize: byScenario.length,
    })
    return byScenario
  }

  console.error('[Icebreak] no matching phrases, using full set', {
    scenario,
    archetype,
  })
  return phrases
}

const pickRandom = (items: Phrase[], excludeId?: string): Phrase => {
  if (items.length === 1) return items[0]
  let choice: Phrase | null = null
  let guard = 0
  while (!choice && guard < 8) {
    const candidate = items[Math.floor(Math.random() * items.length)]
    if (!excludeId || candidate.id !== excludeId) {
      choice = candidate
      break
    }
    guard += 1
  }
  return choice ?? items[0]
}

function App() {
  const [scenario, setScenario] = useState<Scenario>('any')
  const [archetype, setArchetype] = useState<Archetype>('calm')
  const [activePhrase, setActivePhrase] = useState<Phrase | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const pool = useMemo(
    () => selectPhrases(scenario, archetype),
    [scenario, archetype],
  )

  const generatePhrase = useCallback(() => {
    if (!pool.length) {
      console.error('[Icebreak] attempted to generate with empty pool')
      return
    }
    setIsAnimating(true)
    const next = pickRandom(pool, activePhrase?.id)
    setActivePhrase(next)
    setTimeout(() => setIsAnimating(false), 220)
  }, [pool])

  useEffect(() => {
    generatePhrase()
  }, [generatePhrase])

  return (
    <div className="min-h-screen px-4 py-8 sm:py-12 flex items-center justify-center">
      <main className="w-full max-w-xl space-y-6">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-600 tracking-wide">
              Icebreak
            </p>
            <p className="text-xs text-slate-500">
              Tap once, speak naturally. Calm, neutral prompts.
            </p>
          </div>
          <div className="rounded-full px-3 py-1 text-xs font-semibold bg-white/80 text-slate-600 shadow-sm border border-white/60">
            Mobile-first · PWA
          </div>
        </header>

        <section className="bg-white/80 backdrop-blur-xl shadow-card rounded-3xl border border-white/70 p-6 sm:p-7 space-y-6">
          <div className="flex flex-wrap gap-2">
            {scenarios.map((item) => {
              const isActive = scenario === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setScenario(item.id)}
                  className={`rounded-full px-3 py-2 text-sm font-medium border transition-all ${
                    isActive
                      ? 'bg-ink text-white border-ink shadow-md shadow-ink/20'
                      : 'bg-white/70 text-slate-700 border-slate-200 hover:border-ink/20 hover:text-ink'
                  }`}
                  aria-pressed={isActive}
                >
                  {item.label}
                  {item.hint ? ` · ${item.hint}` : ''}
                </button>
              )
            })}
          </div>

          <div className="flex flex-wrap gap-2">
            {archetypes.map((item) => {
              const isActive = archetype === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setArchetype(item.id)}
                  className={`rounded-full px-3 py-2 text-sm font-medium border transition-all ${
                    isActive
                      ? 'bg-accent text-ink border-accent shadow-md shadow-accent/30'
                      : 'bg-white/70 text-slate-700 border-slate-200 hover:border-ink/20 hover:text-ink'
                  }`}
                  aria-pressed={isActive}
                >
                  {item.label}
                  <span className="text-[11px] text-slate-500 ml-1">
                    {item.tone}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            className={`rounded-2xl border border-slate-100 bg-gradient-to-br from-white via-white to-frost p-5 sm:p-6 shadow-inner transition-transform ${
              isAnimating ? 'scale-[0.99]' : 'scale-100'
            }`}
          >
            <p className="text-xs font-semibold tracking-wide text-slate-500 mb-2">
              Prompt
            </p>
            <div className="space-y-3" aria-live="polite">
              <p className="text-2xl sm:text-3xl font-semibold text-ink leading-tight">
                {activePhrase?.text ?? 'Tap Icebreak to get a phrase.'}
              </p>
              {activePhrase?.supportive ? (
                <p className="text-sm text-slate-600">
                  {activePhrase.supportive}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={generatePhrase}
            className="w-full inline-flex items-center justify-center rounded-2xl bg-ink text-white font-semibold text-lg py-4 shadow-lg shadow-ink/25 active:translate-y-[1px] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            Icebreak
          </button>
        </section>

        <footer className="text-xs text-slate-500 text-center space-y-1">
          <p>Calm, neutral, non-assumptive language only.</p>
          <p className="text-slate-400">
            Phrases are pre-written; no data leaves this device in MVP.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default App
