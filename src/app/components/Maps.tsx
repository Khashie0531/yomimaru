import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet'

// Leaflet icon fix (Vite / React 必須)
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// 日本住所 正規化
function normalizeJapaneseAddress(input: string) {
  let normalized = input
    .replace(/[０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    )
    .replace(/－|ー|−/g, '-')
    .trim()

  // パターン1: "南千住6-8-11" → "南千住6丁目8番11"
  normalized = normalized.replace(/(.+?)(\d+)-(\d+)-(\d+)/, '$1$2丁目$3番$4')

  // パターン2: "南千住 6 8 11" の形式にも対応
  // スペースを削除して統一する
  normalized = normalized.replace(/\s+/g, '')

  return normalized
}

// マップ移動用
function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap()
  map.setView(center, 16)
  return null
}

export function Maps({ sidebarOpen = true, onToggleSidebar }: { sidebarOpen?: boolean; onToggleSidebar?: () => void }) {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')
  const [position, setPosition] = useState<[number, number]>([
    35.7334, 139.7996, // 南千住
  ])
  const [label, setLabel] = useState('')
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return

    const normalized = normalizeJapaneseAddress(query)

    // 複数の検索パターンを試す
    const searchQueries = [
      normalized, // オリジナル
      `東京都 ${normalized}`, // 東京を追加
      `東京 ${normalized}`, // 東京を追加（短形）
    ]

    for (const searchQuery of searchQueries) {
      const url =
        `https://nominatim.openstreetmap.org/search` +
        `?q=${encodeURIComponent(searchQuery)}` +
        `&format=json&limit=1&accept-language=ja`

      try {
        const res = await fetch(url, {
          headers: {
            'Accept-Language': 'ja',
            'Referer': 'http://localhost:5173/',
          },
        })

        const data = await res.json()

        if (data && data.length > 0) {
          setPosition([parseFloat(data[0].lat), parseFloat(data[0].lon)])
          setLabel(data[0].display_name)
          setError('')
          return
        }
      } catch (err) {
        console.error('Search error:', err)
      }
    }

    // すべての検索パターンが失敗
    setError(t('maps.notFound'))
  }

  return (
    <div className="w-full h-[calc(100vh-64px)] relative">
      {/* 検索バー */}
      <div className={`absolute ${sidebarOpen ? 'z-40' : 'z-60'} top-4 md:top-20 bg-[var(--theme-card-bg)] shadow-lg rounded-xl p-3 sm:p-5 flex gap-2 sm:gap-4 transition-all duration-300 -translate-x-1/2 left-1/2 w-[calc(100%-2rem)] sm:w-[90%] max-w-2xl ${sidebarOpen ? 'md:left-[calc(50%+9rem)]' : ''}`}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('maps.placeholder')}
          className="flex-1 border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
        />
        <button
          onClick={handleSearch}
          className="bg-[var(--theme-primary)] text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg hover:opacity-90 font-medium whitespace-nowrap text-sm sm:text-base"
        >
          {t('maps.search')}
        </button>
      </div>
      {error && (
        <div className={`absolute ${sidebarOpen ? 'z-40' : 'z-60'} top-16 md:top-40 left-1/2 -translate-x-1/2 bg-red-100 text-red-800 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-red-200 shadow-md text-sm sm:text-base ${sidebarOpen ? 'md:left-[calc(50%+9rem)]' : ''}`}>
          {error}
        </div>
      )}

      {/* マップ */}
      <MapContainer
        center={position}
        zoom={16}
        className="w-full h-full z-30"
        zoomControl={false}
      >
        <ChangeView center={position} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>{label || t('maps.searchLocation')}</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
