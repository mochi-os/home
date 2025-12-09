import { createFileRoute } from '@tanstack/react-router'
import { SimpleLayout } from '@/components/layout/simple-layout'
import { useAuthStore } from '@/stores/auth-store'
import { getCookie } from '@/lib/cookies'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const store = useAuthStore.getState()

    if (!store.isInitialized) {
      store.syncFromCookie()
    } else {
      // double-check cookie hasn't changed
      const cookieToken = getCookie('token')
      if (cookieToken && cookieToken !== store.token) {
        store.syncFromCookie()
      }
    }

    const token = getCookie('token') || store.token

    if (!token) {
      const returnUrl = encodeURIComponent(location.href)
      const redirectUrl = `${import.meta.env.VITE_AUTH_LOGIN_URL}?redirect=${returnUrl}`

      window.location.href = redirectUrl

      return
    }
    if (!store.isInitialized) {
      store.syncFromCookie()
    }

    return
  },
  component: SimpleLayout,
})
