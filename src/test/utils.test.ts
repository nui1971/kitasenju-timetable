import { describe, it, expect } from 'vitest'
import { shortDest } from '../utils'

describe('shortDest', () => {
    it('「（千葉県）」を除去する', () => {
        expect(shortDest('我孫子（千葉県）')).toBe('我孫子')
    })

    it('括弧がない行き先はそのまま返す', () => {
        expect(shortDest('北綾瀬')).toBe('北綾瀬')
        expect(shortDest('綾瀬')).toBe('綾瀬')
        expect(shortDest('取手')).toBe('取手')
        expect(shortDest('松戸')).toBe('松戸')
    })

    it('空文字の場合は空文字を返す', () => {
        expect(shortDest('')).toBe('')
    })
})
