// Copyright © 2026 Mochisoft OÜ
// SPDX-License-Identifier: AGPL-3.0-only
// This file is part of Mochi, licensed under the GNU AGPL v3 with the
// Mochi Application Interface Exception - see license.txt and license-exception.md.
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Grid, Shortcut } from './index'

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

describe('Shortcut label', () => {
  it('wraps a long name over up to three lines rather than cutting it short', () => {
    const name = 'Pubblikatur tal-Applikazzjonijiet'
    render(<Shortcut icon={{ ...chat, name }} />)
    const label = screen.getByText(name)
    expect(label.className).toContain('line-clamp-3')
    expect(label.className).toContain('hyphens-auto')
    expect(label.className).not.toContain('truncate')
    expect(label.getAttribute('title')).toBe(name)
  })
})

describe('Grid', () => {
  // jsdom lays nothing out and draws no text, so give each name a width on one
  // line (data-width, else 300px), 60px once it wraps inside its cell, and
  // each word 10px a letter. The room around the grid is `room` wide.
  let room = 0

  beforeEach(() => {
    room = 0
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      }
    )
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get(this: HTMLElement) {
        if (this.style.whiteSpace !== 'nowrap') return 60
        return Number(this.dataset.width ?? 300)
      },
    })
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => room,
    })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
      () =>
        ({
          font: '',
          measureText: (text: string) => ({ width: text.length * 10 }),
        }) as unknown as CanvasRenderingContext2D
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
    delete (HTMLElement.prototype as { scrollWidth?: number }).scrollWidth
    delete (HTMLElement.prototype as { clientWidth?: number }).clientWidth
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1024,
    })
  })

  // The cell width the grid settles on for these names, each [text, width on
  // one line], in a window `viewport` wide.
  function cell(names: [string, number][], viewport = 1024) {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: viewport,
    })
    render(
      <div style={{ padding: 0 }}>
        <Grid count={names.length}>
          {names.map(([text, width]) => (
            <span key={text} data-name data-width={width}>
              {text}
            </span>
          ))}
        </Grid>
      </div>
    )
    const grid = document.querySelector('[data-name]')?.parentElement
    return parseFloat(grid?.style.getPropertyValue('--cell') ?? '')
  }

  it('sizes cells by each name on one line, not by how it wraps', () => {
    // 300px plus half a rem, held to the 12rem a cell may grow to.
    expect(cell([['Long', 300]])).toBe(192)
  })

  it('leaves a name its own wrap setting once measured', () => {
    cell([['Long', 300]])
    expect(screen.getByText('Long').style.whiteSpace).toBe('')
  })

  it('keeps short names on a phone at the smallest cell', () => {
    room = 343
    expect(
      cell(
        [
          ['Chat', 40],
          ['Feeds', 50],
        ],
        390
      )
    ).toBe(80)
  })

  it('grows a cell to hold its longest word, up to a third of a phone row', () => {
    room = 343
    // 'Applikazzjonijiet' is 170px: wider than a quarter of the row, so the
    // cells take a third each rather than split the word.
    expect(cell([['Pubblikatur tal-Applikazzjonijiet', 330]], 390)).toBeCloseTo(
      343 / 3
    )
  })

  it('shares the room a phone row leaves among cells whose names wrap', () => {
    room = 310
    // A quarter of 310px is under the 80px minimum, so three cells fit and
    // the 70px over goes to the cells rather than to the margin.
    expect(cell([['Trình phát hành ứng dụng', 240]], 390)).toBeCloseTo(310 / 3)
  })
})
