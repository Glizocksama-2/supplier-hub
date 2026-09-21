'use client'

import { useState } from 'react'
import {
  Bike,
  Navigation,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  Compass,
  Radio,
  MapPin,
  Terminal,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { DemoRoleSwitcher } from '@/components/DemoRoleSwitcher'
import { BodaAssignment } from '@/types'

export default function BodaRiderDashboard() {
  const {
    currentUser,
    assignments,
    bodaAcceptAssignment,
    bodaDeclineAssignment,
    bodaAdvanceTrip,
  } = useAppStore()

  const myAssignments = assignments.filter(
    (a) => a.boda_rider_id === currentUser.id || a.rider?.role === 'boda_rider'
  )

  const offeredJobs = myAssignments.filter((a) => a.status === 'offered')
  const activeJobs = myAssignments.filter((a) =>
    ['accepted', 'picked_up', 'in_transit'].includes(a.status)
  )
  const completedJobs = myAssignments.filter((a) => a.status === 'delivered')

  const totalEarnings = completedJobs.reduce((acc, curr) => acc + (curr.delivery_fee || 150), 0)

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e4e9] tactical-grid font-mono flex flex-col selection:bg-blue-600 selection:text-white">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Rider Helmet HUD Header */}
        <div className="bg-[#0e0f13] border-2 border-[#242630] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-blue-400 font-black tracking-wider uppercase mb-1">
              <span className="w-2 h-2 bg-blue-500 animate-ping" />
              <span>TERMINAL NODE // BODA_DISPATCH_RADAR_04</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {currentUser.full_name}
            </h1>
            <p className="text-xs text-[#9497a1] mt-0.5">
              STAGE: {currentUser.address} • MOTORCYCLE: KMCE 492X • PHONE: {currentUser.phone}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-950/40 border border-blue-600/40 text-blue-300 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 bg-blue-500 animate-pulse" />
              CARRIER ONLINE // GPS ACTIVE
            </span>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">TODAY'S TRIP EARNINGS</span>
            <p className="text-3xl font-black text-white mt-1">KSh {totalEarnings.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">DISPATCH OFFERS</span>
            <p className="text-3xl font-black text-blue-400 mt-1">{offeredJobs.length}</p>
          </div>
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">DELIVERIES COMPLETED</span>
            <p className="text-3xl font-black text-white mt-1">{completedJobs.length}</p>
          </div>
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">CARRIER RATING</span>
            <p className="text-3xl font-black text-blue-400 mt-1">4.9 ★</p>
          </div>
        </div>

        {/* Incoming Live Dispatch Offers */}
        {offeredJobs.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#242630] pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                <Radio className="w-4 h-4 text-blue-400 animate-pulse" />
                <span>INCOMING DISPATCH RADAR // CARGO TRIP AVAILABLE ({offeredJobs.length})</span>
              </div>
              <span className="text-[10px] bg-blue-950/40 text-blue-300 border border-blue-500/40 px-2 py-0.5 font-bold uppercase">
                DIRECT TRANSIT
              </span>
            </div>

            <div className="grid gap-3">
              {offeredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-[#0e0f13] border-2 border-blue-600 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-blue-600 text-white font-black uppercase text-[10px]">
                        DISPATCH OFFER
                      </span>
                      <span className="text-white font-bold">REQUISITION #{job.order_id}</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-[#111216] border border-[#22242b]">
                        <span className="text-[10px] uppercase font-bold text-blue-400 block">01 // PICKUP DEPOT</span>
                        <p className="text-sm font-black text-white mt-0.5">
                          {job.order?.supplier?.business_name}
                        </p>
                        <p className="text-[#9497a1] text-[11px]">
                          LOC: {job.order?.supplier?.address}
                        </p>
                        <span className="text-blue-400 text-[11px] font-bold block mt-1">
                          CARGO: {job.order?.quantity} {job.order?.product?.unit} {job.order?.product?.name}
                        </span>
                      </div>

                      <div className="p-3 bg-[#111216] border border-[#22242b]">
                        <span className="text-[10px] uppercase font-bold text-white block">02 // DROP-OFF DESTINATION</span>
                        <p className="text-sm font-black text-white mt-0.5">
                          {job.order?.retailer?.business_name}
                        </p>
                        <p className="text-[#9497a1] text-[11px]">
                          LOC: {job.order?.delivery_address}
                        </p>
                        <span className="text-[#616572] text-[11px] block mt-1">
                          PAYOUT: Cash on delivery / Counter till
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:border-l lg:border-[#22242b] lg:pl-6 min-w-[220px]">
                    <div className="text-center sm:text-left lg:text-center">
                      <span className="text-[10px] text-[#616572] uppercase block">BODA TRIP REVENUE</span>
                      <span className="text-3xl font-black text-white">
                        KSh {job.delivery_fee}
                      </span>
                      <span className="text-[11px] text-[#9497a1] block mt-0.5">
                        DISTANCE: {job.distance_km} KM
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => bodaDeclineAssignment(job.id)}
                        className="flex-1 py-3 border border-[#22242b] text-[#9497a1] hover:text-white hover:bg-[#121318] text-xs font-black uppercase tracking-wider transition-colors"
                      >
                        [DECLINE]
                      </button>
                      <button
                        onClick={() => bodaAcceptAssignment(job.id)}
                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-md"
                      >
                        ACCEPT TRIP »
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Active In-Progress Delivery */}
        {activeJobs.length > 0 && (
          <section className="bg-[#0e0f13] border-2 border-blue-600 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#20222a] pb-3">
              <div className="flex items-center gap-2 text-xs font-black text-blue-400 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-blue-400 animate-spin" />
                <span>ACTIVE TRANSIT IN PROGRESS // ROUTE ENFORCED</span>
              </div>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-600 px-2 py-0.5 font-bold uppercase">
                TELEMETRY LIVE
              </span>
            </div>

            {activeJobs.map((job) => {
              const status = job.status
              return (
                <div key={job.id} className="space-y-5">
                  {/* Step Indicators */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div
                      className={`p-3 border text-center ${
                        status === 'accepted'
                          ? 'bg-blue-950/60 border-blue-500 text-white font-black'
                          : 'bg-[#101116] border-[#22242b] text-[#616572]'
                      }`}
                    >
                      <span className="block text-[10px] text-blue-400">STAGE 01</span>
                      <span>EN ROUTE TO PICKUP</span>
                    </div>

                    <div
                      className={`p-3 border text-center ${
                        status === 'picked_up'
                          ? 'bg-blue-950/60 border-blue-500 text-white font-black'
                          : 'bg-[#101116] border-[#22242b] text-[#616572]'
                      }`}
                    >
                      <span className="block text-[10px] text-blue-400">STAGE 02</span>
                      <span>CARGO LOADED</span>
                    </div>

                    <div
                      className={`p-3 border text-center ${
                        status === 'in_transit'
                          ? 'bg-blue-950/60 border-blue-500 text-white font-black'
                          : 'bg-[#101116] border-[#22242b] text-[#616572]'
                      }`}
                    >
                      <span className="block text-[10px] text-blue-400">STAGE 03</span>
                      <span>FINAL KIOSK DROP-OFF</span>
                    </div>
                  </div>

                  <div className="p-4 bg-[#111216] border border-[#22242b] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs space-y-1">
                      <p className="font-black text-white text-sm uppercase">
                        CARGO: {job.order?.quantity} {job.order?.product?.unit} {job.order?.product?.name}
                      </p>
                      <p className="text-[#9497a1]">
                        FROM: {job.order?.supplier?.business_name} → TO: {job.order?.retailer?.business_name}
                      </p>
                      <span className="text-blue-400 font-bold block">
                        PAYOUT: KSH {job.delivery_fee} ON COMPLETION
                      </span>
                    </div>

                    <button
                      onClick={() => bodaAdvanceTrip(job.id)}
                      className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-colors"
                    >
                      {status === 'accepted' && <span>[CONFIRM CARGO PICKED UP]</span>}
                      {status === 'picked_up' && <span>[DEPART TOWARD KIOSK]</span>}
                      {status === 'in_transit' && <span>[CONFIRM DROP-OFF & COLLECT PAY] »</span>}
                    </button>
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {/* Completed Trips */}
        <section className="bg-[#0e0f13] border border-[#242630] p-5 space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-wider border-b border-[#1c1e26] pb-3">
            COMPLETED CARRIER LOGS // EARNINGS SETTLED
          </h2>

          <div className="divide-y divide-[#181a22]">
            {completedJobs.length === 0 ? (
              <p className="text-xs text-[#616572] py-4 text-center">NO TRIPS COMPLETED TODAY</p>
            ) : (
              completedJobs.map((job) => (
                <div key={job.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <p className="font-bold text-white uppercase">
                      {job.order?.retailer?.business_name}: {job.order?.quantity} {job.order?.product?.unit} {job.order?.product?.name}
                    </p>
                    <p className="text-[11px] text-[#9497a1]">
                      DISTANCE: {job.distance_km} KM • COMPLETED {job.delivered_at ? new Date(job.delivered_at).toLocaleTimeString() : 'TODAY'}
                    </p>
                  </div>

                  <span className="font-black text-white text-sm">
                    +KSh {job.delivery_fee}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
