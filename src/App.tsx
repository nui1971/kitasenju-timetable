import { useState, useEffect, useCallback } from 'react'
import { WEEKDAY, HOLIDAY } from './timetable'
import type { Train } from './timetable'
import { timeToMin, nowToMin, shortDest, isKitaAyase } from './utils/timeUtils'

const FILTER_KEY = 'kitasenju_filter_kitaayase'
const PAST_SHOW = 3

interface NowJST {
    hour: number
    minute: number
    isHoliday: boolean
    display: string
}

function getNowJST(): NowJST {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))
    const hour = now.getHours()
    const minute = now.getMinutes()
    const day = now.getDay()
    const isHoliday = day === 0 || day === 6
    const hh = String(hour).padStart(2, '0')
    const mm = String(minute).padStart(2, '0')
    return { hour, minute, isHoliday, display: `${hh}:${mm}` }
}

export default function App() {
    const [now, setNow] = useState<NowJST>(getNowJST)
    const [filterKitaAyase, setFilterKitaAyase] = useState<boolean>(() => {
        return localStorage.getItem(FILTER_KEY) === 'true'
    })

    useEffect(() => {
        const id = setInterval(() => setNow(getNowJST()), 10000)
        return () => clearInterval(id)
    }, [])

    const toggleFilter = useCallback(() => {
        setFilterKitaAyase(prev => {
            const next = !prev
            localStorage.setItem(FILTER_KEY, String(next))
            return next
        })
    }, [])

    const trains: Train[] = now.isHoliday ? HOLIDAY : WEEKDAY
    const nowMin = nowToMin(now.hour, now.minute)

    const filteredTrains = filterKitaAyase
        ? trains.filter(t => isKitaAyase(t.dest))
        : trains

    const pastIdx: number[] = []
    const futureIdx: number[] = []
    filteredTrains.forEach((t, i) => {
        if (timeToMin(t.time) < nowMin) pastIdx.push(i)
        else futureIdx.push(i)
    })

    const visiblePast = pastIdx.slice(-PAST_SHOW)
    const visibleIdxSet = new Set([...visiblePast, ...futureIdx])

    const nextTrain = filteredTrains[futureIdx[0]] ?? null
    const nextMin = nextTrain ? timeToMin(nextTrain.time) - nowMin : null

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#0d1526' }}>
            {/* ヘッダー */}
            <div className="sticky top-0 z-10" style={{ backgroundColor: '#0d1526' }}>
                {/* 路線・駅名行 */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                    <span
                        className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: '#00843d', color: 'white' }}
                    >
                        千代田線
                    </span>
                    <span className="font-bold text-lg text-white">北千住</span>
                    <span className="text-xs text-gray-400">Kita-Senju</span>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 3v14M4 11l6 6 6-6" stroke="#00843d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm font-bold" style={{ color: '#00843d' }}>下り</span>
                </div>

                {/* 現在時刻・バッジ・フィルター行 */}
                <div className="flex items-center gap-2 px-4 py-1">
                    <span className="font-mono text-2xl font-bold" style={{ color: '#00843d' }}>
                        {now.display}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${now.isHoliday ? 'bg-blue-700 text-white' : 'bg-gray-600 text-white'}`}>
                        {now.isHoliday ? '土休日' : '平日'}
                    </span>
                    <button
                        onClick={toggleFilter}
                        className={`ml-auto text-xs px-3 py-1 rounded-full border font-bold transition-colors ${
                            filterKitaAyase
                                ? 'border-green-500 text-green-400 bg-green-950'
                                : 'border-gray-500 text-gray-400 bg-transparent'
                        }`}
                    >
                        北綾瀬行きのみ
                    </button>
                </div>

                {/* 次の電車バナー */}
                {nextTrain && (
                    <div
                        className="mx-4 mb-2 px-4 py-2 rounded-lg flex items-center gap-3"
                        style={{ backgroundColor: '#0a3020' }}
                    >
                        <span className="text-xs text-green-400 font-bold">次の電車</span>
                        <span className="font-mono text-white font-bold">{nextTrain.time}</span>
                        <span className="text-white font-bold">{shortDest(nextTrain.dest)}行き</span>
                        {nextTrain.origin && (
                            <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-yellow-600 text-white">始発</span>
                        )}
                        <span className="ml-auto text-green-400 font-mono font-bold text-sm">
                            あと{nextMin}分
                        </span>
                    </div>
                )}

                <div className="border-b" style={{ borderColor: '#1a2640' }} />
            </div>

            {/* 列車リスト */}
            <div>
                {filteredTrains.map((train, i) => {
                    if (!visibleIdxSet.has(i)) return null
                    const isPast = pastIdx.includes(i)
                    const isNext = futureIdx[0] === i

                    return (
                        <div
                            key={i}
                            className={`flex items-center gap-3 px-4 py-3 border-b ${isPast ? 'opacity-35' : ''}`}
                            style={{
                                borderColor: '#1a2640',
                                backgroundColor: isNext ? '#0a3020' : 'transparent',
                            }}
                        >
                            {/* 時刻 */}
                            <span className="font-mono font-bold text-lg w-14 text-white">
                                {train.time}
                            </span>

                            {/* 行き先バッジ */}
                            <span
                                className="text-xs px-2 py-0.5 rounded font-bold"
                                style={{
                                    backgroundColor: isKitaAyase(train.dest) ? '#00843d' : '#374151',
                                    color: 'white',
                                }}
                            >
                                {shortDest(train.dest)}
                            </span>

                            {/* 始発ラベル */}
                            {train.origin && (
                                <span className="text-xs px-1.5 py-0.5 rounded font-bold bg-yellow-600 text-white">
                                    始発
                                </span>
                            )}

                            {/* 各駅停車（右寄せ） */}
                            <span className="ml-auto text-xs text-gray-500">各駅停車</span>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
