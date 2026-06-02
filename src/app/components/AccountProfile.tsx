import {
  User,
  Mail,
  Phone,
  IdCard,
  Building,
  Lock,
  ShieldCheck,
  Edit,
  Save,
  LogOut,
  Camera,
} from 'lucide-react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

export function AccountProfile() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profile, setProfile] = useState({
    name: 'Student Profile',
    studentId: 'ST-2025-001',
    email: user?.email || 'student@example.com',
    phone: '090-1234-5678',
    affiliation: 'Yomiuri Scholar / Learning Platform',
    status: 'Active',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setProfileImage(url)
    }
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof typeof profile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
    } catch (err) {
      console.error('Logout failed:', err)
      setIsLoggingOut(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="bg-[var(--theme-card-bg)] rounded-3xl shadow-xl p-8 md:p-12">

        {/* ===== Header / Icon ===== */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--theme-primary)] to-blue-500 flex items-center justify-center shadow-xl ring-4 ring-gray-200 overflow-hidden">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="size-16 text-white" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[var(--theme-primary)] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity shadow-lg">
                <Camera className="size-5 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 ring-2 ring-white" />
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            {isEditing ? (
              <input
                type="text"
                value={profile.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="bg-gray-100 text-gray-900 rounded-lg px-4 py-2 text-center w-full"
              />
            ) : (
              profile.name
            )}
          </h1>

          <p className="mt-2 text-gray-600">
            {profile.affiliation}
          </p>
        </div>

        {/* ===== Personal Information ===== */}
        <section className="mb-8">
          <SectionTitle title={t('accountProfile.personalInfo')} />

          <ProfileItem
            icon={<IdCard className="text-[var(--theme-primary)]" />}
            label={t('accountProfile.studentId')}
            value={profile.studentId}
            isEditing={isEditing}
            onChange={(value) => handleInputChange('studentId', value)}
          />

          <ProfileItem
            icon={<Phone className="text-[var(--theme-primary)]" />}
            label={t('accountProfile.phone')}
            value={profile.phone}
            isEditing={isEditing}
            onChange={(value) => handleInputChange('phone', value)}
          />

          <ProfileItem
            icon={<Building className="text-[var(--theme-primary)]" />}
            label={t('accountProfile.affiliation')}
            value={profile.affiliation}
            isEditing={isEditing}
            onChange={(value) => handleInputChange('affiliation', value)}
          />
        </section>

        {/* ===== Account Information ===== */}
        <section className="mb-8">
          <SectionTitle title={t('accountProfile.account')} />

          <ProfileItem
            icon={<Mail className="text-[var(--theme-primary)]" />}
            label={t('accountProfile.email')}
            value={profile.email}
            isEditing={false}
            onChange={() => {}}
          />

          <ProfileItem
            icon={<Lock className="text-[var(--theme-primary)]" />}
            label={t('accountProfile.password')}
            value="••••••••"
            isEditing={false}
            onChange={() => {}}
          />

          <ProfileItem
            icon={<ShieldCheck className="text-green-500" />}
            label={t('accountProfile.status')}
            value={profile.status}
            isEditing={false}
            onChange={() => {}}
          />
        </section>

        {/* ===== Buttons ===== */}
        <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-gray-200">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Save className="size-5" />
                保存
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 px-6 py-3 rounded-lg transition-colors font-semibold"
              >
                キャンセル
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 bg-[var(--theme-primary)] hover:opacity-90 text-white px-6 py-3 rounded-lg transition-all font-semibold flex items-center justify-center gap-2"
            >
              <Edit className="size-5" />
              編集
            </button>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <LogOut className="size-5" />
            {isLoggingOut ? 'ログアウト中...' : 'ログアウト'}
          </button>
        </div>

      </div>
    </div>
  )
}

/* ===== Section Title ===== */
function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-bold text-gray-900 tracking-widest uppercase mb-4">
      {title}
    </h2>
  )
}

/* ===== Reusable Item ===== */
function ProfileItem({
  icon,
  label,
  value,
  isEditing,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  value: string
  isEditing: boolean
  onChange: (value: string) => void
}) {
  return (
    <div className="mb-4">
      <p className="text-xs font-semibold text-gray-700 mb-2 uppercase">{label}</p>
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3 border border-gray-200">
        <div className="text-gray-600 flex-shrink-0">{icon}</div>
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 bg-white text-gray-900 rounded px-2 py-1 outline-none border border-gray-300 focus:border-[var(--theme-primary)] focus:ring-1 focus:ring-[var(--theme-primary)]"
          />
        ) : (
          <span className="text-gray-900 font-medium">
            {value}
          </span>
        )}
      </div>
    </div>
  )
}
