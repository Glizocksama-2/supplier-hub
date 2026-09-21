'use client'

import { useState } from 'react'
import {
  Bike,
  Navigation,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  ArrowRight,
  Phone,
  ShieldCheck,
  ChevronRight,
  PackageCheck,
  Compass,
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

  // Find assignments for this rider
  const myAssignments = assignments.filter(
    (a) => a.boda_rider_id === currentUser.id || a.rider?.role === 'boda_rider'
  )

  // Dispatches currently offered to rider
  const offeredJobs = myAssignments.filter((a) => a.status === 'offered')

  // Active accepted/in-progress delivery
  const activeJobs = myAssignments.filter((a) =>
    ['accepted', 'picked_up', 'in_transit'].includes(a.status)
  )

  // Completed deliveries
  const completedJobs = myAssignments.filter((a) => a.status === 'delivered')

  const totalEarnings = completedJobs.reduce((acc, curr) => acc + (curr.delivery_fee || 150), 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Boda Rider Profile Header */}
        <div className="bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Bike className="w-3.5 h-3.5" />
              <span>Boda Express Delivery Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{currentUser.full_name}</h1>
            <p className="text-amber-100 text-sm mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>{currentUser.address} • Phone: {currentUser.phone}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 text-green-200 border border-green-400/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Online & Ready for Dispatches
            </span>
          </div>
        </div>

        {/* Rider Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Today's Delivery Earnings</span>
            <p className="text-2xl font-black text-amber-600 mt-1">KSh {totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Completed Trips</span>
            <p className="text-2xl font-black text-green-600 mt-1">{completedJobs.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Offered Dispatches</span>
            <p className="text-2xl font-black text-orange-600 mt-1">{offeredJobs.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Boda Rider Rating</span>
            <p className="text-2xl font-black text-blue-600 mt-1">★ 4.9</p>
          </div>
        </div>

        {/* Live Incoming Dispatch Offers */}
        {offeredJobs.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500 animate-ping" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Navigation className="w-5 h-5 text-orange-500" />
                Incoming Delivery Request ({offeredJobs.length} available)
              </h2>
            </div>

            <div className="grid gap-4">
              {offeredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-900 border-2 border-orange-500/50 rounded-3xl p-6 shadow-md hover:border-orange-500 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 text-xs font-bold">
                        NEW TRIP OFFER
                      </span>
                      <span className="text-xs text-gray-400">Assignment #{job.id}</span>
                    </div>

                    {/* Route Details */}
                    <div className="grid sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">1. PICKUP POINT</span>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                          {job.order?.supplier?.business_name || 'Supplier'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {job.order?.supplier?.address || 'Nairobi Depot'}
                        </p>
                        <span className="text-[11px] text-green-600 font-semibold block mt-1">
                          Cargo: {job.order?.quantity} {job.order?.product?.unit} {job.order?.product?.name}
                        </span>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] uppercase font-bold text-gray-400 block">2. DELIVERY DESTINATION</span>
                        <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                          {job.order?.retailer?.business_name || 'Retailer Kiosk'}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {job.order?.delivery_address || 'Kipande Road, Westlands'}
                        </p>
                        <span className="text-[11px] text-gray-400 block mt-1">
                          Payment: Cash on Delivery / M-Pesa Counter
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Pay & Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 lg:border-l lg:border-gray-100 dark:lg:border-gray-800 lg:pl-6 min-w-[200px]">
                    <div className="text-center sm:text-left lg:text-center">
                      <span className="text-xs text-gray-400 block">Trip Earnings</span>
                      <span className="text-3xl font-black text-green-600 dark:text-green-400">
                        KSh {job.delivery_fee}
                      </span>
                      <span className="text-xs text-gray-500 block mt-0.5">
                        Distance: {job.distance_km} km
                      </span>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => bodaDeclineAssignment(job.id)}
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-bold transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => bodaAcceptAssignment(job.id)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold shadow-md shadow-green-600/20 transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Accept Job</span>
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
          <section className="bg-white dark:bg-gray-900 border-2 border-indigo-500/50 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500 animate-pulse" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Active Delivery in Progress
                </h2>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                Turn-by-Turn Navigation
              </span>
            </div>

            {activeJobs.map((job) => {
              const status = job.status
              return (
                <div key={job.id} className="space-y-6">
                  {/* Progress Tracker */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div
                      className={`p-3 rounded-2xl border ${
                        status === 'accepted'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                      }`}
                    >
                      <span className="block text-base mb-1">1. 📦</span>
                      <span>Heading to Pickup</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl border ${
                        status === 'picked_up'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                      }`}
                    >
                      <span className="block text-base mb-1">2. 🛵</span>
                      <span>Goods Picked Up</span>
                    </div>

                    <div
                      className={`p-3 rounded-2xl border ${
                        status === 'in_transit'
                          ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                      }`}
                    >
                      <span className="block text-base mb-1">3. 🏁</span>
                      <span>In Transit to Kiosk</span>
                    </div>
                  </div>

                  {/* Summary & Live Action */}
                  <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        Delivery for Order #{job.order_id}: {job.order?.quantity} {job.order?.product?.unit} {job.order?.product?.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        From: <span className="font-semibold">{job.order?.supplier?.business_name}</span> → To: <span className="font-semibold">{job.order?.retailer?.business_name}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => bodaAdvanceTrip(job.id)}
                      className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      {status === 'accepted' && <span>Confirm Picked Up from Supplier</span>}
                      {status === 'picked_up' && <span>Start Transit to Retailer</span>}
                      {status === 'in_transit' && <span>Mark as Delivered & Collect Pay</span>}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {/* Completed Trips History */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white pb-4 border-b border-gray-100 dark:border-gray-800">
            Completed Trips History
          </h2>

          <div className="divide-y divide-gray-100 dark:divide-gray-800 mt-4">
            {completedJobs.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No deliveries completed yet today.</p>
            ) : (
              completedJobs.map((job) => (
                <div key={job.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 flex items-center justify-center font-bold text-xs">
                      ✓
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {job.order?.retailer?.business_name || 'Retailer'}: {job.order?.quantity} {job.order?.product?.unit} {job.order?.product?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Distance: {job.distance_km} km • Delivered {job.delivered_at ? new Date(job.delivered_at).toLocaleTimeString() : 'Today'}
                      </p>
                    </div>
                  </div>

                  <span className="font-bold text-sm text-green-600 dark:text-green-400">
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
