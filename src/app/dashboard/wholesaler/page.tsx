'use client'

import { useState } from 'react'
import {
  Building2,
  Package,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  TrendingUp,
  MapPin,
  AlertCircle,
  Truck,
  Terminal,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { DemoRoleSwitcher } from '@/components/DemoRoleSwitcher'
import { SupplierListing } from '@/types'

export default function WholesalerDashboard() {
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
  const [newProductId, setNewProductId] = useState('prod-1')
  const [newPrice, setNewPrice] = useState(50)
  const [newStock, setNewStock] = useState(500)
  const [newRadius, setNewRadius] = useState(25)

  const myListings = listings.filter((l) => l.supplier_id === currentUser.id || l.supplier?.role === 'wholesaler')

  const myOrders = orders.filter(
    (o) => o.supplier_id === currentUser.id || o.supplier?.role === 'wholesaler'
  )

  const pendingOrders = myOrders.filter((o) => o.status === 'pending')
  const activeOrders = myOrders.filter((o) => ['confirmed', 'assigned', 'picked_up', 'in_transit'].includes(o.status))
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
      min_order_quantity: 10,
      unit: product.unit,
      is_active: true,
      location: currentUser.location,
      delivery_radius_km: newRadius,
      delivery_fee_per_km: 50,
      product,
      supplier: currentUser,
      distance_km: 3.2,
      total_delivery_fee: 160,
    })

    setIsAddModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e4e9] tactical-grid font-mono flex flex-col selection:bg-blue-600 selection:text-white">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Wholesaler Header */}
        <div className="bg-[#0e0f13] border-2 border-[#242630] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-blue-400 font-black tracking-wider uppercase mb-1">
              <span className="w-2 h-2 bg-blue-500 animate-pulse" />
              <span>TERMINAL NODE // WHOLESALE_DEPOT_02</span>
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
            <span>[LIST BULK COMMODITY]</span>
          </button>
        </div>

        {/* Tactical Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">PENDING REQUISITIONS</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{pendingOrders.length}</p>
          </div>
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">CARRIERS IN TRANSIT</span>
            <p className="text-2xl font-black text-white mt-1">{activeOrders.length}</p>
          </div>
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">FULFILLED INVOICES</span>
            <p className="text-2xl font-black text-white mt-1">{completedOrders.length}</p>
          </div>
          <div className="p-4 bg-[#0e0f13] border border-[#22242b]">
            <span className="text-[10px] text-[#9497a1] uppercase block font-bold">ACTIVE DEPOT LISTINGS</span>
            <p className="text-2xl font-black text-blue-400 mt-1">{myListings.length}</p>
          </div>
        </div>

        {/* Incoming Kiosk Requisitions Action Queue */}
        {pendingOrders.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#242630] pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>INCOMING KIOSK REQUISITIONS // {pendingOrders.length} AWAITING DISPATCH</span>
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
                        ACTION REQUIRED
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
                      <span className="text-[10px] text-[#616572] uppercase block">INVOICE AMOUNT</span>
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

        {/* Wholesale Inventory & Dynamic Rate Controls */}
        <section className="bg-[#0e0f13] border border-[#242630] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c1e26] pb-3">
            <h2 className="text-sm font-black text-white uppercase tracking-wider">
              DEPOT COMMODITY LISTINGS & RATE CONTROL
            </h2>
            <span className="text-[10px] text-[#616572]">LIVE B2B WHOLESALE RATES</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-[#616572] uppercase border-b border-[#20222a]">
                  <th className="pb-2 font-bold">COMMODITY</th>
                  <th className="pb-2 font-bold">CATEGORY</th>
                  <th className="pb-2 font-bold">WHOLESALE RATE</th>
                  <th className="pb-2 font-bold">DEPOT TONNAGE / STOCK</th>
                  <th className="pb-2 font-bold">TRANSIT RADIUS</th>
                  <th className="pb-2 font-bold text-right">PRICE CALIBRATION</th>
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
                    <td className="py-3 text-[11px] text-[#9497a1]">{list.delivery_radius_km} KM</td>
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

      {/* Add Produce Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 font-mono">
          <div className="bg-[#0d0d12] border-2 border-[#333342] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#242430]">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                LIST BULK COMMODITY // DEPOT ADD
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
                <label className="text-[10px] text-[#777785] uppercase block mb-1">Select Commodity:</label>
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
                <label className="text-[10px] text-[#777785] uppercase block mb-1">Bulk Unit Rate (KSh):</label>
                <input
                  type="number"
                  min="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#14141c] border border-[#282838] text-white py-2 px-3 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#777785] uppercase block mb-1">Available Depot Volume:</label>
                <input
                  type="number"
                  min="10"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 10)}
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
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-wider"
                >
                  COMMIT LISTING »
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
