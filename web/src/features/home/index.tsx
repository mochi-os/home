import { useQuery } from '@tanstack/react-query'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
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
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <NotificationsDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-2xl font-bold tracking-tight'>Welcome to Mochi</h1>
        </div>

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
                className='h-16 w-16'
              />
              <span className='mt-2 text-sm font-medium'>{icon.name}</span>
            </a>
          ))}
        </div>
      </Main>
    </>
  )
}


