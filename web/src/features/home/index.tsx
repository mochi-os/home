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
      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6'>
        <div className='flex justify-center py-12'>
          <Loader2 className='size-6 animate-spin text-muted-foreground' />
        </div>
      </main>
    )
  }

  return (
    <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6'>
      <h1
        className='mb-8 hidden text-center text-[28px] font-light tracking-[3px] text-[#4A4A4A] md:block'
        style={{ fontFamily: 'Nunito, system-ui, -apple-system, sans-serif' }}
      >
        mochi
      </h1>
      <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'>
        {data?.icons?.map((icon) => (
          <a
            key={icon.path}
            href={`/${icon.path}/`}
            className='flex flex-col items-center rounded-lg p-2 transition-colors hover:bg-muted'
          >
            <img
              src={`/${icon.path}/${icon.file}`}
              alt={icon.name}
              className='h-10 w-10'
            />
            <span className='mt-2 text-center text-sm font-medium'>
              {icon.name}
            </span>
          </a>
        ))}
      </div>

      {data?.development && data.development.length > 0 && (
        <>
          {data?.icons && data.icons.length > 0 && (
            <hr className='my-6 border-border' />
          )}
          <h2 className='mb-4 text-lg font-medium text-muted-foreground'>
            Development apps
          </h2>
          <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'>
            {data.development.map((icon) => (
              <a
                key={icon.path}
                href={`/${icon.path}/`}
                className='flex flex-col items-center rounded-lg p-2 transition-colors hover:bg-muted'
              >
                <img
                  src={`/${icon.path}/${icon.file}`}
                  alt={icon.name}
                  className='h-10 w-10'
                />
                <span className='mt-2 text-center text-sm font-medium'>
                  {icon.name}
                </span>
                <span className='text-center text-xs text-muted-foreground'>
                  {icon.id}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
