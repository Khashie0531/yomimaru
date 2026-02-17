import { Cloud, CloudRain, Sun, Wind, Droplets, Eye, Sunrise, Sunset, CloudSnow, CloudDrizzle, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

export function Weather() {
  const { t } = useTranslation()
  const [currentWeather, setCurrentWeather] = useState<any>(null)
  const [forecast, setForecast] = useState<any[]>([])
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [location, setLocation] = useState<{lat: number, lon: number, name: string} | null>(null)

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude

            // 位置情報から場所名を取得
            try {
              const locationResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=Asia/Tokyo`
              )
              const locationData = await locationResponse.json()

              // 逆ジオコーディングで場所名を取得（OpenStreetMap Nominatim）
              const reverseGeoResponse = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&accept-language=ja`
              )
              const reverseGeoData = await reverseGeoResponse.json()

              const locationName = reverseGeoData.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`
              setLocation({ lat, lon, name: locationName })

              // 天気データを取得
              await fetchWeather(lat, lon)
            } catch (err) {
              console.error('Location fetch error:', err)
              // 位置情報取得失敗時は東京のデフォルトを使用
              setLocation({ lat: 35.6762, lon: 139.6503, name: '東京' })
              await fetchWeather(35.6762, 139.6503)
            }
          },
          (error) => {
            console.error('Geolocation error:', error)
            // 位置情報取得失敗時は東京のデフォルトを使用
            setLocation({ lat: 35.6762, lon: 139.6503, name: '東京' })
            fetchWeather(35.6762, 139.6503)
          }
        )
      } else {
        // Geolocation非対応の場合は東京を使用
        setLocation({ lat: 35.6762, lon: 139.6503, name: '東京' })
        fetchWeather(35.6762, 139.6503)
      }
    }

    const fetchWeather = async (lat: number, lon: number) => {
      try {
        // Open-Meteo APIを使用（無料、認証不要、高品質）
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=Asia/Tokyo`
        )

        if (!response.ok) throw new Error('Failed to fetch weather data')

        const data = await response.json()
        const current = data.current
        const daily = data.daily
        const hourly = data.hourly

        // 現在の天気を設定
        setCurrentWeather({
          temp: Math.round(current.temperature_2m),
          condition: getWeatherCondition(current.weather_code),
          feels_like: Math.round(current.temperature_2m - 2),
          humidity: current.relative_humidity_2m,
          wind_speed: Math.round(current.wind_speed_10m),
          visibility: 10,
          sunrise: new Date(daily.sunrise[0]).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
          sunset: new Date(daily.sunset[0]).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
          weather_code: current.weather_code,
        })

        // 7日間の予報を設定
        const days = ['日', '月', '火', '水', '木', '金', '土']
        const forecastData = daily.time.map((date: string, index: number) => {
          const dateObj = new Date(date)
          return {
            day: days[dateObj.getDay()],
            high: Math.round(daily.temperature_2m_max[index]),
            low: Math.round(daily.temperature_2m_min[index]),
            condition: getWeatherCondition(daily.weather_code[index]),
            icon: getWeatherIcon(daily.weather_code[index]),
            weather_code: daily.weather_code[index],
          }
        })
        setForecast(forecastData)

        // 時間ごとの予報を設定（次の24時間）
        const hourlyData = hourly.time.slice(0, 24).map((time: string, index: number) => ({
          time: new Date(time).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
          temp: Math.round(hourly.temperature_2m[index]),
          condition: getWeatherCondition(hourly.weather_code[index]),
          weather_code: hourly.weather_code[index],
        }))
        setHourlyForecast(hourlyData)

        setLoading(false)
      } catch (err) {
        console.error('Weather fetch error:', err)
        setError(t('weather.failedToLoad') || '天気データの取得に失敗しました')
        setLoading(false)
      }
    }

    getLocation()
  }, [])

  const getWeatherCondition = (code: number): string => {
    const conditions: { [key: number]: string } = {
      0: '快晴',
      1: '晴れ',
      2: '一部曇り',
      3: '曇り',
      45: '霧',
      48: '霧',
      51: '小雨',
      53: '雨',
      55: '大雨',
      61: '小雨',
      63: '雨',
      65: '大雨',
      71: '小雪',
      73: '雪',
      75: '大雪',
      77: '雪',
      80: 'にわか雨',
      81: 'にわか雨',
      82: '激しいにわか雨',
      85: 'にわか雪',
      86: '激しいにわか雪',
      95: '雷雨',
    }
    return conditions[code] || '不明'
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return Sun
    if (code === 2 || code === 3) return Cloud
    if (code >= 45 && code <= 48) return Cloud
    if (code >= 51 && code <= 55) return CloudDrizzle
    if (code >= 61 && code <= 82) return CloudRain
    if (code >= 71 && code <= 86) return CloudSnow
    if (code >= 80 && code <= 82) return CloudRain
    if (code >= 85 && code <= 86) return CloudSnow
    if (code >= 95) return CloudRain
    return Cloud
  }

  if (loading) {
    return (
    <div className="max-w-none md:max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg animate-pulse">
            <MapPin className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--theme-primary)] to-[var(--theme-bg-to)] bg-clip-text text-transparent">
              {t('weather.title')}
            </h2>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-[var(--theme-primary)] rounded-full animate-pulse"></span>
              位置情報を取得中...
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 shadow-xl border border-blue-100 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">{t('weather.loading') || '位置情報と天気データを取得中...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-none md:max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl shadow-lg">
            <MapPin className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              {t('weather.title')}
            </h2>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-[var(--theme-error)] rounded-full"></span>
              エラー発生
            </p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-[var(--theme-error-light)] to-[var(--theme-error-light)] rounded-2xl p-12 shadow-xl border border-[var(--theme-error-light)] text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-[var(--theme-error)] font-medium text-lg">{error}</p>
        </div>
      </div>
    )
  }

  if (!currentWeather || !location) return null

  const IconComponent = getWeatherIcon(currentWeather.weather_code)

  return (
    <div className="max-w-none md:max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gradient-to-br from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] rounded-xl shadow-lg">
          <MapPin className="size-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)] bg-clip-text text-transparent">
            {t('weather.title')}
          </h2>
          <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[var(--theme-success)] rounded-full animate-pulse"></span>
            {location.name}
          </p>
        </div>
      </div>

      {/* Current Weather */}
      <div className="relative bg-gradient-to-br from-[var(--theme-gradient-from)] via-[var(--theme-gradient-to)] to-[var(--theme-gradient-to)] text-white rounded-2xl p-6 md:p-8 mb-8 shadow-2xl overflow-hidden pointer-events-none">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

        <div className="relative flex flex-col md:flex-row items-start justify-between pointer-events-auto">
          <div className="flex-1 mb-6 md:mb-0">
            <p className="text-sm text-blue-100 mb-3 font-medium">{t('weather.currentWeather')}</p>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-6xl md:text-7xl font-bold">{currentWeather.temp}°</span>
              <span className="text-2xl md:text-3xl mb-2 opacity-80">C</span>
            </div>
            <p className="text-xl md:text-2xl mb-2 font-semibold">{currentWeather.condition}</p>
            <p className="text-sm text-blue-100 opacity-90">{t('weather.feelsLike')} {currentWeather.feels_like}°C</p>
          </div>
          <div className="flex-shrink-0 self-center md:self-start">
            <IconComponent className="size-20 md:size-28 text-white/90 drop-shadow-lg" />
          </div>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/20">
          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="p-2 bg-white/20 rounded-lg">
              <Droplets className="size-5 text-blue-100" />
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">{t('weather.humidity')}</p>
              <p className="text-lg font-bold">{currentWeather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="p-2 bg-white/20 rounded-lg">
              <Wind className="size-5 text-blue-100" />
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">{t('weather.wind')}</p>
              <p className="text-lg font-bold">{currentWeather.wind_speed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="p-2 bg-white/20 rounded-lg">
              <Eye className="size-5 text-blue-100" />
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">{t('weather.visibility')}</p>
              <p className="text-lg font-bold">{currentWeather.visibility} km</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sunrise className="size-5 text-blue-100" />
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">{t('weather.sunrise')}</p>
              <p className="text-lg font-bold">{currentWeather.sunrise}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Alert */}
      <div className="bg-gradient-to-r from-[var(--theme-warning)] to-[var(--theme-warning)] text-white rounded-2xl p-6 mb-8 shadow-xl border border-[var(--theme-warning-light)]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <CloudRain className="size-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">{t('weather.deliveryAlert')}</h3>
            <p className="text-sm opacity-90">
              {t('weather.deliveryAlertDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="bg-[var(--theme-card-bg)] rounded-2xl p-6 md:p-8 shadow-xl border border-[var(--theme-card-border)] mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Sun className="size-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{t('weather.hourlyForecast')}</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {hourlyForecast.map((hour, index) => {
            const HourlyIcon = getWeatherIcon(hour.weather_code)
            return (
              <div
                key={index}
                className="flex-shrink-0 text-center p-4 md:p-6 bg-gradient-to-b from-blue-50 to-indigo-100 rounded-2xl min-w-[120px] md:min-w-[140px] border border-blue-200/50 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <p className="text-sm font-semibold text-gray-700 mb-3">{hour.time}</p>
                <div className="flex justify-center mb-3">
                  <HourlyIcon className="size-10 text-blue-600 drop-shadow-sm" />
                </div>
                <p className="font-bold text-xl mb-1 text-gray-800">{hour.temp}°C</p>
                <p className="text-xs text-gray-600 font-medium">{hour.condition}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-[var(--theme-card-bg)] rounded-2xl p-6 md:p-8 shadow-xl border border-[var(--theme-card-border)]">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
            <Cloud className="size-5 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{t('weather.sevenDayForecast')}</h3>
        </div>
        <div className="space-y-4">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border border-gray-200/50 cursor-pointer"
            >
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 flex-1 mb-4 sm:mb-0">
                <p className="w-12 font-bold text-lg text-gray-700 text-center sm:text-left">{day.day}</p>
                <div className="flex items-center gap-4">
                  <day.icon className="size-8 md:size-9 text-blue-600 drop-shadow-sm" />
                  <p className="text-sm text-gray-600 font-medium min-w-[100px] text-center sm:text-left">{day.condition}</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <span className="text-gray-600 font-semibold text-lg">{day.low}°</span>
                <div className="relative w-32 sm:w-40 h-3 sm:h-4 bg-gradient-to-r from-blue-200 via-green-200 to-orange-300 rounded-full shadow-inner overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-orange-500 rounded-full shadow-sm"
                    style={{
                      width: `${((day.high - day.low) / 20) * 100}%`,
                      marginLeft: `${((day.low + 5) / 30) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-gray-800 font-bold text-xl">{day.high}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
