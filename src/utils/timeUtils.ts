export function timeToMin(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h < 4 ? (h + 24) * 60 + m : h * 60 + m
}

export function nowToMin(h: number, m: number): number {
    return h < 4 ? (h + 24) * 60 + m : h * 60 + m
}

export function shortDest(dest: string): string {
    return dest.replace('（千葉県）', '')
}

export function isKitaAyase(dest: string): boolean {
    return dest === '北綾瀬'
}
