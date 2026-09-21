'use client'

import Link from 'next/link'
import {
  Store,
  Building2,
  Leaf,
  Bike,
  Mic,
  ArrowRight,
  Terminal,
  Activity,
  Zap,
  Radio,
  MapPin,
  Clock,
  Check,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e2e8] tactical-grid font-mono selection:bg-[#d2ff00] selection:text-black">
      {/* Top Telemetry Ticker */}
      <div className="bg-[#0e0e12] border-b border-[#22222a] py-2 px-4 text-[11px] overflow-hidden">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-[#d2ff00] animate-ping" />
            <span className="text-[#d2ff00] font-black uppercase tracking-wider">LIVE NAIROBI COMMODITY FEED</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-[#8a8a98]">
            <span>[WAKULIMA: MAIZE KSH 40/KG]</span>
            <span>•</span>
            <span>[GIKOMBA: BEANS KSH 120/KG]</span>
            <span>•</span>
            <span>[LIMURU FARM GATE: TOMATOES KSH 60/KG]</span>
            <span>•</span>
            <span className="text-[#ff6b00] font-bold">[BODA DISPATCH: 42 RIDERS AVAILABLE]</span>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0 text-[#666675]">
            <span>LAT -1.286389</span>
            <span>LON 36.817223</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="border-b border-[#24242e] bg-[#0c0c10]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#d2ff00] text-black font-black text-sm flex items-center justify-center">
              SH
            </div>
            <span className="text-white font-black tracking-tight text-sm uppercase">
              SUPPLIER HUB // OPS HUD
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs text-[#a0a0ae] hover:text-white border border-[#262630] hover:border-[#444455] transition-colors"
            >
              [AUTH LOGIN]
            </Link>
            <Link
              href="/dashboard/retailer"
              className="px-4 py-1.5 bg-[#d2ff00] hover:bg-[#bce400] text-black text-xs font-black tracking-wider uppercase transition-colors"
            >
              LAUNCH TERMINAL »
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-12">
        {/* Monolithic Industrial Headline */}
        <div className="space-y-4 max-w-5xl">
          <div className="inline-flex items-center gap-2 border border-[#333340] bg-[#121217] px-2.5 py-1 text-[11px] text-[#ff6b00]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>PWA LOGISTICS ENGINE // EAST AFRICA CORRIDOR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.95]">
            DIRECT COMMODITY SUPPLY.
            <br />
            <span className="text-[#d2ff00]">INSTANT BODA DISPATCH.</span>
          </h1>

          <p className="text-[#9595a4] text-sm sm:text-base max-w-3xl leading-relaxed">
            Eliminate broker fees. Connect informal kiosk retailers directly with bulk wholesalers and Limuru farm gates. Automated low-stock alarms, real-time Boda delivery routing, and hands-free voice orders.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/retailer"
              className="px-6 py-3.5 bg-[#d2ff00] hover:bg-[#b8e000] text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#d2ff00]/10 transition-all hover:translate-x-0.5"
            >
              <span>[01 RETAILER KIOSK HUD]</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/boda_rider"
              className="px-6 py-3.5 bg-[#14141a] hover:bg-[#1f1f26] border border-[#2a2a35] hover:border-[#ff6b00] text-[#ff6b00] font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <span>[04 BODA DISPATCH RADAR]</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tactical 4-Node Architecture Grid (Asymmetric Bento) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#24242e] pb-2 text-xs">
            <span className="text-[#d2ff00] font-black tracking-wider uppercase">
              // 04 INTERACTIVE LOGISTICS NODES
            </span>
            <span className="text-[#555562]">SELECT A NODE TO OPERATE LIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Node 1: Retailer */}
            <Link
              href="/dashboard/retailer"
              className="group p-5 bg-[#0f0f13] border border-[#24242e] hover:border-[#d2ff00] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#d2ff00] font-bold">[NODE 01]</span>
                  <span className="text-[10px] text-[#555562]">WESTLANDS_KIOSK</span>
                </div>
                <h2 className="text-xl font-black text-white group-hover:text-[#d2ff00] transition-colors">
                  RETAIL KIOSK
                </h2>
                <p className="text-xs text-[#8e8e9c] leading-relaxed">
                  Real-time inventory monitor. Automated shortage triggers, side-by-side supplier pricing comparison, and 1-tap ordering.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1a22] flex items-center justify-between text-xs text-[#d2ff00]">
                <span>ENTER PORTAL</span>
                <span className="group-hover:translate-x-1 transition-transform">»</span>
              </div>
            </Link>

            {/* Node 2: Wholesaler */}
            <Link
              href="/dashboard/wholesaler"
              className="group p-5 bg-[#0f0f13] border border-[#24242e] hover:border-blue-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-bold">[NODE 02]</span>
                  <span className="text-[10px] text-[#555562]">INDUSTRIAL_AREA</span>
                </div>
                <h2 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  BULK WHOLESALE
                </h2>
                <p className="text-xs text-[#8e8e9c] leading-relaxed">
                  Depot inventory & bulk price controls. Incoming retailer orders queue with automated Boda rider broadcast dispatch.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1a22] flex items-center justify-between text-xs text-blue-400">
                <span>ENTER PORTAL</span>
                <span className="group-hover:translate-x-1 transition-transform">»</span>
              </div>
            </Link>

            {/* Node 3: Farmer */}
            <Link
              href="/dashboard/farmer"
              className="group p-5 bg-[#0f0f13] border border-[#24242e] hover:border-emerald-400 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-bold">[NODE 03]</span>
                  <span className="text-[10px] text-[#555562]">LIMURU_HARVEST</span>
                </div>
                <h2 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                  FARM GATE
                </h2>
                <p className="text-xs text-[#8e8e9c] leading-relaxed">
                  Direct farm produce listing (Maize, Tomatoes, Potatoes). Farm-gate pricing directly accessible to informal kiosks.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1a22] flex items-center justify-between text-xs text-emerald-400">
                <span>ENTER PORTAL</span>
                <span className="group-hover:translate-x-1 transition-transform">»</span>
              </div>
            </Link>

            {/* Node 4: Boda Rider */}
            <Link
              href="/dashboard/boda_rider"
              className="group p-5 bg-[#0f0f13] border border-[#24242e] hover:border-[#ff6b00] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#ff6b00] font-bold">[NODE 04]</span>
                  <span className="text-[10px] text-[#555562]">STAGE_04_WESTLANDS</span>
                </div>
                <h2 className="text-xl font-black text-white group-hover:text-[#ff6b00] transition-colors">
                  BODA DISPATCH
                </h2>
                <p className="text-xs text-[#8e8e9c] leading-relaxed">
                  Tactical delivery radar. Trip fees in KSh, distance breakdown, 1-tap accept/decline, and turn-by-turn cargo tracking.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1a22] flex items-center justify-between text-xs text-[#ff6b00]">
                <span>ENTER PORTAL</span>
                <span className="group-hover:translate-x-1 transition-transform">»</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Live Operations Telemetry Preview */}
        <section className="p-6 bg-[#0c0c10] border-2 border-[#262632] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#202028] pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#d2ff00]" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                ACTIVE NAIROBI SUPPLY DISPATCH CYCLE
              </span>
            </div>
            <span className="text-[10px] text-[#777785]">END-TO-END AUTOMATED REPLENISHMENT FLOW</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#111116] border border-[#22222a]">
              <span className="text-[#ff2b2b] font-bold block mb-1">01 // SHORTAGE DETECTED</span>
              <p className="text-white font-bold text-sm">Maize Drops to 8 kg</p>
              <p className="text-[#888894] text-[11px] mt-1">Retailer threshold (20 kg) breached. PWA pushes high-priority restock signal.</p>
            </div>

            <div className="p-4 bg-[#111116] border border-[#22222a]">
              <span className="text-[#d2ff00] font-bold block mb-1">02 // COMPARISON MATRIX</span>
              <p className="text-white font-bold text-sm">Wholesale vs Farm Gate</p>
              <p className="text-[#888894] text-[11px] mt-1">System calculates: Kilimo Traders (KSh 45/kg + 160 fee) vs Farm (KSh 40/kg + 306 fee).</p>
            </div>

            <div className="p-4 bg-[#111116] border border-[#22222a]">
              <span className="text-blue-400 font-bold block mb-1">03 // BODA DISPATCH RADAR</span>
              <p className="text-white font-bold text-sm">James Boda Pinged</p>
              <p className="text-[#888894] text-[11px] mt-1">Offered KSh 210 delivery payout for 4.2 km transit. 1-tap accept.</p>
            </div>

            <div className="p-4 bg-[#111116] border border-[#22222a]">
              <span className="text-green-400 font-bold block mb-1">04 // COUNTER RESTOCK</span>
              <p className="text-white font-bold text-sm">Delivered & Restocked</p>
              <p className="text-[#888894] text-[11px] mt-1">Goods handed over at kiosk. Retailer inventory updates +50 kg automatically.</p>
            </div>
          </div>
        </section>

        {/* Quick Demo Footer */}
        <footer className="pt-8 border-t border-[#202028] flex flex-col sm:flex-row items-center justify-between text-xs text-[#666675] gap-4">
          <p>© 2026 SUPPLIER HUB // NAIROBI LOGISTICS CORRIDOR. BUILT FOR INFORMAL ECONOMIES.</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/retailer" className="hover:text-white">RETAILER</Link>
            <Link href="/dashboard/wholesaler" className="hover:text-white">WHOLESALER</Link>
            <Link href="/dashboard/farmer" className="hover:text-white">FARMER</Link>
            <Link href="/dashboard/boda_rider" className="hover:text-white">BODA RIDER</Link>
          </div>
        </footer>
      </main>
    </div>
  )
}