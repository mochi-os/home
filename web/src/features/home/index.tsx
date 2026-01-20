import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { requestHelpers } from '@mochi/common'

interface AppIcon {
  id: string
  path: string
  name: string
  file: string
}

interface IconsResponse {
  icons: AppIcon[]
  development: AppIcon[]
}

export function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ['app-icons'],
    queryFn: () => requestHelpers.get<IconsResponse>('/icons'),
  })

  if (isLoading) {
    return (
      <main className='flex min-h-[60vh] items-center justify-center'>
        <Loader2 className='size-8 animate-spin text-primary' />
      </main>
    )
  }

  return (
    <main className='mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8'>
      {/* Hero Section */}
      <div className='mb-8 text-center'>
        <h1
          className='bg-gradient-to-br from-foreground to-muted-foreground/30 bg-clip-text text-[36px] font-light tracking-[3px] text-transparent'
          style={{ fontFamily: 'Nunito, system-ui, -apple-system, sans-serif' }}
        >
          mochi
        </h1>
      </div>

      {/* Main Apps Grid */}
      {data?.icons && data.icons.length > 0 && (
        <div className='mb-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
          {data.icons.map((icon) => (
            <a
              key={icon.path}
              href={`/${icon.path}/`}
              className='group relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-hover'
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              {/* Icon Container with Gradient Background */}
              <div className='flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-muted/80 to-secondary/30 transition-all duration-300 group-hover:scale-110 group-hover:from-primary/20 group-hover:to-primary/10 dark:from-muted/20 dark:to-secondary/10'>
                <img
                  src={`/${icon.path}/${icon.file}`}
                  alt={icon.name}
                  className='h-9 w-9 transition-transform duration-300 group-hover:scale-110 dark:invert'
                />
              </div>

              {/* App Name */}
              <span className='text-center text-sm font-medium text-foreground transition-colors group-hover:text-primary'>
                {icon.name}
              </span>
            </a>
          ))}
        </div>
      )}

      {/* Development Apps Section */}
      {data?.development && data.development.length > 0 && (
        <div>
          <div className='mb-6 flex items-center gap-3'>
            <div className='h-px flex-1 bg-border' />
            <h2 className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
              Development
            </h2>
            <div className='h-px flex-1 bg-border' />
          </div>

          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
            {data.development.map((icon) => (
              <a
                key={icon.path}
                href={`/${icon.path}/`}
                className='group relative flex flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-card/50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-hover'
                style={{ boxShadow: 'var(--shadow-xs)' }}
              >
                {/* Icon Container */}
                <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/10 dark:bg-muted/10'>
                  <img
                    src={`/${icon.path}/${icon.file}`}
                    alt={icon.name}
                    className='h-7 w-7 opacity-75 transition-opacity group-hover:opacity-100 dark:invert'
                  />
                </div>

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
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
