import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { animate, stagger, utils } from 'animejs'
import { SECTIONS } from './constants'
import { DUR, EASE, STAGGER, motionEnabled } from '../lib/motion'
import { useScrolled, useScrollSpy } from '../hooks/useAnimation'
import { startScroll, stopScroll } from '../hooks/useSmoothScroll'

const SECTION_IDS = SECTIONS.map((section) => section.id)

/**
 * Sticky header for the single page. Nav items are plain anchor links, so
 * scrolling, deep links and back/forward all work without a router. The active
 * item is derived from scroll position (see useScrollSpy), not from clicks.
 *
 * Motion: the header fades in on load, a single accent bar slides between
 * items as you scroll, and the mobile drawer slides + staggers open.
 */
const Navbar = ({ user }) => {
  const [showMobile, setShowMobile] = useState(false)
  const [theme, setTheme] = useState(() => {
    try {
      const stored = localStorage.getItem('theme')
      return stored === 'light' || stored === 'dark' ? stored : 'dark'
    } catch {
      return 'dark'
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
    root.style.backgroundColor = theme === 'dark' ? '#08090a' : '#f7f7f5'
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  /* Entrance — the bar settles in, then the links rise one by one. */
  useEffect(() => {
    if (!motionEnabled()) return
    const links = Object.values(linkRefs.current).filter(Boolean)
    animate(headerRef.current, {
      opacity: [0, 1],
      y: [-14, 0],
      duration: DUR.enter,
      ease: EASE.out
    })
    if (links.length) {
      animate(links, {
        opacity: [0, 1],
        y: [-8, 0],
        delay: stagger(STAGGER.base, { start: 180 }),
        duration: DUR.base,
        ease: EASE.out
      })
    }
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

  /* Mobile drawer: slide in, then stagger the links. */
  useEffect(() => {
    const drawer = drawerRef.current
    if (!drawer || !motionEnabled()) return
    animate(drawer, { opacity: [0, 1], y: [-10, 0], duration: DUR.base, ease: EASE.out })
    animate(drawer.querySelectorAll('a'), {
      opacity: [0, 1],
      y: [10, 0],
      delay: stagger(STAGGER.base, { start: 120 }),
      duration: DUR.base,
      ease: EASE.out
    })
  }, [showMobile])

  /* While the drawer is open on a phone, freeze the page behind it. */
  useEffect(() => {
    if (!showMobile) return undefined
    stopScroll()
    return () => startScroll()
  }, [showMobile])

  const toggleTheme = (event) => {
    const label = event.currentTarget.querySelector('[data-theme-label]')
    if (label && motionEnabled()) {
      animate(label, {
        opacity: [1, 0],
        y: [0, -6],
        duration: DUR.micro / 2,
        ease: EASE.out,
        onComplete: () => {
          setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
          animate(label, { opacity: [0, 1], y: [6, 0], duration: DUR.micro, ease: EASE.out })
        }
      })
      return
    }
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b"
      style={{
        height: 'var(--header-h)',
        borderColor: scrolled ? 'var(--rule)' : 'transparent',
        backgroundColor: scrolled ? 'color-mix(in srgb, var(--bg) 86%, transparent)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        transition: 'background-color 0.35s var(--ease-out), border-color 0.35s var(--ease-out)'
      }}
    >
      <div className="container h-full">
        <nav className="flex h-full items-center justify-between gap-6" aria-label="Sections">

          {/* Brand — wordmark only */}
          <a
            href="#overview"
            className="flex items-baseline gap-[2px] shrink-0 transition-opacity duration-200 hover:opacity-70"
            style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', fontWeight: 600, letterSpacing: '-0.03em' }}
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
              style={{ height: '1px', background: 'var(--accent)', opacity: 0 }}
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
                  <span className="tabular" style={{ fontSize: '0.625rem', opacity: 0.7 }}>{index}</span>
                  <span className="link-sweep" style={{ fontSize: 'var(--fs-small)', fontWeight: 500 }}>{label}</span>
                </a>
              )
            })}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-3 shrink-0">
            <span
              className="hidden lg:inline tabular"
              style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.1em' }}
            >
              {user || 'Guest'}
            </span>

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
              className="btn-icon md:hidden"
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

      {/* Mobile drawer */}
      {showMobile && (
        <div
          id="mobile-menu"
          ref={drawerRef}
          className="md:hidden border-b"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--bg) 96%, transparent)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
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
                <span className="tabular" style={{ fontSize: '0.625rem', opacity: 0.7 }}>{index}</span>
                <span style={{ fontSize: 'var(--fs-body)', fontWeight: 500 }}>{label}</span>
              </a>
            ))}
            <span
              className="tabular pt-3"
              style={{ fontSize: 'var(--fs-micro)', color: 'var(--ink-faint)', letterSpacing: '0.1em' }}
            >
              {user || 'Guest'}
            </span>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar;
