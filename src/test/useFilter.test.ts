import { describe, it, expect } from 'vitest'
import { filterKitaAyase } from '../hooks/useFilter'
import type { Train } from '../data/timetable'

const makeTrain = (destination: string): Train => ({
    hour: 10, minute: 0, destination, trainType: '普通',
})

const trains: Train[] = [
    makeTrain('北綾瀬'),
    makeTrain('綾瀬'),
    makeTrain('北綾瀬'),
    makeTrain('取手'),
    makeTrain('我孫子（千葉県）'),
]

describe('filterKitaAyase', () => {
    it('北綾瀬行きのみ返す', () => {
        const result = filterKitaAyase(trains)
        expect(result).toHaveLength(2)
        expect(result.every(t => t.destination === '北綾瀬')).toBe(true)
    })

    it('北綾瀬がない場合は空配列を返す', () => {
        const result = filterKitaAyase([makeTrain('綾瀬'), makeTrain('取手')])
        expect(result).toHaveLength(0)
    })

    it('空配列の場合は空配列を返す', () => {
        expect(filterKitaAyase([])).toHaveLength(0)
    })

    it('全列車が北綾瀬の場合は全件返す', () => {
        const result = filterKitaAyase([makeTrain('北綾瀬'), makeTrain('北綾瀬')])
        expect(result).toHaveLength(2)
    })

    it('我孫子（千葉県）は北綾瀬ではないので除外される', () => {
        const result = filterKitaAyase(trains)
        expect(result.every(t => t.destination !== '我孫子（千葉県）')).toBe(true)
    })
})
