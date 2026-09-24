// Copyright © 2026 Mochisoft OÜ
// SPDX-License-Identifier: AGPL-3.0-only
// This file is part of Mochi, licensed under the GNU AGPL v3 with the
// Mochi Application Interface Exception - see license.txt and license-exception.md.
import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { useLingui } from '@lingui/react/macro'
import {
  useQueryWithError,
  requestHelpers,
  EmptyState,
  Main,
  Skeleton,
  RestoreBanner,
  naturalCompare,
} from '@mochi/web'
import { AlertCircle } from 'lucide-react'

const maskBorderRadius: Record<string, string> = {
  circle: '50%',
  square: '0',
  rounded: '22%',
  squircle: '28%',
}

function iconStyle(
  icon: AppIcon,
  mask?: string,
  background?: string
): { container: CSSProperties; foreground: CSSProperties; className: string } {
  const url = `url(/${icon.path}/${icon.file})`
  const maskProps = {
    maskImage: url,
    maskSize: 'contain',
    maskRepeat: 'no-repeat',
    maskPosition: 'center',
    WebkitMaskImage: url,
    WebkitMaskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
  } as CSSProperties
  if (mask && maskBorderRadius[mask]) {
    return {
      container: {
        backgroundColor: background || 'var(--primary)',
        borderRadius: maskBorderRadius[mask],
      },
      foreground: { ...maskProps, backgroundColor: 'white' },
      className: 'adaptive',
    }
  }
  return { container: {}, foreground: maskProps, className: 'default' }
}

interface AppIcon {
  id: string
  path: string
  name: string
  file: string
  link: string
  highlight?: boolean
}

interface IconsResponse {
  icons: AppIcon[]
  icon_mask?: string
  icon_background?: string
}

// The icon is decoration: the visible name alone labels the link.
export function Shortcut({
  icon,
  mask,
  background,
}: {
  icon: AppIcon
  mask?: string
  background?: string
}) {
  const style = iconStyle(icon, mask, background)
  return (
    <a
      href={`/${icon.link}/`}
      className='group focus-visible:ring-ring flex w-[var(--cell,5rem)] flex-col items-center gap-2 rounded-xl py-2 outline-none focus-visible:ring-2 sm:w-[var(--cell,8rem)]'
    >
      <div className='relative transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110'>
        {style.className === 'adaptive' ? (
          <div
            className='flex h-16 w-16 items-center justify-center overflow-hidden'
            style={style.container}
          >
            <div
              className='h-9 w-9'
              style={style.foreground}
              aria-hidden='true'
            />
          </div>
        ) : (
          <div className='flex h-16 w-16 items-center justify-center'>
            <div
              className='bg-primary/70 group-hover:bg-primary h-11 w-11 transition-colors duration-300'
              style={style.foreground}
              aria-hidden='true'
            />
          </div>
        )}
        {icon.highlight && (
          <span
            className='absolute -top-1 -right-1 flex h-3 w-3'
            aria-hidden='true'
          >
            <span className='bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
            <span className='bg-primary relative inline-flex h-3 w-3 rounded-full' />
          </span>
        )}
      </div>

      <span
        className='text-foreground group-hover:text-primary max-w-full truncate text-center text-xs font-medium transition-colors sm:text-sm'
        title={icon.name}
        data-name
      >
        {icon.name}
      </span>
    </a>
  )
}

