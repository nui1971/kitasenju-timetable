import { describe, it, expect } from 'vitest'
import { WEEKDAY, HOLIDAY } from '../timetable'

const TIME_PATTERN = /^\d{2}:\d{2}$/

describe('WEEKDAY', () => {
    it('265件あること', () => {
        expect(WEEKDAY).toHaveLength(265)
    })

    it('全timeが HH:MM 形式であること', () => {
        WEEKDAY.forEach(t => {
            expect(t.time).toMatch(TIME_PATTERN)
        })
    })

    it('北綾瀬行きが62件あること', () => {
        const count = WEEKDAY.filter(t => t.dest === '北綾瀬').length
        expect(count).toBe(62)
    })

    it('origin:true が2件（04:54・00:48）であること', () => {
        const origins = WEEKDAY.filter(t => t.origin)
        expect(origins).toHaveLength(2)
        expect(origins[0].time).toBe('04:54')
        expect(origins[1].time).toBe('00:48')
    })

    it('全destが空文字でないこと', () => {
        WEEKDAY.forEach(t => {
            expect(t.dest).not.toBe('')
        })
    })
})

describe('HOLIDAY', () => {
    it('201件あること', () => {
        expect(HOLIDAY).toHaveLength(201)
    })

    it('全timeが HH:MM 形式であること', () => {
        HOLIDAY.forEach(t => {
            expect(t.time).toMatch(TIME_PATTERN)
        })
    })

    it('北綾瀬行きが54件あること', () => {
        const count = HOLIDAY.filter(t => t.dest === '北綾瀬').length
        expect(count).toBe(54)
    })

    it('origin:true が2件（04:54・00:48）であること', () => {
        const origins = HOLIDAY.filter(t => t.origin)
        expect(origins).toHaveLength(2)
        expect(origins[0].time).toBe('04:54')
        expect(origins[1].time).toBe('00:48')
    })

    it('全destが空文字でないこと', () => {
        HOLIDAY.forEach(t => {
            expect(t.dest).not.toBe('')
        })
    })
})
