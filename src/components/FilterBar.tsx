interface FilterBarProps {
    showOnlyKitaAyase: boolean
    onToggle: () => void
}

export const FilterBar = ({ showOnlyKitaAyase, onToggle }: FilterBarProps) => {
    return (
        <div style={{ margin: '6px 16px 10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    checked={showOnlyKitaAyase}
                    onChange={onToggle}
                    style={{ accentColor: '#006400', width: '15px', height: '15px' }}
                />
                <span style={{ color: '#c8d6e8', fontSize: '13px' }}>北綾瀬行きのみ</span>
            </label>
        </div>
    )
}
