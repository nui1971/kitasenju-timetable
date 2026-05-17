import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

// 月曜09:00 をモック
const MOCK_DATE = new Date('2024-01-08T09:00:00+09:00')

beforeEach(() => {
    localStorage.clear()
    vi.useFakeTimers()
    vi.setSystemTime(MOCK_DATE)
})

afterEach(() => {
    vi.useRealTimers()
})

describe('App', () => {
    it('「北千住」が表示される', () => {
        render(<App />)
        expect(screen.getByText('北千住')).toBeInTheDocument()
    })

    it('「下り」が表示される', () => {
        render(<App />)
        expect(screen.getByText('下り')).toBeInTheDocument()
    })

    it('「千代田線」が表示される', () => {
        render(<App />)
        expect(screen.getByText('千代田線')).toBeInTheDocument()
    })

    it('「北綾瀬行きのみ」ボタンが存在する', () => {
        render(<App />)
        expect(screen.getByText('北綾瀬行きのみ')).toBeInTheDocument()
    })

    it('「平日」バッジが表示される', () => {
        render(<App />)
        expect(screen.getByText('平日')).toBeInTheDocument()
    })

    it('フィルターOFF時に北綾瀬以外の行き先も表示される', () => {
        render(<App />)
        // 綾瀬など北綾瀬以外のバッジが存在すること
        const badges = screen.queryAllByText('我孫子')
        expect(badges.length).toBeGreaterThan(0)
    })

    it('フィルターボタンをクリックすると北綾瀬以外の行き先が消える', () => {
        render(<App />)
        const btn = screen.getByText('北綾瀬行きのみ')

        // フィルターOFF時：「我孫子」バッジが表示されている
        expect(screen.queryAllByText('我孫子').length).toBeGreaterThan(0)

        // フィルターON
        fireEvent.click(btn)

        // 「我孫子」バッジが消えること
        expect(screen.queryAllByText('我孫子').length).toBe(0)
    })
})
