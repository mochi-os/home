// Copyright © 2026 Mochisoft OÜ
// SPDX-License-Identifier: AGPL-3.0-only
// This file is part of Mochi, licensed under the GNU AGPL v3 with the
// Mochi Application Interface Exception - see license.txt and license-exception.md.

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
        <span className='min-w-0 whitespace-nowrap bg-linear-165 from-primary to-primary-light bg-clip-text text-[32px] font-nunito font-semibold tracking-[3px] text-transparent'>
          {/* jsx-text-ok: brand wordmark, verbatim in every locale */}
          mochi
        </span>
      }
    />
  ),
})
