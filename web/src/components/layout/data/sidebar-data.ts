import {
  LayoutDashboard,
  MessagesSquare,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  UserPlus,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Mochi OS',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Home',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Chats',
          url: '/apps/chat',
          icon: MessagesSquare,
        },
        {
          title: 'Friends',
          url: '/apps/friends',
          icon: UserPlus,
        },
      ],
    },
  ],
}
