'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Truck, Store, Leaf, Bike, Mic, Shield, Zap } from 'lucide-react'

export default function HomePage() {
  const { user, signIn, signUp, isLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [role, setRole] = useState<'retailer' | 'wholesaler' | 'farmer' | 'boda_rider'>('retailer')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    try {
      if (isSignUp) {
        const { data, error: err } = await signUp(email, password, role, fullName)
        if (err) throw err
        setSuccess('Account created! Please check your email to verify.')
        setIsSignUp(false)
      } else {
        const { data, error: err } = await signIn(email, password)
        if (err) throw err
        setSuccess('Signed in! Redirecting...')
      }
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
            Welcome back, {user.full_name || user.email}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Role: <span className="capitalize font-medium">{user.role}</span>
          </p>
          <Link 
            href={`/dashboard/${user.role}`}
            className="inline-block w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-green-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-green-700 dark:text-green-400">Supplier Hub</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300 font-medium">
              <Link href="/dashboard/retailer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">For Retailers</Link>
              <Link href="/dashboard/wholesaler" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">For Wholesalers</Link>
              <Link href="/dashboard/farmer" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">For Farmers</Link>
              <Link href="/dashboard/boda_rider" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">For Riders</Link>
            </div>
            <div className="flex items-center gap-3">
              {isSignUp ? (
                <Link href="/login" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                  Already have an account? Sign in
                </Link>
              ) : (
                <Link href="/login" className="text-sm text-green-600 dark:text-green-400 hover:underline">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-16 pb-20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Hero Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                <span>New: Voice-powered orders with ElevenLabs</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Connect Retailers, Suppliers & Delivery
                <br />
                <span className="text-green-600 dark:text-green-400">In One Platform</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
                Supplier Hub PWA connects retailers, wholesalers, farmers & boda riders. 
                Real-time stock alerts, supplier discovery, voice orders & delivery tracking — all offline-first.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  href="/dashboard/retailer"
                  className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all shadow-lg shadow-green-600/25 text-lg hover:scale-105"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>Launch Live Interactive Demo</span>
                </Link>
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 border-2 border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 font-semibold py-4 px-8 rounded-xl transition-colors text-lg"
                >
                  <span>Quick Demo Logins</span>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-500" />
                  <span>Real-time Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-green-500" />
                  <span>Voice Commands</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bike className="w-4 h-4 text-green-500" />
                  <span>Offline-First</span>
                </div>
              </div>
            </div>

            {/* Right: Phone Mockup / Demo */}
            <div className="relative">
              <div className="relative max-w-md mx-auto">
                {/* Phone frame */}
                <div className="relative bg-gray-900 rounded-[40px] p-2 shadow-2xl shadow-black/20 aspect-[9/19.5] max-w-sm mx-auto">
                  <div className="bg-gray-50 dark:bg-gray-950 rounded-[38px] h-full overflow-hidden relative">
                    {/* Status bar */}
                    <div className="h-10 flex items-center justify-between px-4 text-white text-xs">
                      <span>9:41</span>
                      <div className="flex items-center gap-1">
                        <span className="w-6 h-3 bg-green-500 rounded-full relative">
                          <span className="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full" />
                        </span>
                      </div>
                    </div>

                    {/* App content */}
                    <div className="p-4 h-[calc(100%-2.5rem)] overflow-y-auto space-y-4">
                      {/* Low Stock Alert */}
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-red-600 dark:text-red-400">Low Stock Alert</p>
                            <p className="text-xs text-red-500/80">Maize below threshold</p>
                          </div>
                        </div>
                        <Link href="/dashboard/retailer" className="block text-center w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                          View Suppliers
                        </Link>
                      </div>

                      {/* Available Suppliers */}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-3">Available Suppliers for Maize</h3>
                        <div className="space-y-3">
                          <SupplierCard 
                            name="Kilimo Wholesalers" 
                            price="KSh 45/kg" 
                            stock="500 kg" 
                            distance="2.3 km" 
                            delivery="KSh 115"
                            rating={4.8}
                          />
                          <SupplierCard 
                            name="Mama Mboga Farm" 
                            price="KSh 42/kg" 
                            stock="200 kg" 
                            distance="5.1 km" 
                            delivery="KSh 255"
                            rating={4.5}
                          />
                          <SupplierCard 
                            name="Green Valley Co-op" 
                            price="KSh 48/kg" 
                            stock="1000 kg" 
                            distance="8.7 km" 
                            delivery="KSh 435"
                            rating={4.9}
                          />
                        </div>
                      </div>

                      {/* Voice Button */}
                      <div className="mt-4">
                        <Link href="/dashboard/retailer" className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-colors">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Mic className="w-5 h-5" />
                          </div>
                          <span>Hold to Speak: "Order 50kg maize"</span>
                        </Link>
                        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Powered by ElevenLabs • Works offline
                        </p>
                      </div>

                      {/* Boda Tracking */}
                      <Link href="/dashboard/boda_rider" className="block bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 hover:border-green-500 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                            <Bike className="w-6 h-6 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Order #SH-2024-0042</p>
                            <p className="font-medium text-gray-900 dark:text-white">James Otieno • 0.8 km away</p>
                            <p className="text-sm text-green-600 dark:text-green-400">Arriving in 3 min (Tap to view rider app)</p>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Bottom nav */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex justify-around py-2">
                        <Link href="/dashboard/retailer"><NavItem icon={Store} label="Shop" active /></Link>
                        <Link href="/dashboard/retailer"><NavItem icon={Truck} label="Orders" /></Link>
                        <Link href="/dashboard/wholesaler"><NavItem icon={Leaf} label="Suppliers" /></Link>
                        <Link href="/dashboard/boda_rider"><NavItem icon={Bike} label="Delivery" /></Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone shadow */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-black/10 rounded-full blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Supply Smarter
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built for the African supply chain. Works offline, speaks your language, delivers results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={Store}
              title="For Retailers"
              description="Get low-stock alerts, browse verified suppliers, compare prices & delivery, place orders with voice or tap."
              features={["Low stock alerts", "Price comparison", "Voice ordering", "Order tracking"]}
            />
            <FeatureCard 
              icon={Leaf}
              title="For Wholesalers & Farmers"
              description="List your produce, set prices & stock, receive orders, manage deliveries, get paid at the counter."
              features={["List products", "Set dynamic pricing", "Order management", "Payment tracking"]}
            />
            <FeatureCard 
              icon={Bike}
              title="For Boda Riders"
              description="Get delivery requests nearby, accept/decline based on distance & pay, navigate with offline maps, earn per trip."
              features={["Nearby deliveries", "Accept/decline", "Offline navigation", "Earnings tracking"]}
            />
            <FeatureCard 
              icon={Mic}
              title="Voice-First Interface"
              description="Talk to the app in Swahili or English. Place orders, check stock, track deliveries — hands-free while you work."
              features={["Swahili & English", "Offline STT", "ElevenLabs TTS", "Hands-free mode"]}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From low stock alert to delivery at your door — in minutes, not hours.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <StepCard 
              number="1"
              title="Stock Runs Low"
              description="Retailer gets instant push notification when inventory drops below threshold. Works offline via background sync."
              icon={<Store className="w-8 h-8" />}
            />
            <StepCard 
              number="2"
              title="Find Best Supplier"
              description="App shows nearby wholesalers/farmers with prices, stock levels, delivery time & total cost. Filter by distance or price."
              icon={<Leaf className="w-8 h-8" />}
            />
            <StepCard 
              number="3"
              title="Place Order"
              description="Tap to order or speak: 'Order 50kg maize from cheapest supplier'. Voice powered by ElevenLabs, works in Swahili/English."
              icon={<Mic className="w-8 h-8" />}
            />
            <StepCard 
              number="4"
              title="Boda Delivers"
              description="Nearest registered rider gets notified. Accepts based on distance/pay. Real-time tracking with offline maps. Payment at counter."
              icon={<Bike className="w-8 h-8" />}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of retailers, suppliers & riders already using Supplier Hub. 
            Free for retailers. Commission-free for suppliers. Pay-per-delivery for riders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-green-50 font-medium py-4 px-8 rounded-xl transition-colors text-lg"
            >
              <span>Get Started Free</span>
            </Link>
            <Link 
              href="#demo"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white/10 font-medium py-4 px-8 rounded-xl transition-colors text-lg"
            >
              <span>Watch Demo</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="w-8 h-8 text-green-400" />
                <span className="text-xl font-bold">Supplier Hub</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting retailers, suppliers & delivery riders across East Africa. 
                Built for the informal economy.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">For Business</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Retailer Dashboard</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Supplier Portal</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Rider App</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-green-400 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 Supplier Hub. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms</a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SupplierCard({ 
  name, 
  price, 
  stock, 
  distance, 
  delivery, 
  rating 
}: { 
  name: string
  price: string
  stock: string
  distance: string
  delivery: string
  rating: number
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-white truncate">{name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">★ {rating} • {stock} available</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-green-600 dark:text-green-400">{price}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{distance} away</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">Delivery: {delivery}</span>
        <button className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
          Select
        </button>
      </div>
    </div>
  )
}

function NavItem({ icon: Icon, label, active }: { icon: React.ComponentType<{ className?: string }>, label: string, active?: boolean }) {
  return (
    <button className={`flex flex-col items-center gap-1 px-3 py-2 transition-colors ${
      active 
        ? 'text-green-600 dark:text-green-400' 
        : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
    }`}>
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  )
}

function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  features 
}: { 
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  features: string[]
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-green-300 dark:hover:border-green-700 transition-colors h-full">
      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepCard({ 
  number, 
  title, 
  description, 
  icon 
}: { 
  number: string
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
      <div className="absolute -top-4 left-8 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
        {number}
      </div>
      <div className="pt-4">
        <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  )
}