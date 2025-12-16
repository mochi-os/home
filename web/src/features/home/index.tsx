import { useQuery } from '@tanstack/react-query'
import { requestHelpers } from '@mochi/common'

interface AppIcon {
  path: string
  name: string
  file: string
}

export function Home() {
  const { data: icons } = useQuery({
    queryKey: ['app-icons'],
    queryFn: () => requestHelpers.get<AppIcon[]>('/icons'),
  })

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


