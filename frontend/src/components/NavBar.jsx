import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, Menu, X } from 'lucide-react'
import { animate, stagger, utils } from 'animejs'
import { SECTIONS } from './constants'
import AccountMenu from './AccountMenu'
import { DUR, EASE, STAGGER, framesFlowing, motionEnabled } from '../lib/motion'
import { useScrolled, useScrollSpy } from '../hooks/useAnimation'
import { startScroll, stopScroll } from '../hooks/useSmoothScroll'

const SECTION_IDS = SECTIONS.map((section) => section.id)

/**
 * The fixed header. Two stacked rows, mirroring the reference's chrome:
 *
 *   strip  — live registry figures and the way to file a report
 *   row    — wordmark, the section rail, and the account cluster
 *
 * Nav items are plain anchor links, so scrolling, deep links and back/forward
 * all work without a router. The active item is derived from scroll position
 * (see useScrollSpy), not from clicks.
 *
 * Motion: the header fades in on load, a single accent bar slides between
 * items as you scroll, and the mobile drawer slides + staggers open.
 */
const Navbar = ({
  onRequestSignIn,
  myCount = 0,
  backedCount = 0,
  totalReports = 0,
  awaiting = 0,
  resolved = 0
}) => {
  const [showMobile, setShowMobile] = useState(false)
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme')
      return stored === 'light' || stored === 'dark' ? stored : 'light'
    } catch {
      return 'light'
    }
  })

  const scrolled = useScrolled(8)
  const activeId = useScrollSpy(SECTION_IDS)

  const headerRef = useRef(null)
  const railRef = useRef(null)
  const linkRefs = useRef({})
  const indicatorRef = useRef(null)
  const drawerRef = useRef(null)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.style.backgroundColor = theme === 'dark' ? '#0e0c08' : '#fbf8ef'
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  /*
   * Entrance — the bar settles in, then the links rise one by one.
   *
   * This is the one animation in the app whose failure mode is worse than
   * ugly: the header is fixed, so a timeline frozen at its "before" state
   * leaves the bar sitting 14px above the viewport with its links faded out.
   * So it follows the same rule as the reveal engine — if frames are not
   * flowing, skip the choreography and apply the final state outright, and
   * never let a stalled timeline hold the chrome hostage.
   */
  useEffect(() => {
    if (!motionEnabled()) return undefined

    const header = headerRef.current
    const links = Object.values(linkRefs.current).filter(Boolean)
    let running = []
    let settled = false

    const settle = () => {
      if (settled) return
      settled = true
      running.forEach((animation) => {
        try {
          // Only an unfinished timeline may be reverted: reverting a completed
          // one would restore the hidden state we are trying to clear.
          if (!animation.completed) animation.revert()
        } catch {
          /* already gone */
        }
      })
      running = []
      if (header) utils.set(header, { opacity: 1, y: 0 })
      if (links.length) utils.set(links, { opacity: 1, y: 0 })
    }

    // Backstop: whatever happens, the header is in place shortly after the
    // entrance would naturally have finished.
    const guard = setTimeout(settle, DUR.enter + 1400)

    framesFlowing().then((flowing) => {
      if (settled) return
      if (!flowing) {
        clearTimeout(guard)
        settle()
        return
      }
      running.push(
        animate(header, {
          opacity: [0, 1],
          y: [-14, 0],
          duration: DUR.enter,
          ease: EASE.out
        })
      )
      if (links.length) {
        running.push(
          animate(links, {
            opacity: [0, 1],
            y: [-8, 0],
            delay: stagger(STAGGER.base, { start: 180 }),
            duration: DUR.base,
            ease: EASE.out
          })
        )
      }
    })

    return () => clearTimeout(guard)
  }, [])

  /* The sliding indicator: measure the active link, animate the bar onto it. */
  const placeIndicator = useCallback((animated = true) => {
    const rail = railRef.current
    const link = linkRefs.current[activeId]
    const bar = indicatorRef.current
    if (!rail || !link || !bar) return

    const railBox = rail.getBoundingClientRect()
    const linkBox = link.getBoundingClientRect()
    const left = linkBox.left - railBox.left
    const width = linkBox.width
    if (!width) return

    if (animated && motionEnabled()) {
      animate(bar, { left, width, opacity: 1, duration: DUR.base, ease: EASE.out })
    } else {
      utils.set(bar, { left, width, opacity: 1 })
    }
  }, [activeId])

  useEffect(() => {
    placeIndicator(true)
    const onResize = () => placeIndicator(false)
    window.addEventListener('resize', onResize)
    // Web fonts change label widths, so re-measure once they land.
    if (document.fonts?.ready) document.fonts.ready.then(onResize).catch(() => {})
    return () => window.removeEventListener('resize', onResize)
  }, [placeIndicator])

  /* Mobile drawer: slide in, then stagger the links. Same backstop as the
     header — an open menu that never faded in is an invisible menu. */
  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer || !motionEnabled()) return undefined

    const drawerLinks = drawer.querySelectorAll('a')
    let settled = false
    let running = []

    const settle = () => {
      if (settled) return
      settled = true
      running.forEach((animation) => {
        try {
          if (!animation.completed) animation.revert()
        } catch {
          /* already gone */
        }
      })
      running = []
      utils.set(drawer, { opacity: 1, y: 0 })
      if (drawerLinks.length) utils.set(drawerLinks, { opacity: 1, y: 0 })
    }

    const guard = setTimeout(settle, DUR.base + 900)

    framesFlowing().then((flowing) => {
      if (settled) return
      if (!flowing) {
        clearTimeout(guard)
        settle()
        return
      }
      running.push(animate(drawer, { opacity: [0, 1], y: [-10, 0], duration: DUR.base, ease: EASE.out }))
      running.push(
        animate(drawerLinks, {
          opacity: [0, 1],
          y: [10, 0],
          delay: stagger(STAGGER.base, { start: 120 }),
          duration: DUR.base,
          ease: EASE.out
        })
      )
    })

    return () => clearTimeout(guard)
  }, [showMobile])

  /* While the drawer is open on a phone, freeze the page behind it. */
  useEffect(() => {
    if (!showMobile) return undefined
    stopScroll()
    return () => startScroll()
  }, [showMobile])

  const toggleTheme = (event) => {
    const flip = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    const label = event.currentTarget.querySelector('[data-theme-label]')
    if (label && motionEnabled()) {
      // The label animation carries the state change, so a stalled timeline
      // would leave the control doing nothing. Commit on a timer as well.
      let applied = false
      const commit = () => {
        if (applied) return
        applied = true
        flip()
        animate(label, { opacity: [0, 1], y: [6, 0], duration: DUR.micro, ease: EASE.out })
      }
      const fallback = setTimeout(commit, 220)
      animate(label, {
        opacity: [1, 0],
        y: [0, -6],
        duration: DUR.micro / 2,
        ease: EASE.out,
        onComplete: () => {
          clearTimeout(fallback)
          commit()
        }
      })
      return
    }
    flip()
  }

  /* Never duplicate the words between the mobile and desktop variants: a
     screen reader reads every copy, so the narrower ones only drop clauses. */
  const stripMessage = (
    <>
      <span className="tabular text-body">{totalReports}</span>{' '}
      {totalReports === 1 ? 'report' : 'reports'} on record
      <span className="hidden sm:inline">
        {' · '}
        <span className="tabular text-body">{awaiting}</span> awaiting action
      </span>
      {resolved > 0 && (
        <span className="hidden lg:inline">
          {' · '}
          <span className="tabular text-body">{resolved}</span> resolved
        </span>
      )}
    </>
  )

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50"
      style={{
        backgroundColor: 'var(--bg)',
        borderBottom: `1px solid ${scrolled ? 'var(--rule)' : 'transparent'}`,
        boxShadow: scrolled ? '0 20px 44px -40px rgba(19, 15, 2, 0.55)' : 'none',
        transition: 'border-color 0.35s var(--ease-out), box-shadow 0.35s var(--ease-out)'
      }}
    >
      {/* Announcement strip — live figures, so the chrome carries real state. */}
      <div className="header-strip">
        <div className="container h-full flex items-center justify-between gap-4">
          <p
            className="truncate"
            style={{ fontSize: 'var(--fs-micro)', letterSpacing: '0.06em', color: 'var(--ink-muted)' }}
          >
            {stripMessage}
          </p>
          <a
            href="#report"
            className="strip-link shrink-0 inline-flex items-center gap-1.5"
            style={{ fontSize: 'var(--fs-micro)', letterSpacing: '0.06em' }}
          >
            File a report
            <ArrowRight size={12} strokeWidth={2} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Main row */}
      <div style={{ height: 'var(--header-row-h)' }}>
        <div className="container h-full">
          <nav className="flex h-full items-center justify-between gap-6" aria-label="Sections">

            {/* Brand — wordmark only */}
            <a
              href="#overview"
              className="shrink-0 transition-opacity duration-200 hover:opacity-70"
              style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600, letterSpacing: '0.025em' }}
            >
              <span className="text-body">Civic</span>
              <span className="text-faint">Tech</span>
            </a>

            {/* Desktop anchors with a sliding accent indicator */}
            <div ref={railRef} className="hidden md:flex relative items-stretch h-full gap-8">
              <span
                ref={indicatorRef}
                aria-hidden="true"
                className="absolute bottom-0 pointer-events-none"
                style={{ height: '2px', background: 'var(--accent)', opacity: 0 }}
              />

              {SECTIONS.map(({ id, label, index }) => {
                const isActive = activeId === id
                return (
                  <a
                    key={id}
                    ref={(el) => { linkRefs.current[id] = el }}
                    href={`#${id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="relative z-10 flex items-center h-full gap-2 text-faint transition-colors duration-200 hover:text-body"
                    style={{ color: isActive ? 'var(--ink)' : undefined }}
                  >
                    <span className="tabular" style={{ fontSize: '0.6875rem', opacity: 0.7 }}>{index}</span>
                    <span className="link-sweep" style={{ fontSize: 'var(--fs-small)', fontWeight: 500 }}>{label}</span>
                  </a>
                )
              })}
            </div>

            {/* Right cluster */}
            <div className="flex items-center gap-3 shrink-0">
              <AccountMenu
                onRequestSignIn={onRequestSignIn}
                myCount={myCount}
                backedCount={backedCount}
              />

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                className="btn-icon"
              >
                <span data-theme-label style={{ fontSize: '0.6875rem', letterSpacing: '0.1em' }}>
                  {theme === 'dark' ? 'LGT' : 'DRK'}
                </span>
              </button>

              <button
                type="button"
                className="btn-icon md-hidden"
                onClick={() => setShowMobile((open) => !open)}
                aria-expanded={showMobile}
                aria-controls="mobile-menu"
                aria-label={showMobile ? 'Close menu' : 'Open menu'}
              >
                {showMobile ? <X size={16} strokeWidth={1.8} /> : <Menu size={16} strokeWidth={1.8} />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile drawer */}
      {showMobile && (
        <div
          id="mobile-menu"
          ref={drawerRef}
          className="md:hidden border-t"
          style={{
            backgroundColor: 'var(--bg)',
            borderColor: 'var(--rule)'
          }}
        >
          <div className="container py-3 flex flex-col">
            {SECTIONS.map(({ id, label, index }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={() => setShowMobile(false)}
                aria-current={activeId === id ? 'true' : undefined}
                className="flex items-baseline gap-3 py-3 border-b text-faint transition-colors duration-200 hover:text-body"
                style={{ borderColor: 'var(--rule)', color: activeId === id ? 'var(--ink)' : undefined }}
              >
                <span className="tabular" style={{ fontSize: '0.6875rem', opacity: 0.7 }}>{index}</span>
                <span style={{ fontSize: 'var(--fs-body)', fontWeight: 500 }}>{label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar;
