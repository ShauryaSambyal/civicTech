import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Plug, UserRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { scrollToTarget } from '../hooks/useSmoothScroll';

const displayName = (user) =>
  user?.displayName || (user?.email ? user.email.split('@')[0] : 'Resident');

const initials = (user) =>
  displayName(user)
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

/** The square 28px avatar, or initials when there is no Google photo. */
function Avatar({ user }) {
  return (
    <span
      aria-hidden="true"
      className="grid h-7 w-7 shrink-0 place-items-center overflow-hidden"
      style={{
        borderRadius: 'var(--radius)',
        border: '1px solid var(--rule-strong)',
        backgroundColor: 'var(--surface)',
        fontSize: 'var(--fs-micro)',
        letterSpacing: '0.06em'
      }}
    >
      {user?.photoURL ? (
        <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
      ) : (
        initials(user) || <UserRound size={13} strokeWidth={1.8} />
      )}
    </span>
  );
}

/**
 * The account control for the header.
 *
 * Signed out it is a single "Sign in" button. Signed in it becomes the
 * avatar, and the menu behind it is where the account's own material lives:
 * how many reports this person has filed, how many they have backed, and the
 * way out. In demo mode the same control says so out loud rather than
 * implying an account that does not exist.
 */
export default function AccountMenu({ onRequestSignIn, myCount = 0, backedCount = 0 }) {
  const { user, loading, isDemo, signOutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  /* Close on outside click and on Escape. */
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  if (loading) {
    return (
      <span
        aria-hidden="true"
        className="h-7 w-7 shrink-0 anim-spin-slow"
        style={{ borderRadius: 'var(--radius)', border: '1px solid var(--rule)' }}
      />
    );
  }

  if (!user) {
    return (
      <button type="button" onClick={() => onRequestSignIn()} className="btn btn-ghost" style={{ paddingBlock: '0.4rem' }}>
        <UserRound size={14} strokeWidth={1.9} aria-hidden="true" />
        Sign in
      </button>
    );
  }

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 py-1 pl-1 pr-2 transition-opacity duration-200 hover:opacity-75"
        style={{ borderRadius: 'var(--radius)' }}
      >
        <Avatar user={user} />
        <span
          className="hidden max-w-[9rem] truncate sm:inline"
          style={{ fontSize: 'var(--fs-small)', fontWeight: 500 }}
        >
          {displayName(user)}
        </span>
        <ChevronDown size={13} strokeWidth={2} aria-hidden="true" style={{ color: 'var(--ink-faint)' }} />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Account"
          className="menu absolute right-0 top-full mt-2 w-64 p-1"
        >
          <div className="px-3 py-3" style={{ borderBottom: '1px solid var(--rule)' }}>
            <p className="text-body truncate" style={{ fontSize: 'var(--fs-small)', fontWeight: 500 }}>
              {displayName(user)}
            </p>
            <p className="text-faint truncate mt-0.5" style={{ fontSize: 'var(--fs-micro)' }}>
              {user.email || (isDemo ? 'Local session — not an account' : '')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px my-1" style={{ background: 'var(--rule)' }}>
            <div className="px-3 py-2.5" style={{ backgroundColor: 'var(--bg-2)' }}>
              <p className="tabular text-body leading-none" style={{ fontSize: '1.125rem' }}>{myCount}</p>
              <p className="label" style={{ margin: '0.4rem 0 0', fontSize: '0.5625rem' }}>Filed</p>
            </div>
            <div className="px-3 py-2.5" style={{ backgroundColor: 'var(--bg-2)' }}>
              <p className="tabular text-body leading-none" style={{ fontSize: '1.125rem' }}>{backedCount}</p>
              <p className="label" style={{ margin: '0.4rem 0 0', fontSize: '0.5625rem' }}>Backed</p>
            </div>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              scrollToTarget('#account');
            }}
            className="menu-item"
          >
            My record
          </button>

          {/* In demo mode the account panel is also where the setup checklist
              lives, so the way to it has to be reachable from here. */}
          {isDemo ? (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onRequestSignIn();
              }}
              className="menu-item"
            >
              <Plug size={13} strokeWidth={1.9} aria-hidden="true" />
              Connect Firebase
            </button>
          ) : (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                signOutUser();
              }}
              className="menu-item"
            >
              <LogOut size={13} strokeWidth={1.9} aria-hidden="true" />
              Sign out
            </button>
          )}
        </div>
      )}
    </div>
  );
}
