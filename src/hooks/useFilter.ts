import { useState, useEffect } from 'react'
import type { Train } from '../data/timetable'

const STORAGE_KEY = 'kitasenju-filter-kitaayase'
const KITA_AYASE = '北綾瀬'

export const extractDestinations = (trains: Train[]): string[] => {
    const set = new Set(trains.map(t => t.destination))
    return Array.from(set).sort()
}

export const filterByDestination = (trains: Train[], hiddenDestinations: Set<string>): Train[] => {
    return trains.filter(t => !hiddenDestinations.has(t.destination))
}

export const useFilter = (allDayTrains: Train[], upcomingTrains: Train[]) => {
    const [showOnlyKitaAyase, setShowOnlyKitaAyase] = useState<boolean>(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'true'
        } catch {
            return false
        }
    })

    const destinations = extractDestinations(allDayTrains)
    const hiddenDestinations = new Set<string>()

    const toggleKitaAyase = () => {
        setShowOnlyKitaAyase(prev => !prev)
    }

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, String(showOnlyKitaAyase))
    }, [showOnlyKitaAyase])

    const filteredTrains = showOnlyKitaAyase
        ? upcomingTrains.filter(t => t.destination === KITA_AYASE)
        : upcomingTrains

    return { destinations, hiddenDestinations, toggleDestination: toggleKitaAyase, showOnlyKitaAyase, toggleKitaAyase, filteredTrains }
}
