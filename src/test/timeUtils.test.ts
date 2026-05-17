import { describe, it, expect } from 'vitest'
import { timeToMin, nowToMin, shortDest, isKitaAyase } from '../utils/timeUtils'

describe('timeToMin', () => {
    it('"07:30" → 450', () => {
        expect(timeToMin('07:30')).toBe(450)
    })

    it('"00:06" → 1446（24*60+6）', () => {
        expect(timeToMin('00:06')).toBe(1446)
    })

    it('"04:54" → 294', () => {
        expect(timeToMin('04:54')).toBe(294)
    })
})

describe('nowToMin', () => {
    it('nowToMin(7, 30) → 450', () => {
        expect(nowToMin(7, 30)).toBe(450)
    })

    it('nowToMin(0, 6) → 1446', () => {
        expect(nowToMin(0, 6)).toBe(1446)
    })

    it('nowToMin(3, 59) → 1679（27*60+59）', () => {
        expect(nowToMin(3, 59)).toBe(1679)
    })

    it('nowToMin(4, 0) → 240', () => {
        expect(nowToMin(4, 0)).toBe(240)
    })
})

describe('shortDest', () => {
    it('"我孫子（千葉県）" → "我孫子"', () => {
        expect(shortDest('我孫子（千葉県）')).toBe('我孫子')
    })

    it('"取手" → "取手"（変化なし）', () => {
        expect(shortDest('取手')).toBe('取手')
    })
})

describe('isKitaAyase', () => {
    it('"北綾瀬" → true', () => {
        expect(isKitaAyase('北綾瀬')).toBe(true)
    })

    it('"綾瀬" → false', () => {
        expect(isKitaAyase('綾瀬')).toBe(false)
    })
})