// Lays its cells out in as few rows as fit, spread evenly across them and
// centred: 19 apps at 1920px are rows of 10 and 9, not 9, 9 and 1. Every cell
// is as wide as the widest name as the browser draws it, within limits, so a
// long name, a wide font or a long translation is not cut off; on a phone the
// limit keeps four to a row and cuts a longer name short. CSS can wrap cells
// but can neither balance the rows nor size them by the widest name, so both
// are measured.
function Grid({ count, children }: { count: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState<number>()

  // Every render: the names change with the language.
  useLayoutEffect(() => {
    const grid = ref.current
    const room = grid?.parentElement
    if (!grid || !room) return
    const measure = () => {
      if (count === 0) return
      const root =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
      const gap = parseFloat(getComputedStyle(grid).columnGap) || 0
      const padding = getComputedStyle(room)
      const available =
        room.clientWidth -
        parseFloat(padding.paddingLeft) -
        parseFloat(padding.paddingRight)
      // Below Tailwind's sm breakpoint, where the cells switch size.
      const phone = window.innerWidth < 640
      const minimum = (phone ? 5 : 8) * root
      const maximum = phone
        ? Math.max(minimum, (available + gap) / 4 - gap)
        : 12 * root
      const names = grid.querySelectorAll<HTMLElement>('[data-name]')
      const widest = Math.max(
        0,
        ...Array.from(names, (name) => name.scrollWidth)
      )
      const cell = Math.min(maximum, Math.max(minimum, widest + root / 2))
      grid.style.setProperty('--cell', `${cell}px`)
      const fit = Math.max(1, Math.floor((available + gap) / (cell + gap)))
      const columns = Math.ceil(count / Math.ceil(count / fit))
      setWidth(columns * (cell + gap) - gap)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(room)
    // A font still loading, such as the dyslexia one, widens the names later.
    void document.fonts?.ready.then(measure)
    return () => observer.disconnect()
  })

  return (
    <div
      ref={ref}
      className='mx-auto mb-12 flex flex-wrap justify-center gap-x-2 gap-y-6'
      style={{ maxWidth: width }}
    >
      {children}
    </div>
  )
}

export function Home() {
  const { t } = useLingui()
  const { data, isLoading, ErrorComponent } = useQueryWithError<
    IconsResponse,
    Error
  >({
    queryKey: ['app-icons'],
    queryFn: () => requestHelpers.get<IconsResponse>('-/icons'),
  })

  if (isLoading) {
    return (
      <Main fluid className='mx-auto max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-8 text-center'>
          <Skeleton className='mx-auto h-12 w-32' />
        </div>
        <Grid count={12}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className='flex w-[var(--cell,5rem)] flex-col items-center gap-2 py-2 sm:w-[var(--cell,8rem)]'
            >
              <Skeleton className='h-16 w-16 rounded-2xl' />
              <Skeleton className='h-4 w-16' />
            </div>
          ))}
        </Grid>
      </Main>
    )
  }

  if (ErrorComponent) {
    return (
      <Main fluid className='mx-auto max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8'>
        {ErrorComponent}
      </Main>
    )
  }

  // Consumer-side sort: core's ToLower ordering is accent- and numeric-blind.
  const icons = [...(data?.icons ?? [])].sort((a, b) =>
    naturalCompare(a.name, b.name)
  )

  if (icons.length === 0) {
    return (
      <Main>
        <EmptyState
          icon={AlertCircle}
          title={t`No apps found`}
          description={t`We couldn't find any apps for you. This is unexpected.`}
        />
      </Main>
    )
  }

  return (
    <Main fluid className='mx-auto max-w-[96rem] px-4 py-8 sm:px-6 lg:px-8'>
      <RestoreBanner />

      {/* Hero Section */}
      <div className='mb-8 hidden text-center sm:block'>
        <h1 className='from-primary to-primary-light mx-auto w-fit bg-linear-165 bg-clip-text text-[36px] font-light tracking-[3px] text-transparent'>
          {/* jsx-text-ok: brand wordmark, verbatim in every locale */}
          mochi
        </h1>
      </div>
      <Grid count={icons.length}>
        {icons.map((icon) => (
          <Shortcut
            key={`${icon.id}:${icon.path}:${icon.file}`}
            icon={icon}
            mask={data?.icon_mask}
            background={data?.icon_background}
          />
        ))}
      </Grid>
    </Main>
  )
}
