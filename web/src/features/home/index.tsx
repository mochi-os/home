// Copyright © 2026 Mochisoft OÜ
// SPDX-License-Identifier: AGPL-3.0-only
// This file is part of Mochi, licensed under the GNU AGPL v3 with the
// Mochi Application Interface Exception - see license.txt and license-exception.md.
import type { CSSProperties } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import {
  useQueryWithError,
  requestHelpers,
  EmptyState,
  Main,
  CardSkeleton,
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
  development: AppIcon[]
  icon_mask?: string
  icon_background?: string
}

function IconCard({
  icon,
  mask,
  background,
  development,
}: {
  icon: AppIcon
  mask?: string
  background?: string
  development?: boolean
}) {
  const style = iconStyle(icon, mask, background)
  const highlight = icon.highlight
  const scale = development ? 'group-hover:scale-105' : 'group-hover:scale-110'
  return (
    <a
      href={`/${icon.link}/`}
      className={`group hover:bg-hover relative flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-300 ${
        development
          ? 'bg-card/50 hover:-translate-y-0.5'
          : 'bg-card hover:-translate-y-1'
      } ${
        highlight
          ? 'border-primary hover:border-primary'
          : development
            ? 'border-border hover:border-primary/30 border-dashed'
            : 'border-border hover:border-primary/20'
      }`}
      style={{ boxShadow: 'var(--card-shadow)' }}
    >
      {highlight && (
        <span
          className='absolute -top-1 -right-1 flex h-3 w-3'
          aria-hidden='true'
        >
          <span className='bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
          <span className='bg-primary relative inline-flex h-3 w-3 rounded-full' />
        </span>
      )}
      {/* Icon Container */}
      {style.className === 'adaptive' ? (
        <div
          className={`flex h-14 w-14 items-center justify-center overflow-hidden transition-all duration-300 ${scale}`}
          style={style.container}
        >
          <div
            className='h-8 w-8'
            style={style.foreground}
            role='img'
            aria-label={icon.name}
          />
        </div>
      ) : (
        <div
          className={`flex h-14 w-14 items-center justify-center transition-all duration-300 ${scale}`}
        >
          <div
            className={`bg-primary/70 group-hover:bg-primary h-8 w-8 transition-all duration-300 ${development ? '' : scale}`}
            style={style.foreground}
            role='img'
            aria-label={icon.name}
          />
        </div>
      )}

      {/* App Name */}
      {development ? (
        <div className='flex flex-col items-center gap-0.5'>
          <span className='text-foreground group-hover:text-primary text-center text-xs font-medium transition-colors'>
            {icon.name}
          </span>
          <span className='text-muted-foreground text-center text-[10px]'>
            {icon.id}
          </span>
        </div>
      ) : (
        <span className='text-foreground group-hover:text-primary text-center text-sm font-medium transition-colors'>
          {icon.name}
        </span>
      )}
    </a>
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
      <Main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-8 text-center'>
          <Skeleton className='mx-auto h-12 w-32' />
        </div>
        <div className='mb-12 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'>
          <CardSkeleton count={12} className='contents' />
        </div>
      </Main>
    )
  }

  if (ErrorComponent) {
    return (
      <Main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        {ErrorComponent}
      </Main>
    )
  }

  // Consumer-side sort: core's ToLower ordering is accent- and numeric-blind.
  const icons = [...(data?.icons ?? [])].sort((a, b) =>
    naturalCompare(a.name, b.name)
  )
  const development = [...(data?.development ?? [])].sort((a, b) =>
    naturalCompare(a.name, b.name)
  )

  if (icons.length === 0 && development.length === 0) {
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
    <Main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <RestoreBanner />

      {/* Hero Section */}
      <div className='mb-8 hidden text-center sm:block'>
        <h1 className='from-primary to-primary-light mx-auto w-fit bg-linear-165 bg-clip-text text-[36px] font-light tracking-[3px] text-transparent'>
          {/* jsx-text-ok: brand wordmark, verbatim in every locale */}
          mochi
        </h1>
      </div>
      {/* Main Apps Grid */}
      {icons.length > 0 && (
        <div className='mb-12 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'>
          {icons.map((icon) => (
            <IconCard
              key={`${icon.id}:${icon.path}:${icon.file}`}
              icon={icon}
              mask={data?.icon_mask}
              background={data?.icon_background}
            />
          ))}
        </div>
      )}

      {/* Development Apps Section */}
      {development.length > 0 && (
        <div>
          <div className='mb-6 flex items-center gap-3'>
            <div className='bg-border h-px flex-1' />
            <h2 className='text-muted-foreground text-xs font-medium tracking-wider uppercase'>
              <Trans>Development</Trans>
            </h2>
            <div className='bg-border h-px flex-1' />
          </div>

          <div className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'>
            {development.map((icon) => (
              <IconCard
                key={`${icon.id}:${icon.path}:${icon.file}`}
                icon={icon}
                mask={data?.icon_mask}
                background={data?.icon_background}
                development
              />
            ))}
          </div>
        </div>
      )}
    </Main>
  )
}
