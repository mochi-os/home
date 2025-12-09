import { useQuery } from '@tanstack/react-query'
import { TopBar } from '@/components/layout/top-bar'
import { Search } from '@/components/search'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { requestHelpers } from '@/lib/request'

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
    <>
      <TopBar>
        <Search />
        <h1 className='absolute left-1/2 -translate-x-1/2 text-2xl font-light tracking-tight' style={{ fontFamily: 'Nunito, sans-serif' }}>mochi</h1>
        <div className='ms-auto flex items-center space-x-4'>
          <NotificationsDropdown />
        </div>
      </TopBar>

      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6'>

        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
          {icons?.map((icon) => (
            <a
              key={icon.path}
              href={`/${icon.path}/`}
              className='flex flex-col items-center rounded-lg p-4 transition-colors hover:bg-accent'
            >
              <img
                src={`/${icon.path}/${icon.file}`}
                alt={icon.name}
                className='h-12 w-12'
              />
              <span className='mt-2 text-center text-sm font-medium'>{icon.name}</span>
            </a>
          ))}
        </div>
      </main>
    </>
  )
}


