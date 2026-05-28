import type { CSSProperties } from 'react'
import { Trans, useLingui } from '@lingui/react/macro'
import { useQueryWithError, requestHelpers, EmptyState, Main, CardSkeleton, Skeleton, RestoreBanner } from '@mochi/web'
import { AlertCircle } from 'lucide-react'

const maskBorderRadius: Record<string, string> = {
  circle: '50%',
  square: '0',
  rounded: '22%',
  squircle: '28%',
}

function iconStyle(icon: AppIcon, mask?: string, background?: string): { container: CSSProperties; foreground: CSSProperties; className: string } {
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
      container: { backgroundColor: background || 'var(--primary)', borderRadius: maskBorderRadius[mask] },
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

export function Home() {
  const { t } = useLingui()
  const { data, isLoading, ErrorComponent } = useQueryWithError<IconsResponse, Error>({
    queryKey: ['app-icons'],
    queryFn: () => requestHelpers.get<IconsResponse>('/-/icons'),
  })

  if (isLoading) {
    return (
      <Main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <div className='mb-8 text-center'>
          <Skeleton className='mx-auto h-12 w-32' />
        </div>
        <div className='mb-12 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'>
          <CardSkeleton count={12} className="contents" />
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

  const icons = data?.icons ?? []
  const development = data?.development ?? []

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
      <div className='mb-8 text-center hidden sm:block'>
        <h1
          className='bg-gradient-to-br from-foreground to-muted-foreground/30 bg-clip-text text-[36px] font-light tracking-[3px] text-transparent'
        >
          mochi
        </h1>
      </div>
      {/* Main Apps Grid */}
      {icons.length > 0 && (
        <div className='mb-12 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'>
          {icons.map((icon) => {
            const style = iconStyle(icon, data?.icon_mask, data?.icon_background)
            const highlight = icon.highlight
            return (
              <a
                key={icon.path}
                href={`/${icon.link}/`}
                className={`group relative flex flex-col items-center gap-2 rounded-xl border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-hover ${
                  highlight
                    ? 'border-primary hover:border-primary'
                    : 'border-border hover:border-primary/20'
                }`}
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                {highlight && (
                  <span
                    className='absolute -top-1 -right-1 flex h-3 w-3'
                    aria-hidden='true'
                  >
                    <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75' />
                    <span className='relative inline-flex h-3 w-3 rounded-full bg-primary' />
                  </span>
                )}
                {/* Icon Container */}
                {style.className === 'adaptive' ? (
                  <div
                    className='flex h-14 w-14 items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-110'
                    style={style.container}
                  >
                    <div
                      className='h-8 w-8'
                      style={style.foreground}
                      role="img"
                      aria-label={icon.name}
                    />
                  </div>
                ) : (
                  <div className='flex h-14 w-14 items-center justify-center transition-all duration-300 group-hover:scale-110'>
                    <div
                      className='h-8 w-8 bg-primary/70 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary'
                      style={style.foreground}
                      role="img"
                      aria-label={icon.name}
                    />
                  </div>
                )}

                {/* App Name */}
                <span className='text-center text-sm font-medium text-foreground transition-colors group-hover:text-primary'>
                  {icon.name}
                </span>
              </a>
            )
          })}
        </div>
      )}

      {/* Development Apps Section */}
      {development.length > 0 && (
        <div>
          <div className='mb-6 flex items-center gap-3'>
            <div className='h-px flex-1 bg-border' />
            <h2 className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              <Trans>Development</Trans>
            </h2>
            <div className='h-px flex-1 bg-border' />
          </div>

          <div className='grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'>
            {development.map((icon) => {
              const style = iconStyle(icon, data?.icon_mask, data?.icon_background)
              const highlight = icon.highlight
              return (
                <a
                  key={icon.path}
                  href={`/${icon.link}/`}
                  className={`group relative flex flex-col items-center gap-2 rounded-xl border bg-card/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-hover ${
                    highlight
                      ? 'border-primary hover:border-primary'
                      : 'border-dashed border-border hover:border-primary/30'
                  }`}
                  style={{ boxShadow: 'var(--shadow-xs)' }}
                >
                  {highlight && (
                    <span
                      className='absolute -top-1 -right-1 flex h-3 w-3'
                      aria-hidden='true'
                    >
                      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75' />
                      <span className='relative inline-flex h-3 w-3 rounded-full bg-primary' />
                    </span>
                  )}
                  {/* Icon Container */}
                  {style.className === 'adaptive' ? (
                    <div
                      className='flex h-14 w-14 items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105'
                      style={style.container}
                    >
                      <div
                        className='h-8 w-8'
                        style={style.foreground}
                        role="img"
                        aria-label={icon.name}
                      />
                    </div>
                  ) : (
                    <div className='flex h-14 w-14 items-center justify-center transition-all duration-300 group-hover:scale-105'>
                      <div
                        className='h-8 w-8 bg-primary/70 transition-all duration-300 group-hover:bg-primary'
                        style={style.foreground}
                        role="img"
                        aria-label={icon.name}
                      />
                    </div>
                  )}

                  {/* App Info */}
                  <div className='flex flex-col items-center gap-0.5'>
                    <span className='text-center text-xs font-medium text-foreground transition-colors group-hover:text-primary'>
                      {icon.name}
                    </span>
                    <span className='text-center text-[10px] text-muted-foreground'>
                      {icon.id}
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </Main>
  )
}
