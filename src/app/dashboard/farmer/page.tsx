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
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e4e9] tactical-grid font-mono flex flex-col selection:bg-blue-600 selection:text-white">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Farmer Header */}
        <div className="bg-[#0e0f13] border-2 border-[#242630] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-blue-400 font-black tracking-wider uppercase mb-1">
              <span className="w-2 h-2 bg-blue-500 animate-pulse" />
              <span>TERMINAL NODE // FARM_GATE_DIRECT_03</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {currentUser.business_name}
            </h1>
            <p className="text-xs text-[#9497a1] mt-0.5">
              LOC: {currentUser.address} • PHONE: {currentUser.phone}
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>[POST FRESH HARVEST LOT]</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">AWAITING PICKUP DISPATCH</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{pendingOrders.length}</p>
          </div>
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">ACTIVE HARVEST LOTS</span>
            <p className="text-2xl font-black text-white mt-1">{myListings.length}</p>
          </div>
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">DIRECT DELIVERIES</span>
            <p className="text-2xl font-black text-white mt-1">{completedOrders.length}</p>
          </div>
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">BODA CARRIER REACH</span>
            <p className="text-2xl font-black text-blue-400 mt-1">40 KM</p>
          </div>
        </div>

        {/* Pending Farm Orders */}
        {pendingOrders.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#242630] pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>KIOSK REQUISITIONS // AWAITING BODA HARVEST PICKUP ({pendingOrders.length})</span>
              </div>
            </div>

            <div className="grid gap-3">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-[#0e0f13] border-2 border-blue-600 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white">REQUISITION #{ord.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-950/40 text-blue-300 border border-blue-500/40 uppercase">
                        FARM GATE PICKUP
                      </span>
                    </div>

                    <p className="text-sm font-bold text-white">
                      {ord.retailer?.business_name || 'Retailer'}: {ord.quantity} {ord.product?.unit} {ord.product?.name}
                    </p>
                    <p className="text-xs text-[#9497a1]">
                      DESTINATION: {ord.delivery_address}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#22242c] pt-3 md:pt-0 md:pl-4">
                    <div className="text-right">
                      <span className="text-[10px] text-[#616572] uppercase block">FARM GATE PAYOUT</span>
                      <span className="text-lg font-black text-white">
                        KSh {ord.total_amount?.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => supplierConfirmOrder(ord.id)}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider transition-colors"
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
        <section className="bg-[#0e0f13] border border-[#242430] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c1e26] pb-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              ACTIVE HARVEST LOTS // DIRECT FARM GATE RATES
            </h2>
            <span className="text-[10px] text-[#616572]">NO BROKER MARKUPS</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-[#616572] uppercase border-b border-[#20222a]">
                  <th className="pb-2 font-bold">CROP</th>
                  <th className="pb-2 font-bold">CATEGORY</th>
                  <th className="pb-2 font-bold">FARM GATE RATE</th>
                  <th className="pb-2 font-bold">HARVEST ON HAND</th>
                  <th className="pb-2 font-bold text-right">CALIBRATE RATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181a22]">
                {myListings.map((list) => (
                  <tr key={list.id} className="hover:bg-[#12141c] transition-colors">
                    <td className="py-3 font-bold text-white uppercase">
                      {list.product?.name}
                    </td>
                    <td className="py-3 text-[11px] text-[#9497a1]">{list.product?.category}</td>
                    <td className="py-3">
                      <span className="font-black text-blue-400 text-sm">
                        KSh {list.price_per_unit}
                      </span>
                      <span className="text-[10px] text-[#616572]">/{list.unit}</span>
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
                          className="px-2 py-0.5 bg-[#14151a] hover:bg-[#1e2028] text-white border border-[#262832] text-[10px] font-bold"
                        >
                          -5 KSH
                        </button>
                        <button
                          onClick={() => updateListing(list.id, { price_per_unit: list.price_per_unit + 5 })}
                          className="px-2 py-0.5 bg-[#14151a] hover:bg-[#1e2028] text-white border border-[#262832] text-[10px] font-bold"
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
          <div className="bg-[#0b0c10] border-2 border-[#262832] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#20222a]">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                POST HARVEST LOT // FARM GATE
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#9497a1] hover:text-white px-2 py-1 text-xs border border-[#22242c]"
              >
                [ESC]
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] text-[#9497a1] uppercase block mb-1">Crop Type:</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full bg-[#111216] border border-[#262834] text-white py-2 px-3 font-bold"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#9497a1] uppercase block mb-1">Farm Gate Rate (KSh):</label>
                <input
                  type="number"
                  min="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#111216] border border-[#262834] text-white py-2 px-3 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#9497a1] uppercase block mb-1">Harvest Lot Quantity:</label>
                <input
                  type="number"
                  min="5"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 5)}
                  className="w-full bg-[#111216] border border-[#262834] text-white py-2 px-3 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#20222a]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-[#9497a1] hover:text-white"
                >
                  [CANCEL]
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider"
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
