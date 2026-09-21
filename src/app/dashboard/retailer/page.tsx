'use client'

import { useState } from 'react'
import {
  Store,
  AlertTriangle,
  TrendingDown,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight,
  Filter,
  Package,
} from 'lucide-react'
import { useAppStore } from '@/store'
import { DemoRoleSwitcher } from '@/components/DemoRoleSwitcher'
import { RetailerInventory, SupplierListing } from '@/types'

export default function RetailerDashboard() {
  const {
    currentUser,
    inventory,
    listings,
    orders,
    createOrder,
    triggerLowStockSimulation,
    updateInventoryStock,
  } = useAppStore()

  // Selected item for supplier comparison modal
  const [selectedRestockItem, setSelectedRestockItem] = useState<RetailerInventory | null>(null)
  const [orderQuantity, setOrderQuantity] = useState<number>(50)
  const [deliveryNotes, setDeliveryNotes] = useState<string>('Deliver directly to front kiosk counter')
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null)

  // Identify low stock items
  const lowStockItems = inventory.filter((i) => i.current_stock <= i.low_stock_threshold)
  const healthyStockItems = inventory.filter((i) => i.current_stock > i.low_stock_threshold)

  // Get matching suppliers for the selected restock item
  const relevantListings: SupplierListing[] = selectedRestockItem
    ? listings
        .filter((l) => l.product_id === selectedRestockItem.product_id && l.is_active)
        .sort((a, b) => {
          // Sort by total cost (product price * qty + delivery fee)
          const costA = a.price_per_unit * orderQuantity + (a.total_delivery_fee || 0)
          const costB = b.price_per_unit * orderQuantity + (b.total_delivery_fee || 0)
          return costA - costB
        })
    : []

  const handleOpenRestock = (item: RetailerInventory) => {
    setSelectedRestockItem(item)
    setOrderQuantity(item.reorder_quantity || 50)
    setOrderSuccessMessage(null)
  }

  const handlePlaceOrder = (listing: SupplierListing) => {
    if (!selectedRestockItem) return

    const newOrder = createOrder({
      productId: selectedRestockItem.product_id,
      supplierId: listing.supplier_id,
      quantity: orderQuantity,
      deliveryAddress: currentUser.address || 'Kipande Road, Westlands, Nairobi',
      notes: deliveryNotes,
    })

    setOrderSuccessMessage(
      `Order #${newOrder.id} successfully placed with ${listing.supplier?.business_name}! Awaiting supplier confirmation.`
    )

    setTimeout(() => {
      setSelectedRestockItem(null)
      setOrderSuccessMessage(null)
    }, 2800)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex flex-col">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Retailer Header */}
        <div className="bg-gradient-to-r from-green-700 via-emerald-600 to-green-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-green-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <Store className="w-3.5 h-3.5" />
              <span>Retailer Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{currentUser.business_name}</h1>
            <p className="text-green-100 text-sm mt-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-300" />
              <span>{currentUser.address} • Phone: {currentUser.phone}</span>
            </p>
          </div>

          {/* Quick Simulation controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => triggerLowStockSimulation('prod-1')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all"
            >
              ⚡ Simulate Maize Stockout
            </button>
            <button
              onClick={() => triggerLowStockSimulation('prod-4')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold backdrop-blur-sm transition-all"
            >
              ⚡ Simulate Tomato Stockout
            </button>
          </div>
        </div>

        {/* Low Stock Alerts Section */}
        {lowStockItems.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  Urgent Restock Needed ({lowStockItems.length} items low)
                </h2>
              </div>
              <span className="text-xs text-red-500 font-semibold bg-red-50 dark:bg-red-950/40 px-3 py-1 rounded-full border border-red-200 dark:border-red-900">
                PWA Stock Alert Active
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-900 border-2 border-red-500/40 rounded-2xl p-5 shadow-sm hover:border-red-500 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-md">
                          CRITICAL LOW
                        </span>
                        <h3 className="text-lg font-bold mt-1 text-gray-900 dark:text-white">
                          {item.product?.name}
                        </h3>
                        <p className="text-xs text-gray-500">{item.product?.category}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-red-600 dark:text-red-400">
                          {item.current_stock}
                        </span>
                        <span className="text-xs text-gray-500 block">/ min {item.low_stock_threshold} {item.product?.unit}</span>
                      </div>
                    </div>

                    {/* Stock level progress */}
                    <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full mt-4 overflow-hidden">
                      <div
                        className="bg-red-500 h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (item.current_stock / item.low_stock_threshold) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenRestock(item)}
                    className="mt-5 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Compare Nearby Suppliers</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Full Inventory Monitor */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Store Inventory Monitor</h2>
              <p className="text-xs text-gray-500">Real-time stock counts with automated reorder thresholds</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" /> Healthy
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 ml-2" /> Low Stock
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="pb-3 font-semibold">Product</th>
                  <th className="pb-3 font-semibold">Category</th>
                  <th className="pb-3 font-semibold">Current Stock</th>
                  <th className="pb-3 font-semibold">Threshold</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {inventory.map((inv) => {
                  const isLow = inv.current_stock <= inv.low_stock_threshold
                  return (
                    <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3.5 font-bold text-gray-900 dark:text-white">
                        {inv.product?.name}
                      </td>
                      <td className="py-3.5 text-xs text-gray-500">{inv.product?.category}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-black ${isLow ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                            {inv.current_stock} {inv.product?.unit}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateInventoryStock(inv.product_id, -5)}
                              className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs flex items-center justify-center"
                              title="Sell 5 units"
                            >
                              -
                            </button>
                            <button
                              onClick={() => updateInventoryStock(inv.product_id, 5)}
                              className="w-5 h-5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-xs flex items-center justify-center"
                              title="Add 5 units"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-xs text-gray-500">
                        {inv.low_stock_threshold} {inv.product?.unit}
                      </td>
                      <td className="py-3.5">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 bg-red-50 dark:bg-red-950 px-2 py-0.5 rounded-md">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-md">
                            <CheckCircle className="w-3 h-3" /> Healthy
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleOpenRestock(inv)}
                          className="px-3 py-1 rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 hover:bg-green-100 font-semibold text-xs transition-colors"
                        >
                          Restock
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Live Orders & Delivery Tracker */}
        <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Orders & Boda Tracking</h2>
              <p className="text-xs text-gray-500">Live order lifecycle from placement to counter delivery</p>
            </div>
            <span className="text-xs text-gray-500 font-medium">{orders.length} orders total</span>
          </div>

          <div className="space-y-4 mt-6">
            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 py-6 text-center">No orders placed yet.</p>
            ) : (
              orders.map((ord) => {
                const statusStyles: Record<string, { label: string; color: string; badge: string }> = {
                  pending: { label: 'Awaiting Supplier Confirmation', color: 'text-amber-600', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
                  confirmed: { label: 'Confirmed • Dispatching Boda', color: 'text-blue-600', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
                  assigned: { label: 'Boda Assigned & Heading to Supplier', color: 'text-indigo-600', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                  picked_up: { label: 'Picked Up by Boda', color: 'text-purple-600', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
                  in_transit: { label: 'Boda In Transit (Arriving in ~3 min)', color: 'text-orange-600', badge: 'bg-orange-50 text-orange-700 border-orange-200' },
                  delivered: { label: 'Delivered • Inventory Restocked', color: 'text-green-600', badge: 'bg-green-50 text-green-700 border-green-200' },
                }
                const st = statusStyles[ord.status] || { label: ord.status, color: 'text-gray-600', badge: 'bg-gray-100 text-gray-700 border-gray-200' }

                return (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-800 transition-all bg-gray-50/40 dark:bg-gray-800/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center font-black text-sm">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">Order #{ord.id}</span>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${st.badge}`}>
                              {ord.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {ord.quantity} {ord.product?.unit} {ord.product?.name} from <span className="font-medium text-gray-700 dark:text-gray-300">{ord.supplier?.business_name}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-base font-black text-gray-900 dark:text-white">
                          KSh {ord.total_amount?.toLocaleString()}
                        </p>
                        <p className="text-[11px] text-gray-500">
                          (Item: KSh {ord.quantity * ord.unit_price} + Delivery: KSh {ord.delivery_fee})
                        </p>
                      </div>
                    </div>

                    {/* Progress Stepper Bar */}
                    <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-green-600" />
                        <span className={`font-semibold ${st.color}`}>{st.label}</span>
                      </div>
                      <span className="text-[11px] text-gray-400">
                        Placed at {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </main>

      {/* Restock & Supplier Comparison Modal */}
      {selectedRestockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
              <div>
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                  Verified Local Suppliers
                </span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                  Restock {selectedRestockItem.product?.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Current stock: {selectedRestockItem.current_stock} {selectedRestockItem.product?.unit} (Threshold: {selectedRestockItem.low_stock_threshold} {selectedRestockItem.product?.unit})
                </p>
              </div>
              <button
                onClick={() => setSelectedRestockItem(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-xl"
              >
                ✕
              </button>
            </div>

            {/* Quantity Input */}
            <div className="py-4 border-b border-gray-100 dark:border-gray-800">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Order Quantity ({selectedRestockItem.product?.unit})
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="5"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 font-bold text-center text-base"
                />
                <div className="flex items-center gap-1.5">
                  {[25, 50, 100, 200].map((q) => (
                    <button
                      key={q}
                      onClick={() => setOrderQuantity(q)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        orderQuantity === q
                          ? 'bg-green-600 text-white border-green-600'
                          : 'border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {q} {selectedRestockItem.product?.unit}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Success banner */}
            {orderSuccessMessage && (
              <div className="my-4 p-4 rounded-2xl bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 flex items-center gap-3 text-green-800 dark:text-green-200">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                <p className="text-xs font-semibold">{orderSuccessMessage}</p>
              </div>
            )}

            {/* Suppliers Comparison List */}
            <div className="py-4 space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Available Nearby Wholesalers & Farmers ({relevantListings.length} found)
              </h4>

              {relevantListings.length === 0 ? (
                <p className="text-xs text-gray-400 py-6 text-center">
                  No active suppliers currently listing this item.
                </p>
              ) : (
                relevantListings.map((list) => {
                  const itemTotal = list.price_per_unit * orderQuantity
                  const deliveryFee = list.total_delivery_fee || Math.round(list.distance_km! * 50)
                  const grandTotal = itemTotal + deliveryFee
                  const isFarmer = list.supplier?.role === 'farmer'

                  return (
                    <div
                      key={list.id}
                      className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 hover:border-green-500 dark:hover:border-green-500 transition-all bg-white dark:bg-gray-900 shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                isFarmer
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                  : 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300'
                              }`}
                            >
                              {isFarmer ? 'Direct Farm' : 'Wholesaler'}
                            </span>
                            <h5 className="font-bold text-gray-900 dark:text-white">
                              {list.supplier?.business_name}
                            </h5>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-gray-400" />
                              {list.distance_km} km away ({list.supplier?.address})
                            </span>
                            <span>• Stock: {list.available_stock} {list.unit}</span>
                            <span>• Rate: KSh {list.price_per_unit}/{list.unit}</span>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-right sm:border-l sm:border-gray-100 dark:sm:border-gray-800 sm:pl-4">
                          <span className="text-xs text-gray-400 block">Total Est. Cost</span>
                          <span className="text-lg font-black text-green-700 dark:text-green-400">
                            KSh {grandTotal.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-500 block">
                            Includes KSh {deliveryFee} boda delivery
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Est. Delivery: ~35-45 mins via Boda Express
                        </span>
                        <button
                          onClick={() => handlePlaceOrder(list)}
                          className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <span>Confirm & Order</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
