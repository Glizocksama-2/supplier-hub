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
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 tactical-grid font-mono flex flex-col selection:bg-orange-600 selection:text-white">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Rider Helmet HUD Header */}
        <div className="bg-white border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-orange-600 font-bold tracking-wider uppercase mb-1">
              <span className="w-2 h-2 bg-orange-600 rounded-full animate-ping" />
              <span>TERMINAL NODE // BODA_DISPATCH_RADAR_04</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {currentUser.full_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              STAGE: {currentUser.address} • MOTORCYCLE: KMCE 492X • PHONE: {currentUser.phone}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
              CARRIER ONLINE // GPS ACTIVE
            </span>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">TODAY'S TRIP EARNINGS</span>
            <p className="text-3xl font-black text-slate-900 mt-1">KSh {totalEarnings.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">DISPATCH OFFERS</span>
            <p className="text-3xl font-black text-orange-600 mt-1">{offeredJobs.length}</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">DELIVERIES COMPLETED</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{completedJobs.length}</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">CARRIER RATING</span>
            <p className="text-3xl font-black text-orange-600 mt-1">4.9 ★</p>
          </div>
        </div>

        {/* Incoming Live Dispatch Offers */}
        {offeredJobs.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <Radio className="w-4 h-4 text-orange-600 animate-pulse" />
                <span>INCOMING DISPATCH RADAR // CARGO TRIP AVAILABLE ({offeredJobs.length})</span>
              </div>
              <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 font-bold uppercase">
                DIRECT TRANSIT
              </span>
            </div>

            <div className="grid gap-3">
              {offeredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border-2 border-orange-500 shadow-xs p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 bg-orange-600 text-white font-black uppercase text-[10px]">
                        DISPATCH OFFER
                      </span>
                      <span className="text-slate-900 font-bold">REQUISITION #{job.order_id}</span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-orange-600 block">01 // PICKUP DEPOT</span>
                        <p className="text-sm font-black text-slate-900 mt-0.5">
                          {job.order?.supplier?.business_name}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          LOC: {job.order?.supplier?.address}
                        </p>
                        <span className="text-orange-700 text-[11px] font-bold block mt-1">
                          CARGO: {job.order?.quantity} {job.order?.product?.unit} {job.order?.product?.name}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-700 block">02 // DROP-OFF DESTINATION</span>
                        <p className="text-sm font-black text-slate-900 mt-0.5">
                          {job.order?.retailer?.business_name}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          LOC: {job.order?.delivery_address}
                        </p>
                        <span className="text-slate-500 text-[11px] block mt-1">
                          PAYOUT: Cash on delivery / Counter till
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:border-l lg:border-slate-200 lg:pl-6 min-w-[220px]">
                    <div className="text-center sm:text-left lg:text-center">
                      <span className="text-[10px] text-slate-500 uppercase block">BODA TRIP REVENUE</span>
                      <span className="text-3xl font-black text-slate-900">
                        KSh {job.delivery_fee}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">
                        DISTANCE: {job.distance_km} KM
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => bodaDeclineAssignment(job.id)}
                        className="flex-1 py-3 border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-black uppercase tracking-wider transition-colors"
                      >
                        [DECLINE]
                      </button>
                      <button
                        onClick={() => bodaAcceptAssignment(job.id)}
                        className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider transition-colors shadow-xs"
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
          <section className="bg-white border-2 border-orange-500 shadow-xs p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-wider">
                <Compass className="w-4 h-4 text-orange-600 animate-spin" />
                <span>ACTIVE TRANSIT IN PROGRESS // ROUTE ENFORCED</span>
              </div>
              <span className="text-[10px] bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 font-bold uppercase">
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
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="block text-[10px] text-orange-600 font-bold">STAGE 01</span>
                      <span>EN ROUTE TO PICKUP</span>
                    </div>

                    <div
                      className={`p-3 border text-center ${
                        status === 'picked_up'
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="block text-[10px] text-orange-600 font-bold">STAGE 02</span>
                      <span>CARGO LOADED</span>
                    </div>

                    <div
                      className={`p-3 border text-center ${
                        status === 'in_transit'
                          ? 'bg-orange-50 border-orange-500 text-orange-950 font-black'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <span className="block text-[10px] text-orange-600 font-bold">STAGE 03</span>
                      <span>FINAL KIOSK DROP-OFF</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-xs space-y-1">
                      <p className="font-black text-slate-900 text-sm uppercase">
                        CARGO: {job.order?.quantity} {job.order?.product?.unit} {job.order?.product?.name}
                      </p>
                      <p className="text-slate-500">
                        FROM: {job.order?.supplier?.business_name} → TO: {job.order?.retailer?.business_name}
                      </p>
                      <span className="text-orange-600 font-bold block">
                        PAYOUT: KSH {job.delivery_fee} ON COMPLETION
                      </span>
                    </div>

                    <button
                      onClick={() => bodaAdvanceTrip(job.id)}
                      className="px-6 py-3.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-xs"
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
        <section className="bg-white border border-slate-200 shadow-xs p-5 space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">
            COMPLETED CARRIER LOGS // EARNINGS SETTLED
          </h2>

          <div className="divide-y divide-slate-100">
            {completedJobs.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">NO TRIPS COMPLETED TODAY</p>
            ) : (
              completedJobs.map((job) => (
                <div key={job.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 uppercase">
                      {job.order?.retailer?.business_name}: {job.order?.quantity} {job.order?.product?.unit} {job.order?.product?.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      DISTANCE: {job.distance_km} KM • COMPLETED {job.delivered_at ? new Date(job.delivered_at).toLocaleTimeString() : 'TODAY'}
                    </p>
                  </div>

                  <span className="font-black text-slate-900 text-sm">
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
