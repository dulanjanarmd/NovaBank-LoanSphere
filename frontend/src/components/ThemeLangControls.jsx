import { Sun, Moon, Globe } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { useState, useRef, useEffect } from 'react'

const LANGS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'si', label: 'සිං', full: 'සිංහල' },
  { code: 'ta', label: 'தமி', full: 'தமிழ்' },
]

export default function ThemeLangControls({ className = '' }) {
  const { dark, toggleDark } = useTheme()
  const { lang, changeLang } = useLang()
  const [showLang, setShowLang] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowLang(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className={`flex items-center gap-1 ${className}`} ref={ref}>
      {/* Dark mode toggle */}
      <button
        onClick={toggleDark}
        title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-ink-100 dark:hover:bg-white/10 text-ink-600 dark:text-navy-300"
      >
        {dark
          ? <Sun className="h-4 w-4 text-amber-400" />
          : <Moon className="h-4 w-4" />
        }
      </button>

      {/* Language switcher */}
      <div className="relative">
        <button
          onClick={() => setShowLang((s) => !s)}
          title="Change Language"
          className="flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-semibold transition-colors hover:bg-ink-100 dark:hover:bg-white/10 text-ink-600 dark:text-navy-300"
        >
          <Globe className="h-3.5 w-3.5" />
          <span>{LANGS.find((l) => l.code === lang)?.label}</span>
        </button>

        {showLang && (
          <div className="absolute right-0 top-10 z-50 min-w-[130px] rounded-xl border border-ink-200 dark:border-white/10 bg-white dark:bg-navy-800 shadow-xl overflow-hidden">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => { changeLang(l.code); setShowLang(false) }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors
                  ${lang === l.code
                    ? 'bg-accent-50 dark:bg-accent-900/40 text-accent-700 dark:text-accent-300 font-semibold'
                    : 'text-ink-700 dark:text-navy-200 hover:bg-ink-50 dark:hover:bg-white/5'
                  }`}
              >
                <span className="text-base leading-none">{l.code === 'en' ? '🇬🇧' : l.code === 'si' ? '🇱🇰' : '🇮🇳'}</span>
                {l.full}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
