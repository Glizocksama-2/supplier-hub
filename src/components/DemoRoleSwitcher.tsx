'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Store,
  Building2,
  Leaf,
  Bike,
  Mic,
  Bell,
  RotateCcw,
  Home,
  Check,
  ChevronDown,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { UserRole } from '@/types'
import { VoiceAssistantModal } from './VoiceAssistantModal'

export function DemoRoleSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    currentRole,
    currentUser,
    switchRole,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    resetDemoData,
  } = useAppStore()

  const [isVoiceOpen, setIsVoiceOpen] = useState(false)
  const [isNotifsOpen, setIsNotifsOpen] = useState(false)

  const roles: { role: UserRole; label: string; icon: any; path: string; name: string }[] = [
    { role: 'retailer', label: 'Retailer', icon: Store, path: '/dashboard/retailer', name: 'Mama Sarah Fresh Kiosk' },
    { role: 'wholesaler', label: 'Wholesaler', icon: Building2, path: '/dashboard/wholesaler', name: 'Kilimo Traders' },
    { role: 'farmer', label: 'Farmer', icon: Leaf, path: '/dashboard/farmer', name: 'Green Valley Co-op' },
    { role: 'boda_rider', label: 'Boda Rider', icon: Bike, path: '/dashboard/boda_rider', name: 'James Otieno (Boda)' },
  ]

  const handleSwitch = (r: UserRole, path: string) => {
    switchRole(r)
    router.push(path)
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-2.5 gap-3">
            {/* Left: Brand + Quick Home */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-xl bg-green-600 flex items-center justify-center text-white font-black text-sm group-hover:bg-green-700 transition-colors">
                  SH
                </div>
                <div className="leading-tight">
                  <span className="font-bold text-gray-900 dark:text-white text-base">Supplier Hub</span>
                  <span className="text-[10px] block text-green-600 font-semibold uppercase tracking-wider">
                    Interactive Hackathon MVP
                  </span>
                </div>
              </Link>

              {/* Mobile controls */}
              <div className="flex items-center gap-2 sm:hidden">
                <button
                  onClick={() => setIsVoiceOpen(true)}
                  className="p-2 rounded-xl bg-green-50 text-green-700 dark:bg-green-950/50 dark:text-green-300"
                  title="Voice AI"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsNotifsOpen(!isNotifsOpen)}
                  className="p-2 relative rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Center: Role Switcher Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/80 rounded-2xl w-full sm:w-auto overflow-x-auto">
              {roles.map(({ role, label, icon: Icon, path }) => {
                const isActive = pathname.includes(role) || currentRole === role
                return (
                  <button
                    key={role}
                    onClick={() => handleSwitch(role, path)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-xs scale-100'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                )
              })}
            </div>

            {/* Right: Actions (Voice, Notifications, Reset Demo) */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Voice AI button */}
              <button
                onClick={() => setIsVoiceOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold shadow-xs shadow-green-600/20 transition-all hover:scale-105"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span>Voice Order AI</span>
              </button>

              {/* Notifications bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifsOpen(!isNotifsOpen)}
                  className="p-2 relative rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {isNotifsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="font-bold text-xs text-gray-900 dark:text-white">Live Activity Feed</span>
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-green-600 hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 py-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-4">No notifications yet</p>
                      ) : (
                        notifications.slice(0, 8).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`py-2 px-1 text-left cursor-pointer transition-colors ${
                              !n.is_read ? 'bg-green-50/50 dark:bg-green-950/20' : ''
                            }`}
                          >
                            <p className="text-xs font-semibold text-gray-900 dark:text-white">{n.title}</p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                              {n.message}
                            </p>
                            <span className="text-[9px] text-gray-400 mt-1 block">
                              {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Demo Data */}
              <button
                onClick={() => {
                  resetDemoData()
                  alert('Demo data has been reset to starting state!')
                }}
                className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                title="Reset simulation data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal isOpen={isVoiceOpen} onClose={() => setIsVoiceOpen(false)} />
    </>
  )
}
