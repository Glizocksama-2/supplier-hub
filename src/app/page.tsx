'use client'

import { useState } from 'react'
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

const COMMODITY_RADAR_DATA = [
  {
    name: 'Dry White Maize',
    category: 'Grains',
    unit: 'kg',
    batch: '50 kg',
    cheapest: {
      supplier: 'Green Valley Farm Gate',
      unitPrice: 40,
      distance: '6.8 km',
      eta: '~20 min',
      total: 2306,
      savings: 104,
    },
    fastest: {
      supplier: 'Kilimo Traders Wholesale',
      unitPrice: 45,
      distance: '3.2 km',
      eta: '~12 min',
      total: 2410,
      timeSaved: '8 min',
    },
    guidance: 'Save KSh 104 via Farm Gate, or pay KSh 104 more to receive shipment 8 min earlier via local wholesale depot.',
  },
  {
    name: 'Plum Salad Tomatoes',
    category: 'Vegetables',
    unit: 'kg',
    batch: '30 kg',
    cheapest: {
      supplier: 'Green Valley Farm Gate',
      unitPrice: 65,
      distance: '6.8 km',
      eta: '~20 min',
      total: 2256,
      savings: 304,
    },
    fastest: {
      supplier: 'Kilimo Traders Wholesale',
      unitPrice: 80,
      distance: '3.2 km',
      eta: '~12 min',
      total: 2560,
      timeSaved: '8 min',
    },
    guidance: 'Substantial KSh 304 margin improvement direct from farm. Kilimo Traders is best for urgent lunch rush replenishment.',
  },
  {
    name: 'Rosecoco Clean Beans',
    category: 'Grains',
    unit: 'kg',
    batch: '40 kg',
    cheapest: {
      supplier: 'Green Valley Farm Gate',
      unitPrice: 110,
      distance: '6.8 km',
      eta: '~20 min',
      total: 4706,
      savings: 454,
    },
    fastest: {
      supplier: 'Kilimo Traders Wholesale',
      unitPrice: 125,
      distance: '3.2 km',
      eta: '~12 min',
      total: 5160,
      timeSaved: '8 min',
    },
    guidance: 'Direct Limuru harvest delivers KSh 454 net savings on 40kg sacks with reliable courier dispatch.',
  },
  {
    name: 'Shangi Irish Potatoes',
    category: 'Vegetables',
    unit: 'kg',
    batch: '50 kg',
    cheapest: {
      supplier: 'Green Valley Farm Gate',
      unitPrice: 42,
      distance: '6.8 km',
      eta: '~20 min',
      total: 2406,
      savings: 654,
    },
    fastest: {
      supplier: 'Kilimo Traders Wholesale',
      unitPrice: 58,
      distance: '3.2 km',
      eta: '~12 min',
      total: 3060,
      timeSaved: '8 min',
    },
    guidance: 'Heavy commodity: farm gate saves a massive KSh 654 per 50kg bag even after long-range Boda carrier fees.',
  },
]

