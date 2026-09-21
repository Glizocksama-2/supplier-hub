'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Truck, Store, Building2, Leaf, Bike, ArrowRight } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-green-600/30">
            <Truck className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">Supplier Hub</span>
        </Link>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create an Account</h2>
        <p className="text-xs text-gray-500 mt-1">
          Join hundreds of retailers, wholesalers, farmers & boda riders
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-gray-900 py-8 px-6 shadow-xl border border-gray-100 dark:border-gray-800 rounded-3xl sm:px-10 space-y-6">
          <form className="space-y-4" onSubmit={handleStandardSignUp}>
            {error && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name / Business Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Mama Sarah Kiosk"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { r: 'retailer' as const, label: 'Retailer', icon: Store },
                  { r: 'wholesaler' as const, label: 'Wholesaler', icon: Building2 },
                  { r: 'farmer' as const, label: 'Farmer', icon: Leaf },
                  { r: 'boda_rider' as const, label: 'Boda Rider', icon: Bike },
                ].map(({ r, label, icon: Icon }) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      role === r
                        ? 'border-green-600 bg-green-50/50 dark:bg-green-950/40 text-green-700 dark:text-green-300 font-bold'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.co.ke"
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
              <span>{loading ? 'Creating Account...' : 'Complete Sign Up'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs text-green-600 hover:underline">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
