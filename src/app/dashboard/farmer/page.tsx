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
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e2e8] tactical-grid font-mono flex flex-col selection:bg-[#d2ff00] selection:text-black">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Farmer Header */}
        <div className="bg-[#0f0f14] border-2 border-[#262632] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-black tracking-wider uppercase mb-1">
              <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
              <span>TERMINAL NODE // FARM_GATE_DIRECT_03</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {currentUser.business_name}
            </h1>
            <p className="text-xs text-[#7d7d8c] mt-0.5">
              LOC: {currentUser.address} • PHONE: {currentUser.phone}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>[POST FRESH HARVEST LOT]</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-[#0e0e13] border border-[#22222a]">
            <span className="text-[10px] text-[#777785] uppercase block font-bold">AWAITING PICKUP DISPATCH</span>
            <p className="text-2xl font-black text-[#ff6b00] mt-1">{pendingOrders.length}</p>
          </div>
          <div className="p-4 bg-[#0e0e13] border border-[#22222a]">
            <span className="text-[10px] text-[#777785] uppercase block font-bold">ACTIVE HARVEST LOTS</span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{myListings.length}</p>
          </div>
          <div className="p-4 bg-[#0e0e13] border border-[#22222a]">
            <span className="text-[10px] text-[#777785] uppercase block font-bold">DIRECT DELIVERIES</span>
            <p className="text-2xl font-black text-[#d2ff00] mt-1">{completedOrders.length}</p>
          </div>
          <div className="p-4 bg-[#0e0e13] border border-[#22222a]">
            <span className="text-[10px] text-[#777785] uppercase block font-bold">BODA CARRIER REACH</span>
            <p className="text-2xl font-black text-white mt-1">40 KM</p>
          </div>
        </div>

        {/* Pending Farm Orders */}
        {pendingOrders.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-emerald-500/30 pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>KIOSK REQUISITIONS // AWAITING BODA HARVEST PICKUP ({pendingOrders.length})</span>
              </div>
            </div>

            <div className="grid gap-3">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#0a120c] border-2 border-emerald-500 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">REQUISITION #{ord.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                        FARM GATE PICKUP
                      </span>
                    </div>

                    <p className="text-sm font-bold text-white">
                      {ord.retailer?.business_name || 'Retailer'}: {ord.quantity} {ord.product?.unit} {ord.product?.name}
                    </p>
                    <p className="text-xs text-[#888894]">
                      DESTINATION: {ord.delivery_address}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#1a2d1d] pt-3 md:pt-0 md:pl-4">
                    <div className="text-right">
                      <span className="text-[10px] text-[#777785] uppercase block">FARM GATE PAYOUT</span>
                      <span className="text-lg font-black text-emerald-400">
                        KSh {ord.total_amount?.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => supplierConfirmOrder(ord.id)}
                      className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider transition-colors"
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
        <section className="bg-[#0e0e13] border border-[#242430] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c1c24] pb-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              ACTIVE HARVEST LOTS // DIRECT FARM GATE RATES
            </h2>
            <span className="text-[10px] text-[#666675]">NO BROKER MARKUPS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-[#666675] uppercase border-b border-[#20202a]">
                  <th className="pb-2 font-bold">CROP</th>
                  <th className="pb-2 font-bold">CATEGORY</th>
                  <th className="pb-2 font-bold">FARM GATE RATE</th>
                  <th className="pb-2 font-bold">HARVEST ON HAND</th>
                  <th className="pb-2 font-bold text-right">CALIBRATE RATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181820]">
                {myListings.map((list) => (
                  <tr key={list.id} className="hover:bg-[#14141c] transition-colors">
                    <td className="py-3 font-bold text-white uppercase">
                      {list.product?.name}
                    </td>
                    <td className="py-3 text-[11px] text-[#787884]">{list.product?.category}</td>
                    <td className="py-3">
                      <span className="font-black text-emerald-400 text-sm">
                        KSh {list.price_per_unit}
                      </span>
                      <span className="text-[10px] text-[#666675]">/{list.unit}</span>
                    </td>
                    <td className="py-3 font-bold text-white">
                      {list.available_stock} {list.unit}
                    </td>
                    <td className="py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() =>
                            updateListing(list.id, { price_per_unit: Math.max(10, list.price_per_unit - 5) })
                          }
                          className="px-2 py-0.5 bg-[#181820] hover:bg-[#262634] text-white border border-[#282836] text-[10px] font-bold"
                        >
                          -5 KSH
                        </button>
                        <button
                          onClick={() => updateListing(list.id, { price_per_unit: list.price_per_unit + 5 })}
                          className="px-2 py-0.5 bg-[#181820] hover:bg-[#262634] text-white border border-[#282836] text-[10px] font-bold"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 font-mono">
          <div className="bg-[#0d0d12] border-2 border-[#333342] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242430]">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                POST HARVEST LOT // FARM GATE
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#666675] hover:text-white px-2 py-1 text-xs border border-[#252530]"
              >
                [ESC]
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-[#777785] uppercase block mb-1">Crop Type:</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full bg-[#14141c] border border-[#282838] text-white py-2 px-3 font-bold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#777785] uppercase block mb-1">Farm Gate Rate (KSh):</label>
                <input
                  type="number"
                  min="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#14141c] border border-[#282838] text-white py-2 px-3 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#777785] uppercase block mb-1">Harvest Lot Quantity:</label>
                <input
                  type="number"
                  min="5"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 5)}
                  className="w-full bg-[#14141c] border border-[#282838] text-white py-2 px-3 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#22222a]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-[#777785] hover:text-white"
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase"
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