export default function HomePage() {
  const [filterMode, setFilterMode] = useState<'all' | 'cheapest' | 'fastest'>('all')

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e4e9] tactical-grid font-mono selection:bg-blue-600 selection:text-white">
      {/* Top Telemetry Ticker */}
      <div className="bg-[#0c0d10] border-b border-[#20222a] py-2 px-4 text-[11px] overflow-hidden">
        <div className="max-w-[1500px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-blue-500 animate-ping" />
            <span className="text-blue-400 font-black uppercase tracking-wider">LIVE NAIROBI COMMODITY FEED</span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-[#9497a1]">
            <span>[WAKULIMA: MAIZE KSH 40/KG]</span>
            <span>•</span>
            <span>[GIKOMBA: BEANS KSH 120/KG]</span>
            <span>•</span>
            <span>[LIMURU FARM GATE: TOMATOES KSH 60/KG]</span>
            <span>•</span>
            <span className="text-blue-400 font-bold">[BODA DISPATCH: 42 RIDERS AVAILABLE]</span>
          </div>

          <div className="hidden md:flex items-center gap-3 shrink-0 text-[#616572]">
            <span>LAT -1.286389</span>
            <span>LON 36.817223</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="border-b border-[#22242c] bg-[#0c0d10]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-7 bg-blue-600 text-white font-black text-xs flex items-center justify-center tracking-wider">
              KNS
            </div>
            <span className="text-white font-black tracking-tight text-sm uppercase">
              KUJA NA SUPPLY // OPS HUD
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs text-[#9497a1] hover:text-white border border-[#242630] hover:border-[#383b48] transition-colors"
            >
              [AUTH LOGIN]
            </Link>
            <Link
              href="/dashboard/retailer"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black tracking-wider uppercase transition-colors"
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
          <div className="inline-flex items-center gap-2 border border-[#262934] bg-[#101217] px-2.5 py-1 text-[11px] text-blue-400">
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-400" />
            <span>PWA LOGISTICS ENGINE // EAST AFRICA CORRIDOR</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-[0.95]">
            DIRECT COMMODITY SUPPLY.
            <br />
            <span className="text-blue-500">INSTANT BODA DISPATCH.</span>
          </h1>

          <p className="text-[#9497a1] text-sm sm:text-base max-w-3xl leading-relaxed">
            Eliminate broker fees. Connect informal kiosk retailers directly with bulk wholesalers and Limuru farm gates. Automated low-stock alarms, real-time Boda delivery routing, and hands-free voice orders.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard/retailer"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all hover:translate-x-0.5"
            >
              <span>[01 RETAILER KIOSK HUD]</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard/boda_rider"
              className="px-6 py-3.5 bg-[#121318] hover:bg-[#181a22] border border-[#242632] hover:border-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
            >
              <span>[04 BODA DISPATCH RADAR]</span>
              <ArrowRight className="w-4 h-4 text-blue-400" />
            </Link>
          </div>
        </div>

        {/* Tactical 4-Node Architecture Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#20222a] pb-2 text-xs">
            <span className="text-blue-400 font-black tracking-wider uppercase">
              // 04 INTERACTIVE LOGISTICS NODES
            </span>
            <span className="text-[#616572]">SELECT A NODE TO OPERATE LIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Node 1: Retailer */}
            <Link
              href="/dashboard/retailer"
              className="group p-5 bg-[#0e0f12] border border-[#22242c] hover:border-blue-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-bold">[NODE 01]</span>
                  <span className="text-[10px] text-[#616572]">WESTLANDS_KIOSK</span>
                </div>
                <h2 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  RETAIL KIOSK
                </h2>
                <p className="text-xs text-[#9497a1] leading-relaxed">
                  Real-time inventory monitor. Automated shortage triggers, side-by-side supplier pricing comparison, and 1-tap ordering.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1b22] flex items-center justify-between text-xs text-blue-400">
                <span>ENTER PORTAL</span>
                <span className="group-hover:translate-x-1 transition-transform">»</span>
              </div>
            </Link>

            {/* Node 2: Wholesaler */}
            <Link
              href="/dashboard/wholesaler"
              className="group p-5 bg-[#0e0f12] border border-[#22242c] hover:border-blue-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-bold">[NODE 02]</span>
                  <span className="text-[10px] text-[#616572]">INDUSTRIAL_AREA</span>
                </div>
                <h2 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  BULK WHOLESALE
                </h2>
                <p className="text-xs text-[#9497a1] leading-relaxed">
                  Depot inventory & bulk price controls. Incoming retailer orders queue with automated Boda rider broadcast dispatch.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1b22] flex items-center justify-between text-xs text-blue-400">
                <span>ENTER PORTAL</span>
                <span className="group-hover:translate-x-1 transition-transform">»</span>
              </div>
            </Link>

            {/* Node 3: Farmer */}
            <Link
              href="/dashboard/farmer"
              className="group p-5 bg-[#0e0f12] border border-[#22242c] hover:border-blue-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-bold">[NODE 03]</span>
                  <span className="text-[10px] text-[#616572]">LIMURU_HARVEST</span>
                </div>
                <h2 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  FARM GATE
                </h2>
                <p className="text-xs text-[#9497a1] leading-relaxed">
                  Direct farm produce listing (Maize, Tomatoes, Potatoes). Farm-gate pricing directly accessible to informal kiosks.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1b22] flex items-center justify-between text-xs text-blue-400">
                <span>ENTER PORTAL</span>
                <span className="group-hover:translate-x-1 transition-transform">»</span>
              </div>
            </Link>

            {/* Node 4: Boda Rider */}
            <Link
              href="/dashboard/boda_rider"
              className="group p-5 bg-[#0e0f12] border border-[#22242c] hover:border-blue-500 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-400 font-bold">[NODE 04]</span>
                  <span className="text-[10px] text-[#616572]">STAGE_04_WESTLANDS</span>
                </div>
                <h2 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                  BODA DISPATCH
                </h2>
                <p className="text-xs text-[#9497a1] leading-relaxed">
                  Tactical delivery radar. Trip fees in KSh, distance breakdown, 1-tap accept/decline, and turn-by-turn cargo tracking.
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-[#1a1b22] flex items-center justify-between text-xs text-blue-400">
                <span>ENTER PORTAL</span>
                <span className="group-hover:translate-x-1 transition-transform">»</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Live Consumer Commodity Routing Matrix: Price vs Speed */}
        <section className="p-6 bg-[#0c0d10] border-2 border-blue-600/70 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#20222a] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 animate-pulse" />
                <h2 className="text-sm font-black text-white uppercase tracking-wider">
                  CONSUMER SOURCING RADAR // CHEAPEST VS FASTEST ROUTING
                </h2>
              </div>
              <p className="text-[11px] text-[#9497a1] mt-0.5">
                Real-time price arbitration: compare direct farm-gate savings vs local wholesale depot arrival speed
              </p>
            </div>

            {/* Interactive Mode Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1.5 font-bold border transition-colors ${
                  filterMode === 'all'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-[#121318] text-[#9497a1] border-[#22242c] hover:text-white'
                }`}
              >
                SHOW ALL
              </button>
              <button
                onClick={() => setFilterMode('cheapest')}
                className={`px-3 py-1.5 font-bold border transition-colors ${
                  filterMode === 'cheapest'
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-[#121318] text-[#9497a1] border-[#22242c] hover:text-white'
                }`}
              >
                ★ HIGHLIGHT CHEAPEST
              </button>
              <button
                onClick={() => setFilterMode('fastest')}
                className={`px-3 py-1.5 font-bold border transition-colors ${
                  filterMode === 'fastest'
                    ? 'bg-white text-black border-white'
                    : 'bg-[#121318] text-[#9497a1] border-[#22242c] hover:text-white'
                }`}
              >
                ⚡ HIGHLIGHT FASTEST
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {COMMODITY_RADAR_DATA.map((item) => {
              const showCheapestHighlight = filterMode === 'all' || filterMode === 'cheapest'
              const showFastestHighlight = filterMode === 'all' || filterMode === 'fastest'

              return (
                <div
                  key={item.name}
                  className="p-4 bg-[#101116] border border-[#22242e] space-y-4 hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-start justify-between border-b border-[#1c1e28] pb-2">
                    <div>
                      <span className="text-[10px] text-blue-400 font-bold uppercase block tracking-wider">
                        {item.category} // REQUISITION BATCH: {item.batch}
                      </span>
                      <h3 className="text-lg font-black text-white uppercase">{item.name}</h3>
                    </div>
                    <Link
                      href="/dashboard/retailer"
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                    >
                      <span>ORDER »</span>
                    </Link>
                  </div>

                  {/* Dual Comparison Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Cheapest Pick */}
                    <div
                      className={`p-3 bg-[#08090d] border transition-all space-y-1.5 ${
                        showCheapestHighlight
                          ? 'border-blue-600 bg-blue-950/20'
                          : 'border-[#1e202a] opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-blue-600 text-white uppercase">
                          ★ CHEAPEST
                        </span>
                        <span className="text-[10px] text-blue-300 font-bold">
                          SAVE KSh {item.cheapest.savings}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{item.cheapest.supplier}</h4>
                      <div className="text-[11px] text-[#9497a1] space-y-0.5">
                        <div className="flex justify-between">
                          <span>RATE:</span>
                          <strong className="text-white">KSh {item.cheapest.unitPrice}/{item.unit}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>TRANSIT:</span>
                          <span>{item.cheapest.eta} ({item.cheapest.distance})</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-[#181a24] text-white font-bold">
                          <span>ALL-IN TOTAL:</span>
                          <span className="text-blue-400 font-black">KSh {item.cheapest.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Fastest Pick */}
                    <div
                      className={`p-3 bg-[#08090d] border transition-all space-y-1.5 ${
                        showFastestHighlight
                          ? 'border-white bg-[#14151c]'
                          : 'border-[#1e202a] opacity-70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black px-1.5 py-0.5 bg-white text-black uppercase">
                          ⚡ FASTEST
                        </span>
                        <span className="text-[10px] text-white font-bold">
                          {item.fastest.timeSaved} FASTER
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm">{item.fastest.supplier}</h4>
                      <div className="text-[11px] text-[#9497a1] space-y-0.5">
                        <div className="flex justify-between">
                          <span>RATE:</span>
                          <strong className="text-white">KSh {item.fastest.unitPrice}/{item.unit}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>TRANSIT:</span>
                          <span className="text-white font-bold">{item.fastest.eta} ({item.fastest.distance})</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-[#181a24] text-white font-bold">
                          <span>ALL-IN TOTAL:</span>
                          <span className="text-white font-black">KSh {item.fastest.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decision Guidance Footer */}
                  <div className="p-2 bg-[#090a0d] border border-[#1a1c24] text-[10px] text-[#9497a1]">
                    <strong className="text-white">TACTICAL VERDICT: </strong>
                    {item.guidance}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Live Operations Telemetry Preview */}
        <section className="p-6 bg-[#0c0d10] border-2 border-[#242630] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#20222a] pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                ACTIVE NAIROBI SUPPLY DISPATCH CYCLE
              </span>
            </div>
            <span className="text-[10px] text-[#9497a1]">END-TO-END AUTOMATED REPLENISHMENT FLOW</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-[#111216] border border-[#22242b]">
              <span className="text-blue-400 font-bold block mb-1">01 // SHORTAGE DETECTED</span>
              <p className="text-white font-bold text-sm">Maize Drops to 8 kg</p>
              <p className="text-[#9497a1] text-[11px] mt-1">Retailer threshold (20 kg) breached. PWA pushes high-priority restock signal.</p>
            </div>

            <div className="p-4 bg-[#111216] border border-[#22242b]">
              <span className="text-blue-400 font-bold block mb-1">02 // COMPARISON MATRIX</span>
              <p className="text-white font-bold text-sm">Wholesale vs Farm Gate</p>
              <p className="text-[#9497a1] text-[11px] mt-1">System calculates: Kilimo Traders (KSh 45/kg + 160 fee) vs Farm (KSh 40/kg + 306 fee).</p>
            </div>

            <div className="p-4 bg-[#111216] border border-[#22242b]">
              <span className="text-blue-400 font-bold block mb-1">03 // BODA DISPATCH RADAR</span>
              <p className="text-white font-bold text-sm">James Boda Pinged</p>
              <p className="text-[#9497a1] text-[11px] mt-1">Offered KSh 210 delivery payout for 4.2 km transit. 1-tap accept.</p>
            </div>

            <div className="p-4 bg-[#111216] border border-[#22242b]">
              <span className="text-blue-400 font-bold block mb-1">04 // COUNTER RESTOCK</span>
              <p className="text-white font-bold text-sm">Delivered & Restocked</p>
              <p className="text-[#9497a1] text-[11px] mt-1">Goods handed over at kiosk. Retailer inventory updates +50 kg automatically.</p>
            </div>
          </div>
        </section>

        {/* Quick Demo Footer */}
        <footer className="pt-8 border-t border-[#20222a] flex flex-col sm:flex-row items-center justify-between text-xs text-[#616572] gap-4">
          <p>© 2026 KUJA NA SUPPLY // NAIROBI LOGISTICS CORRIDOR. BUILT FOR INFORMAL ECONOMIES.</p>
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