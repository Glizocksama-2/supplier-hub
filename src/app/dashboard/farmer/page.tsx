'use client'

import { useState } from 'react'
import {
  Sprout,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin,
  Terminal,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { DemoRoleSwitcher } from '@/components/DemoRoleSwitcher'
import { SupplierListing } from '@/types'

export default function FarmerDashboard() {
  const {
    currentUser,
    listings,
    orders,
    products,
    updateListing,
    addListing,
    supplierConfirmOrder,
  } = useAppStore()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProductId, setNewProductId] = useState('prod-4') // Tomatoes
  const [newPrice, setNewPrice] = useState(60)
  const [newStock, setNewStock] = useState(400)

  const myListings = listings.filter(
    (l) => l.supplier_id === currentUser.id || l.supplier?.role === 'farmer'
  )

  const myOrders = orders.filter(
    (o) => o.supplier_id === currentUser.id || o.supplier?.role === 'farmer'
  )

  const pendingOrders = myOrders.filter((o) => o.status === 'pending')
  const completedOrders = myOrders.filter((o) => o.status === 'delivered')

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = products.find((p) => p.id === newProductId)
    if (!product) return

    addListing({
      supplier_id: currentUser.id,
      product_id: newProductId,
      price_per_unit: newPrice,
      available_stock: newStock,
      min_order_quantity: 5,
      unit: product.unit,
      is_active: true,
      location: currentUser.location,
      delivery_radius_km: 35,
      delivery_fee_per_km: 45,
      product,
      supplier: currentUser,
      distance_km: 6.8,
      total_delivery_fee: 306,
    })

    setIsAddModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 tactical-grid font-mono flex flex-col selection:bg-orange-600 selection:text-white">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Farmer Header */}
        <div className="bg-white border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-orange-600 font-bold tracking-wider uppercase mb-1">
              <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
              <span>TERMINAL NODE // FARM_GATE_DIRECT_03</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
              {currentUser.business_name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              LOC: {currentUser.address} • PHONE: {currentUser.phone}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>[POST FRESH HARVEST LOT]</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">AWAITING PICKUP DISPATCH</span>
            <p className="text-2xl font-black text-orange-600 mt-1">{pendingOrders.length}</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">ACTIVE HARVEST LOTS</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{myListings.length}</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">DIRECT DELIVERIES</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{completedOrders.length}</p>
          </div>
          <div className="p-4 bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] text-slate-500 uppercase block font-bold">BODA CARRIER REACH</span>
            <p className="text-2xl font-black text-orange-600 mt-1">40 KM</p>
          </div>
        </div>

        {/* Pending Farm Orders */}
        {pendingOrders.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>KIOSK REQUISITIONS // AWAITING BODA HARVEST PICKUP ({pendingOrders.length})</span>
              </div>
            </div>

            <div className="grid gap-3">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border-2 border-orange-500 shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">REQUISITION #{ord.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-orange-50 text-orange-700 border border-orange-200 uppercase">
                        FARM GATE PICKUP
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900">
                      {ord.retailer?.business_name || 'Retailer'}: {ord.quantity} {ord.product?.unit} {ord.product?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      DESTINATION: {ord.delivery_address}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block">FARM GATE PAYOUT</span>
                      <span className="text-lg font-black text-slate-900">
                        KSh {ord.total_amount?.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => supplierConfirmOrder(ord.id)}
                      className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider transition-colors shadow-xs"
                    >
                      CONFIRM & DISPATCH BODA »
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Harvest Lots Table */}
        <section className="bg-white border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              ACTIVE HARVEST LOTS // DIRECT FARM GATE RATES
            </h2>
            <span className="text-[10px] text-slate-500">NO BROKER MARKUPS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-slate-500 uppercase border-b border-slate-200">
                  <th className="pb-2 font-bold">CROP</th>
                  <th className="pb-2 font-bold">CATEGORY</th>
                  <th className="pb-2 font-bold">FARM GATE RATE</th>
                  <th className="pb-2 font-bold">HARVEST ON HAND</th>
                  <th className="pb-2 font-bold text-right">CALIBRATE RATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myListings.map((list) => (
                  <tr key={list.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-bold text-slate-900 uppercase">
                      {list.product?.name}
                    </td>
                    <td className="py-3 text-[11px] text-slate-500">{list.product?.category}</td>
                    <td className="py-3">
                      <span className="font-black text-orange-600 text-sm">
                        KSh {list.price_per_unit}
                      </span>
                      <span className="text-[10px] text-slate-500">/{list.unit}</span>
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      {list.available_stock} {list.unit}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateListing(list.id, { price_per_unit: Math.max(10, list.price_per_unit - 5) })
                          }
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-bold transition-colors"
                        >
                          -5 KSH
                        </button>
                        <button
                          onClick={() => updateListing(list.id, { price_per_unit: list.price_per_unit + 5 })}
                          className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-[10px] font-bold transition-colors"
                        >
                          +5 KSH
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Post Harvest Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 font-mono">
          <div className="bg-white border border-slate-200 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                POST HARVEST LOT // FARM GATE
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 px-2 py-1 text-xs border border-slate-200 rounded-xs"
              >
                [ESC]
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-slate-600 uppercase block mb-1 font-bold">Crop Type:</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 py-2 px-3 font-bold focus:border-orange-500 focus:bg-white outline-none"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase block mb-1 font-bold">Farm Gate Rate (KSh):</label>
                <input
                  type="number"
                  min="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 py-2 px-3 font-bold focus:border-orange-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-600 uppercase block mb-1 font-bold">Harvest Lot Quantity:</label>
                <input
                  type="number"
                  min="5"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 5)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 py-2 px-3 font-bold focus:border-orange-500 focus:bg-white outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-slate-500 hover:text-slate-900 font-bold"
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-wider shadow-xs transition-colors"
                >
                  COMMIT HARVEST »
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
