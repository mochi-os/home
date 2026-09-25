// Copyright © 2026 Mochisoft OÜ
// SPDX-License-Identifier: AGPL-3.0-only
// This file is part of Mochi, licensed under the GNU AGPL v3 with the
// Mochi Application Interface Exception - see license.txt and license-exception.md.
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Shortcut } from './index'

const chat = {
  id: 'chat',
  path: 'chat',
  name: 'Chat',
  file: 'images/icon.svg',
  link: 'chat',
}

afterEach(cleanup)

describe('Shortcut', () => {
  it('names its link by the app name once', () => {
    render(<Shortcut icon={chat} />)
    expect(screen.getByRole('link', { name: 'Chat' })).toBeTruthy()
  })

  it('names its link once when the theme draws the icon on a tile', () => {
    render(<Shortcut icon={chat} mask='rounded' background='#3366cc' />)
    expect(screen.getByRole('link', { name: 'Chat' })).toBeTruthy()
  })
})
