'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Truck, Store, Building2, Leaf, Bike, ArrowRight, Shield, Zap } from 'lucide-react'
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
      setError(err.message || 'Login failed. Try quick demo mode below.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickDemoLogin = (role: UserRole) => {
    switchRole(role)
    router.push(`/dashboard/${role}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-green-600/30">
            <Truck className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">Supplier Hub</span>
        </Link>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sign in to your portal</h2>
        <p className="text-xs text-gray-500 mt-1">
          Connect with retailers, suppliers, and boda delivery partners
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-gray-900 py-8 px-6 shadow-xl border border-gray-100 dark:border-gray-800 rounded-3xl sm:px-10 space-y-6">
          {/* Quick Demo Access Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/20 border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-green-800 dark:text-green-300 font-bold text-xs mb-3">
              <Zap className="w-4 h-4 text-green-600 fill-green-600" />
              <span>One-Click Hackathon Demo Access</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('retailer')}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-green-100/60 dark:hover:bg-gray-700 text-left border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                  <Store className="w-3.5 h-3.5 text-green-600" />
                  <span>Retailer</span>
                </div>
                <span className="text-[10px] text-gray-500 block truncate">Mama Sarah Kiosk</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('wholesaler')}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-blue-100/60 dark:hover:bg-gray-700 text-left border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Wholesaler</span>
                </div>
                <span className="text-[10px] text-gray-500 block truncate">Kilimo Traders</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('farmer')}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-emerald-100/60 dark:hover:bg-gray-700 text-left border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Farmer</span>
                </div>
                <span className="text-[10px] text-gray-500 block truncate">Green Valley Co-op</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('boda_rider')}
                className="p-2.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-amber-100/60 dark:hover:bg-gray-700 text-left border border-gray-200 dark:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                  <Bike className="w-3.5 h-3.5 text-amber-600" />
                  <span>Boda Rider</span>
                </div>
                <span className="text-[10px] text-gray-500 block truncate">James Otieno</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
            <span className="shrink mx-4 text-gray-400 text-xs uppercase">Or with email</span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-800" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleStandardLogin}>
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@kiosk.co.ke"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs shadow-md shadow-green-600/20 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/signup" className="text-xs text-green-600 hover:underline">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
