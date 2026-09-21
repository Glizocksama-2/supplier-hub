'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Terminal, Zap, Shield, Key } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store'
import { UserRole } from '@/types'

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const { switchRole } = useAppStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await signIn(email, password)
      if (err) throw err
      router.push('/dashboard/retailer')
    } catch (err: any) {
      setError(err.message || 'Authentication error. Use 1-click terminal macros below.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role)
    router.push(`/dashboard/${role}`)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e2e8] tactical-grid font-mono flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#d2ff00] selection:text-black">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-[#d2ff00] text-black font-black flex items-center justify-center text-sm">
            SH
          </div>
          <span className="text-xl font-black text-white uppercase tracking-tight">SUPPLIER HUB // OPS</span>
        </Link>
        <p className="text-xs text-[#777785] uppercase tracking-wider">
          AUTHENTICATE TERMINAL SESSION // NAIROBI NETWORK
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0e0e13] border-2 border-[#242430] p-6 sm:p-8 space-y-6">
          {/* Quick Hardware Macro Access */}
          <div className="p-4 bg-[#14141c] border border-[#2d2d3c] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-black uppercase text-[#d2ff00]">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-[#d2ff00]" />
                HARDWARE BYPASS // 1-CLICK DEMO ACCESS
              </span>
              <span className="text-[9px] text-[#777785]">NO_PASSWORD</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('retailer')}
                className="p-2.5 bg-[#0a0a0e] hover:bg-[#1a1a24] border border-[#252535] hover:border-[#d2ff00] text-left transition-colors"
              >
                <span className="text-[10px] text-[#d2ff00] font-bold block">[01] RETAILER</span>
                <span className="text-white font-bold text-xs truncate block">Mama Sarah Kiosk</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('wholesaler')}
                className="p-2.5 bg-[#0a0a0e] hover:bg-[#1a1a24] border border-[#252535] hover:border-blue-400 text-left transition-colors"
              >
                <span className="text-[10px] text-blue-400 font-bold block">[02] WHOLESALE</span>
                <span className="text-white font-bold text-xs truncate block">Kilimo Traders</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer')}
                className="p-2.5 bg-[#0a0a0e] hover:bg-[#1a1a24] border border-[#252535] hover:border-emerald-400 text-left transition-colors"
              >
                <span className="text-[10px] text-emerald-400 font-bold block">[03] FARM GATE</span>
                <span className="text-white font-bold text-xs truncate block">Green Valley Co-op</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('boda_rider')}
                className="p-2.5 bg-[#0a0a0e] hover:bg-[#1a1a24] border border-[#252535] hover:border-[#ff6b00] text-left transition-colors"
              >
                <span className="text-[10px] text-[#ff6b00] font-bold block">[04] BODA RADAR</span>
                <span className="text-white font-bold text-xs truncate block">James Otieno</span>
              </button>
            </div>
          </div>

          <div className="flex items-center text-xs text-[#555562] uppercase">
            <div className="flex-grow border-t border-[#1e1e26]" />
            <span className="px-3">Or Credentials</span>
            <div className="flex-grow border-t border-[#1e1e26]" />
          </div>

          {/* Form */}
          <form className="space-y-4 text-xs" onSubmit={handleStandardLogin}>
            {error && (
              <div className="p-2.5 bg-[#250d0d] border border-[#551818] text-[#ff6b6b] text-[11px] font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="text-[10px] text-[#777785] uppercase block mb-1">
                OPERATOR ID // EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@supplierhub.co.ke"
                className="w-full bg-[#0a0a0e] border border-[#282838] text-white py-2 px-3 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#777785] uppercase block mb-1">
                ACCESS KEY // PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0e] border border-[#282838] text-white py-2 px-3 font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#d2ff00] hover:bg-[#b8e000] text-black font-black uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'AUTHENTICATING...' : 'OPEN SESSION »'}</span>
            </button>
          </form>

          <div className="text-center pt-1 border-t border-[#1e1e26]">
            <Link href="/signup" className="text-xs text-[#888894] hover:text-[#d2ff00] transition-colors">
              [NEW REGISTRATION // CREATE OPERATOR ACCOUNT]
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
