import { useState, useEffect } from 'react'
import type { Train } from '../data/timetable'

const STORAGE_KEY = 'kitasenju-filter-kitaayase'

// 北綾瀬行きのみ抽出（純粋関数・テスト対象）
export const filterKitaAyase = (trains: Train[]): Train[] =>
    trains.filter(t => t.destination === '北綾瀬')

export const useFilter = (upcomingTrains: Train[]) => {
    const [showOnlyKitaAyase, setShowOnlyKitaAyase] = useState<boolean>(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'true'
        } catch {
            return false
        }
    })

    const toggleKitaAyase = () => setShowOnlyKitaAyase(prev => !prev)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(showOnlyKitaAyase))
    }, [showOnlyKitaAyase])

    const filteredTrains = showOnlyKitaAyase ? filterKitaAyase(upcomingTrains) : upcomingTrains

    return { showOnlyKitaAyase, toggleKitaAyase, filteredTrains }
}
