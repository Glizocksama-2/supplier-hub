'use client'

import { useState } from 'react'
import {
  Leaf,
  Sprout,
  Package,
  Clock,
  CheckCircle2,
  Bike,
  Plus,
  TrendingUp,
  MapPin,
  Calendar,
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

  // Filter listings for this farmer
  const myListings = listings.filter(
    (l) => l.supplier_id === currentUser.id || l.supplier?.role === 'farmer'
  )

  // Filter orders where supplier is farmer
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Farmer Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Sprout className="w-3.5 h-3.5" />
              <span>Direct Farm Portal (Zero Middleman)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{currentUser.business_name}</h1>
            <p className="text-emerald-100 text-sm mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-300" />
              <span>{currentUser.address} • Contact: {currentUser.phone}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs flex items-center gap-2 shadow-sm hover:bg-emerald-50 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-700" />
              <span>Post New Farm Harvest</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Pending Farm Orders</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingOrders.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Harvest Lots Active</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{myListings.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Delivered to Retailers</span>
            <p className="text-2xl font-black text-green-600 mt-1">{completedOrders.length}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-xs">
            <span className="text-xs text-gray-500 font-medium">Boda Network Reach</span>
            <p className="text-2xl font-black text-teal-600 mt-1">40 km</p>
          </div>
        </div>

        {/* Pending Farm Orders */}
        {pendingOrders.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                Retailers Requesting Farm Produce ({pendingOrders.length})
              </h2>
            </div>

            <div className="grid gap-4">
              {pendingOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-emerald-400/50 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-gray-900 dark:text-white">
                        Order #{ord.id}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        FARM PICKUP REQUEST
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">
                      {ord.retailer?.business_name || 'Retailer'}: {ord.quantity} {ord.product?.unit} {ord.product?.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Delivery to: {ord.delivery_address}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">
                        KSh {ord.total_amount?.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 block">
                        KSh {ord.unit_price}/{ord.product?.unit} (Farm Gate Price)
                      </span>
                    </div>

                    <button
                      onClick={() => supplierConfirmOrder(ord.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Ready for Boda Pickup</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Farm Fresh Harvest Lots */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Harvest Inventory & Farm Gate Rates</h2>
              <p className="text-xs text-gray-500">Fresh organic crops available directly for local kiosk owners</p>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-3 font-semibold">Crop / Produce</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Farm Price</th>
                  <th className="pb-3 font-semibold">Available Harvest</th>
                  <th className="pb-3 font-semibold text-right">Update Harvest</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {myListings.map((list) => (
                  <tr key={list.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3.5 font-bold text-gray-900 dark:text-white">
                      {list.product?.name}
                    </td>
                    <td className="py-3.5 text-xs text-gray-500">{list.product?.category}</td>
                    <td className="py-3.5">
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        KSh {list.price_per_unit}
                      </span>
                      <span className="text-xs text-gray-400">/{list.unit}</span>
                    </td>
                    <td className="py-3.5 font-bold text-gray-700 dark:text-gray-300">
                      {list.available_stock} {list.unit}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            updateListing(list.id, { price_per_unit: Math.max(10, list.price_per_unit - 5) })
                          }
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs hover:bg-gray-200"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => updateListing(list.id, { price_per_unit: list.price_per_unit + 5 })}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs hover:bg-gray-200"
                        >
                          +5
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              List Fresh Farm Crop
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Crop Type</label>
                <select
                  value={newProductId}
                  onChange={(e) => setNewProductId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.category} - {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Farm Rate (KSh / unit)</label>
                <input
                  type="number"
                  min="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">Harvest Lot Quantity</label>
                <input
                  type="number"
                  min="5"
                  value={newStock}
                  onChange={(e) => setNewStock(parseInt(e.target.value) || 5)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                >
                  Publish Harvest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
