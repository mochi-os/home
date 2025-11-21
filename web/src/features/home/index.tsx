import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Search } from '@/components/search'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { APP_ROUTES } from '@/config/routes'
import {
  MessagesSquare,
  MessageSquareMore,
  Rss,
  UserPlus,
} from 'lucide-react'

export function Home() {
  const shortcuts = [
    {
      title: 'Chats',
      description: 'Connect and chat with your friends',
      icon: MessagesSquare,
      action: () => {
        window.location.href = import.meta.env.VITE_APP_CHAT_URL
      },
      buttonLabel: 'Open Chats',
    },
    {
      title: 'Friends',
      description: 'Manage your friends and invitations',
      icon: UserPlus,
      action: () => {
        window.location.href = import.meta.env.VITE_APP_FRIENDS_URL
      },
      buttonLabel: 'Open Friends',
    },
    {
      title: 'Feeds',
      description: 'Track updates, posts, and team broadcasts',
      icon: Rss,
      action: () => {
        window.location.href = APP_ROUTES.FEEDS.HOME
      },
      buttonLabel: 'Open Feeds',
    },
    {
      title: 'Forums',
      description: 'Ask questions and share deep-dive threads',
      icon: MessageSquareMore,
      action: () => {
        window.location.href = APP_ROUTES.FORUMS.HOME
      },
      buttonLabel: 'Open Forums',
    },
  ]

  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <NotificationsDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6 flex items-center justify-between space-y-2'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Welcome to Mochi</h1>
            {/* <p className='text-muted-foreground'>
              Your home for all Mochi apps and services
            </p> */}
          </div>
        </div>

        <div className='grid gap-6 md:grid-cols-2 xl:grid-cols-4'>
          {shortcuts.map((shortcut) => (
            <Card
              key={shortcut.title}
              className='group cursor-pointer transition-shadow hover:shadow-md'
            >
              <CardHeader>
                <div className='flex items-center gap-2'>
                  <shortcut.icon className='h-5 w-5 text-primary' />
                  <CardTitle>{shortcut.title}</CardTitle>
                </div>
                <CardDescription>{shortcut.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className='w-full' onClick={shortcut.action}>
                  {shortcut.buttonLabel}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Main>
    </>
  )
}


