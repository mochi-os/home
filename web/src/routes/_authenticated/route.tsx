import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout, useAuthStore } from '@mochi/web'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const store = useAuthStore.getState()
    if (!store.isInitialized) {
      await store.initialize()
    }
  },
  component: () => (
    <AuthenticatedLayout
      mobileTitle={
        <span className='min-w-0 whitespace-nowrap bg-gradient-to-br from-foreground to-muted-foreground/30 bg-clip-text text-[32px] font-light tracking-[3px] text-transparent'>
          mochi
        </span>
      }
    />
  ),
})
