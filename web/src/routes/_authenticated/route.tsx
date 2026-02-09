import { createFileRoute } from '@tanstack/react-router'
import { AuthenticatedLayout, useAuthStore, getCookie } from '@mochi/common'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const store = useAuthStore.getState()

    if (!store.isInitialized) {
      store.initialize()
    } else {
      // double-check cookie hasn't changed
      const cookieToken = getCookie('token')
      if (cookieToken && cookieToken !== store.token) {
        store.initialize()
      }
    }

    const token = getCookie('token') || store.token

    if (!token) {
      const returnUrl = encodeURIComponent(location.href)
      const redirectUrl = `${import.meta.env.VITE_AUTH_LOGIN_URL}?redirect=${returnUrl}`

      window.location.href = redirectUrl

      return
    }
  },
  component: () => (
    <AuthenticatedLayout
      mobileTitle={
        <span
          className="text-[20px] font-light tracking-[2px] text-[#4A4A4A]"
          style={{ fontFamily: 'Nunito, system-ui, -apple-system, sans-serif' }}
        >
          mochi
        </span>
      }
    />
  ),
})
