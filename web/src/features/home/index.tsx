import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { requestHelpers } from '@mochi/common'

interface AppIcon {
  path: string
  name: string
  file: string
}

export function Home() {
  const { data: icons, isLoading } = useQuery({
    queryKey: ['app-icons'],
    queryFn: () => requestHelpers.get<AppIcon[]>('/icons'),
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
      <div className='grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8'>
        {icons?.map((icon) => (
          <a
            key={icon.path}
            href={`/${icon.path}/`}
            className='flex flex-col items-center rounded-lg p-2 transition-colors hover:bg-highlight'
          >
            <img
              src={`/${icon.path}/${icon.file}`}
              alt={icon.name}
              className='h-10 w-10'
            />
            <span className='mt-2 text-center text-sm font-medium'>{icon.name}</span>
          </a>
        ))}
      </div>
    </main>
  )
}
