'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Terminal } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store'
import { UserRole } from '@/types'

export default function SignUpPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const { switchRole } = useAppStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('retailer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleStandardSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data, error: err } = await signUp(email, password, role, fullName)
      if (err) throw err
      switchRole(role)
      router.push(`/dashboard/${role}`)
    } catch (err: any) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e4e9] tactical-grid font-mono flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white font-black flex items-center justify-center text-sm">
            SH
          </div>
          <span className="text-xl font-black text-white uppercase tracking-tight">SUPPLIER HUB // OPS</span>
        </Link>
        <p className="text-xs text-[#9497a1] uppercase tracking-wider">
          REGISTER NEW OPERATOR NODE // NAIROBI NETWORK
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#0e0f13] border-2 border-[#242630] p-6 sm:p-8 space-y-5">
          <form className="space-y-4 text-xs" onSubmit={handleStandardSignUp}>
            {error && (
              <div className="p-2.5 bg-[#14151a] border border-blue-500/50 text-white text-[11px] font-bold">
                {error}
              </div>
            )}

            <div>
              <label className="text-[10px] text-[#9497a1] uppercase block mb-1">
                OPERATOR / BUSINESS IDENTIFIER
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mama Sarah Fresh Kiosk"
                className="w-full bg-[#090a0d] border border-[#22242c] text-white py-2 px-3 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#9497a1] uppercase block mb-1">
                NODE ROLE ASSIGNMENT
              </label>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                {[
                  { r: 'retailer' as const, label: '[01] RETAILER', desc: 'Kiosk / Shop' },
                  { r: 'wholesaler' as const, label: '[02] WHOLESALE', desc: 'Bulk Depot' },
                  { r: 'farmer' as const, label: '[03] FARM GATE', desc: 'Direct Crop' },
                  { r: 'boda_rider' as const, label: '[04] BODA', desc: 'Carrier' },
                ].map(({ r, label, desc }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-2 border text-left transition-all ${
                      role === r
                        ? 'border-blue-500 bg-blue-950/40 text-blue-300 font-black'
                        : 'border-[#22242c] bg-[#090a0d] text-[#9497a1] hover:text-white'
                    }`}
                  >
                    <span className="block font-bold">{label}</span>
                    <span className="text-[9px] text-[#616572] block">{desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-[#9497a1] uppercase block mb-1">
                OPERATOR EMAIL // TRANSMISSION ADDRESS
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@domain.co.ke"
                className="w-full bg-[#090a0d] border border-[#22242c] text-white py-2 px-3 font-mono font-bold"
              />
            </div>

            <div>
              <label className="text-[10px] text-[#9497a1] uppercase block mb-1">
                SECURE ACCESS KEY
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#090a0d] border border-[#22242c] text-white py-2 px-3 font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{loading ? 'REGISTERING...' : 'INITIALIZE NODE ACCESS »'}</span>
            </button>
          </form>

          <div className="text-center pt-2 border-t border-[#1e2028]">
            <Link href="/login" className="text-xs text-[#9497a1] hover:text-blue-400 transition-colors">
              [EXISTING OPERATOR? PROCEED TO AUTHENTICATION]
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
