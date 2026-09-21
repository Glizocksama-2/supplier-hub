'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Radio,
  RotateCcw,
  Bell,
  Mic,
  ArrowUpRight,
  Terminal,
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

  const roles: { role: UserRole; code: string; label: string; path: string; name: string }[] = [
    { role: 'retailer', code: '01', label: 'RETAILER', path: '/dashboard/retailer', name: 'MAMA SARAH' },
    { role: 'wholesaler', code: '02', label: 'WHOLESALE', path: '/dashboard/wholesaler', name: 'KILIMO TRADERS' },
    { role: 'farmer', code: '03', label: 'FARM GATE', path: '/dashboard/farmer', name: 'GREEN VALLEY' },
    { role: 'boda_rider', code: '04', label: 'BODA DISPATCH', path: '/dashboard/boda_rider', name: 'JAMES BODA' },
  ]

  const handleSwitch = (r: UserRole, path: string) => {
    switchRole(r)
    router.push(path)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#0e0e11] border-b border-[#242429] font-mono text-xs select-none">
        <div className="max-w-[1500px] mx-auto px-3 sm:px-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between py-2 gap-2">
            {/* Left: Terminal Branding */}
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-6 h-6 bg-[#d2ff00] text-black font-black flex items-center justify-center text-xs group-hover:bg-white transition-colors">
                  SH
                </div>
                <div className="flex items-center gap-2 font-bold tracking-tight">
                  <span className="text-white text-sm">SUPPLIER-HUB</span>
                  <span className="text-[#555562] text-[10px] hidden sm:inline">// NAIROBI_CORRIDOR_V2</span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 border border-[#242429] bg-[#141418] text-[#888892] text-[10px]">
                  <span className="w-1.5 h-1.5 bg-[#d2ff00] animate-ping" />
                  ONLINE: EAT_GMT+3
                </span>

                {/* Mobile Trigger Buttons */}
                <div className="flex items-center gap-1.5 lg:hidden">
                  <button
                    onClick={() => setIsVoiceOpen(true)}
                    className="p-1.5 bg-[#d2ff00] text-black font-bold"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setIsNotifsOpen(!isNotifsOpen)}
                    className="p-1.5 bg-[#1a1a20] text-white border border-[#2e2e38] relative"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#ff6b00] text-black text-[9px] font-black flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Center: Tactical Persona Toggle Grid */}
            <div className="flex items-center gap-1 overflow-x-auto bg-[#08080a] p-1 border border-[#222228]">
              {roles.map(({ role, code, label, path, name }) => {
                const isActive = pathname.includes(role) || currentRole === role
                return (
                  <button
                    key={role}
                    onClick={() => handleSwitch(role, path)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-mono tracking-wider uppercase whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#d2ff00] text-black font-black shadow-sm'
                        : 'text-[#8e8e9c] hover:text-white hover:bg-[#16161c]'
                    }`}
                  >
                    <span className={isActive ? 'text-black font-bold opacity-70' : 'text-[#ff6b00]'}>
                      [{code}]
                    </span>
                    <span>{label}</span>
                    <span className={`text-[9px] hidden xl:inline ${isActive ? 'text-black/70' : 'text-[#555562]'}`}>
                      ({name})
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Right: Tactical Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Voice HUD launcher */}
              <button
                onClick={() => setIsVoiceOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#18181f] hover:bg-[#22222a] border border-[#33333e] text-[#d2ff00] hover:border-[#d2ff00] transition-colors"
              >
                <Mic className="w-3.5 h-3.5 animate-pulse" />
                <span className="text-[11px] font-bold">VOICE HUD</span>
              </button>

              {/* Realtime Event Stream Drawer */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifsOpen(!isNotifsOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 border transition-colors ${
                    unreadCount > 0
                      ? 'border-[#ff6b00] bg-[#ff6b00]/10 text-[#ff6b00]'
                      : 'border-[#242429] bg-[#141418] text-[#888892] hover:text-white'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">{unreadCount} ALERTS</span>
                </button>

                {/* Dropdown */}
                {isNotifsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0e0e12] border-2 border-[#33333d] shadow-2xl p-3 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-[#242429]">
                      <span className="text-[11px] font-black text-[#d2ff00] uppercase tracking-wider">
                        // DISPATCH EVENT LOG
                      </span>
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-[#888892] hover:text-white underline uppercase"
                      >
                        [CLEAR ALL]
                      </button>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[#1e1e24] py-1">
                      {notifications.length === 0 ? (
                        <p className="text-[11px] text-[#555562] py-4 text-center">NO RECENT DISPATCH LOGS</p>
                      ) : (
                        notifications.slice(0, 10).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`py-2.5 px-2 text-left cursor-pointer transition-colors ${
                              !n.is_read ? 'bg-[#181822] border-l-2 border-[#ff6b00]' : 'hover:bg-[#14141a]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-white uppercase">{n.title}</span>
                              <span className="text-[9px] text-[#555562]">
                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#a0a0ae] mt-1 leading-snug">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Reset State */}
              <button
                onClick={() => {
                  resetDemoData()
                  alert('[STATUS: SIMULATION_DATA_RESET_TO_DEFAULTS]')
                }}
                className="p-1.5 border border-[#242429] bg-[#141418] hover:bg-[#1f1f26] text-[#888892] hover:text-white"
                title="Reset simulation telemetry"
              >
                <RotateCcw className="w-3.5 h-3.5" />
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
