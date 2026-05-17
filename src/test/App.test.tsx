import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
    it('ヘッダーに「北千住」が表示される', () => {
        render(<App />)
        expect(screen.getByText('北千住')).toBeInTheDocument()
    })

    it('ヘッダーに「下り」が表示される', () => {
        render(<App />)
        expect(screen.getByText('下り')).toBeInTheDocument()
    })

    it('曜日種別（平日または土・休日）バッジが表示される', () => {
        render(<App />)
        const hasWeekday = screen.queryAllByText('平日').length > 0
        const hasHoliday = screen.queryAllByText('土・休日').length > 0
        expect(hasWeekday || hasHoliday).toBe(true)
    })

    it('「北綾瀬行きのみ」チェックボックスが表示される', () => {
        render(<App />)
        expect(screen.getByText('北綾瀬行きのみ')).toBeInTheDocument()
    })

    it('フッターに出典情報が表示される', () => {
        render(<App />)
        expect(screen.getByText(/データ出典：東京メトロ/)).toBeInTheDocument()
    })
})
