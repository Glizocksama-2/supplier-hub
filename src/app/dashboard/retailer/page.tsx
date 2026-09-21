'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  ShoppingBag,
  ArrowRight,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Zap,
  Terminal,
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

  const [selectedRestockItem, setSelectedRestockItem] = useState<RetailerInventory | null>(null)
  const [orderQuantity, setOrderQuantity] = useState<number>(50)
  const [deliveryNotes, setDeliveryNotes] = useState<string>('Counter drop-off at kiosk')
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null)

  const lowStockItems = inventory.filter((i) => i.current_stock <= i.low_stock_threshold)
  const healthyStockItems = inventory.filter((i) => i.current_stock > i.low_stock_threshold)

  const relevantListings: SupplierListing[] = selectedRestockItem
    ? listings
        .filter((l) => l.product_id === selectedRestockItem.product_id && l.is_active)
        .sort((a, b) => {
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
      `DISPATCH LOGGED: Requisition #${newOrder.id} confirmed with ${listing.supplier?.business_name}. Boda rider broadcast active.`
    )

    setTimeout(() => {
      setSelectedRestockItem(null)
      setOrderSuccessMessage(null)
    }, 2800)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e2e8] tactical-grid font-mono flex flex-col selection:bg-[#d2ff00] selection:text-black">
      <DemoRoleSwitcher />

      <main className="flex-1 max-w-[1500px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Terminal Ops Header */}
        <div className="bg-[#0f0f14] border-2 border-[#262632] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] text-[#ff6b00] font-black tracking-wider uppercase mb-1">
              <span className="w-2 h-2 bg-[#ff6b00] animate-pulse" />
              <span>TERMINAL NODE // RETAIL_OPS_01</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {currentUser.business_name}
            </h1>
            <p className="text-xs text-[#7d7d8c] mt-0.5">
              LOC: {currentUser.address} • PHONE: {currentUser.phone}
            </p>
          </div>

          {/* Quick Hardware Macro Triggers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerLowStockSimulation('prod-1')}
              className="px-3 py-2 bg-[#181822] hover:bg-[#ff2b2b]/15 border border-[#2d2d3c] hover:border-[#ff2b2b] text-[#ff2b2b] text-xs font-bold transition-all"
            >
              [⚡ SHORTAGE: MAIZE]
            </button>
            <button
              onClick={() => triggerLowStockSimulation('prod-4')}
              className="px-3 py-2 bg-[#181822] hover:bg-[#ff2b2b]/15 border border-[#2d2d3c] hover:border-[#ff2b2b] text-[#ff2b2b] text-xs font-bold transition-all"
            >
              [⚡ SHORTAGE: TOMATOES]
            </button>
          </div>
        </div>

        {/* Urgent Shortages Warning Zone */}
        {lowStockItems.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#ff2b2b]/30 pb-2">
              <div className="flex items-center gap-2 text-xs font-black text-[#ff2b2b] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-[#ff2b2b]" />
                <span>ACTIVE SHORTAGE WARNING // {lowStockItems.length} SKUs BELOW THRESHOLD</span>
              </div>
              <span className="text-[10px] bg-[#ff2b2b]/20 text-[#ff2b2b] border border-[#ff2b2b]/40 px-2 py-0.5 font-bold">
                PRIORITY_DISPATCH_REQUIRED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-[#120a0c] border-2 border-[#ff2b2b] p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-black text-[#ff2b2b] uppercase tracking-wider block">
                          [CRITICAL SHORTAGE]
                        </span>
                        <h3 className="text-lg font-black text-white uppercase mt-0.5">
                          {item.product?.name}
                        </h3>
                        <span className="text-[10px] text-[#888894]">CATEGORY: {item.product?.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-[#ff2b2b]">
                          {item.current_stock}
                        </span>
                        <span className="text-[10px] text-[#666675] block uppercase">
                          / MIN {item.low_stock_threshold} {item.product?.unit}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-[#201115] h-2.5 mt-3 border border-[#ff2b2b]/30">
                      <div
                        className="bg-[#ff2b2b] h-full"
                        style={{
                          width: `${Math.min(100, (item.current_stock / item.low_stock_threshold) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenRestock(item)}
                    className="mt-4 w-full bg-[#ff2b2b] hover:bg-[#e02020] text-white text-xs font-black py-2.5 px-3 uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>[COMPARE WHOLESALE & FARM GATE]</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Real-time Inventory Telemetry Matrix */}
        <section className="bg-[#0e0e13] border border-[#242430] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1c1c24] pb-3">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                COMMODITY STOCK TELEMETRY // CURRENT BALANCE
              </h2>
              <p className="text-[10px] text-[#666675]">Real-time shelf metrics with automatic threshold triggers</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-[#888894]">
              <span>TOTAL SKUs: {inventory.length}</span>
              <span>•</span>
              <span className="text-[#ff2b2b]">SHORTAGES: {lowStockItems.length}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[10px] text-[#666675] uppercase border-b border-[#20202a]">
                  <th className="pb-2 font-bold">COMMODITY</th>
                  <th className="pb-2 font-bold">CATEGORY</th>
                  <th className="pb-2 font-bold">CURRENT STOCK</th>
                  <th className="pb-2 font-bold">MIN THRESHOLD</th>
                  <th className="pb-2 font-bold">STATUS</th>
                  <th className="pb-2 font-bold text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#181820]">
                {inventory.map((inv) => {
                  const isLow = inv.current_stock <= inv.low_stock_threshold
                  return (
                    <tr key={inv.id} className="hover:bg-[#14141c] transition-colors">
                      <td className="py-3 font-bold text-white uppercase">
                        {inv.product?.name}
                      </td>
                      <td className="py-3 text-[11px] text-[#787884]">{inv.product?.category}</td>
                      <td className="py-3 font-black">
                        <div className="flex items-center gap-2">
                          <span className={isLow ? 'text-[#ff2b2b] text-sm' : 'text-white text-sm'}>
                            {inv.current_stock} {inv.product?.unit}
                          </span>
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => updateInventoryStock(inv.product_id, -5)}
                              className="px-1.5 py-0.5 bg-[#1a1a22] hover:bg-[#252530] text-[10px] text-white border border-[#2d2d38]"
                              title="Sell 5 units"
                            >
                              -5
                            </button>
                            <button
                              onClick={() => updateInventoryStock(inv.product_id, 5)}
                              className="px-1.5 py-0.5 bg-[#1a1a22] hover:bg-[#252530] text-[10px] text-white border border-[#2d2d38]"
                              title="Add 5 units"
                            >
                              +5
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-[11px] text-[#787884]">
                        {inv.low_stock_threshold} {inv.product?.unit}
                      </td>
                      <td className="py-3">
                        {isLow ? (
                          <span className="text-[10px] font-black text-[#ff2b2b] bg-[#ff2b2b]/10 border border-[#ff2b2b]/40 px-2 py-0.5 uppercase">
                            CRITICAL
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-[#d2ff00] bg-[#d2ff00]/10 border border-[#d2ff00]/40 px-2 py-0.5 uppercase">
                            NOMINAL
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleOpenRestock(inv)}
                          className="px-3 py-1 bg-[#d2ff00] hover:bg-[#b8e000] text-black font-black text-[11px] uppercase tracking-wider transition-colors"
                        >
                          RESTOCK »
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Live Orders & Boda Telemetry */}
        <section className="bg-[#0e0e13] border border-[#242430] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1c1c24] pb-3">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                BODA DISPATCH LIFECYCLE // LIVE TRANSIT FEED
              </h2>
              <p className="text-[10px] text-[#666675]">Real-time carrier assignment and delivery completion telemetry</p>
            </div>
            <span className="text-[10px] text-[#ff6b00] font-bold">[ORDERS: {orders.length}]</span>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <p className="text-xs text-[#555562] py-4 text-center">NO RECENT DISPATCH ORDERS LOGGED</p>
            ) : (
              orders.map((ord) => {
                const statusTheme: Record<string, { label: string; text: string; bg: string }> = {
                  pending: { label: 'AWAITING SUPPLIER CONFIRMATION', text: 'text-[#ff6b00]', bg: 'bg-[#ff6b00]/15 border-[#ff6b00]/40' },
                  confirmed: { label: 'CONFIRMED // BROADCASTING BODA DISPATCH', text: 'text-blue-400', bg: 'bg-blue-950/40 border-blue-500/40' },
                  assigned: { label: 'BODA EN ROUTE TO SUPPLIER PICKUP', text: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-500/40' },
                  picked_up: { label: 'CARGO LOADED ON BODA', text: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-500/40' },
                  in_transit: { label: 'IN TRANSIT TO KIOSK (ETA ~3 MIN)', text: 'text-[#ff6b00]', bg: 'bg-[#ff6b00]/20 border-[#ff6b00]' },
                  delivered: { label: 'DELIVERED // INVENTORY REPLENISHED', text: 'text-[#d2ff00]', bg: 'bg-[#d2ff00]/15 border-[#d2ff00]/40' },
                }
                const st = statusTheme[ord.status] || { label: ord.status, text: 'text-white', bg: 'bg-[#181820] border-[#2c2c36]' }

                return (
                  <div
                    key={ord.id}
                    className="p-4 bg-[#111116] border border-[#22222a] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">#{ord.id}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 border ${st.bg} ${st.text}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#a0a0ae]">
                        {ord.quantity} {ord.product?.unit} {ord.product?.name} from <span className="text-white font-bold">{ord.supplier?.business_name}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-black text-[#d2ff00]">
                        KSh {ord.total_amount?.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#666675] block">
                        ITEM: KSh {ord.quantity * ord.unit_price} + BODA: KSh {ord.delivery_fee}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </section>
      </main>

      {/* Supplier Comparison & Requisition Modal */}
      {selectedRestockItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 font-mono">
          <div className="bg-[#0d0d12] border-2 border-[#333342] max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-[#242430]">
              <div>
                <span className="text-[10px] font-black text-[#d2ff00] uppercase tracking-wider">
                  COMMODITY SOURCING MATRIX // REAL-TIME LOGISTICS
                </span>
                <h3 className="text-xl font-black text-white uppercase mt-0.5">
                  REQUISITION: {selectedRestockItem.product?.name}
                </h3>
                <span className="text-[11px] text-[#787884]">
                  ON HAND: {selectedRestockItem.current_stock} {selectedRestockItem.product?.unit} • THRESHOLD: {selectedRestockItem.low_stock_threshold} {selectedRestockItem.product?.unit}
                </span>
              </div>
              <button
                onClick={() => setSelectedRestockItem(null)}
                className="text-[#666675] hover:text-white px-2 py-1 text-xs border border-[#252530]"
              >
                [ESC / CLOSE]
              </button>
            </div>

            {/* Quantity Selector */}
            <div className="p-3 bg-[#13131a] border border-[#22222d] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-[#787884] uppercase block">REORDER VOLUME ({selectedRestockItem.product?.unit}):</span>
                <input
                  type="number"
                  min="5"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 bg-[#0a0a0e] border border-[#2a2a38] text-white font-black text-center py-1.5 text-base mt-1"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {[25, 50, 100, 200].map((q) => (
                  <button
                    key={q}
                    onClick={() => setOrderQuantity(q)}
                    className={`px-3 py-1.5 text-xs font-bold border transition-colors ${
                      orderQuantity === q
                        ? 'bg-[#d2ff00] text-black border-[#d2ff00]'
                        : 'bg-[#0a0a0e] text-[#8e8e9c] border-[#22222d] hover:text-white'
                    }`}
                  >
                    {q} {selectedRestockItem.product?.unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Status confirmation */}
            {orderSuccessMessage && (
              <div className="p-3 bg-[#0f1b0c] border-2 border-[#2b5a15] text-[#b8f596] text-xs font-bold">
                {orderSuccessMessage}
              </div>
            )}

            {/* Comparison Grid */}
            <div className="space-y-3">
              <span className="text-[10px] text-[#666675] font-black uppercase tracking-wider block">
                AVAILABLE VERIFIED SOURCES ({relevantListings.length} DEPOTS / FARMS INDEXED):
              </span>

              {relevantListings.map((list) => {
                const itemTotal = list.price_per_unit * orderQuantity
                const deliveryFee = list.total_delivery_fee || Math.round(list.distance_km! * 50)
                const grandTotal = itemTotal + deliveryFee
                const isFarmer = list.supplier?.role === 'farmer'

                return (
                  <div
                    key={list.id}
                    className="p-4 bg-[#111116] border border-[#242430] hover:border-[#d2ff00] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 uppercase ${
                          isFarmer ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-400 border border-blue-800'
                        }`}>
                          {isFarmer ? 'DIRECT FARM GATE' : 'WHOLESALE DEPOT'}
                        </span>
                        <h4 className="font-black text-white text-sm uppercase">
                          {list.supplier?.business_name}
                        </h4>
                      </div>

                      <div className="text-[11px] text-[#888894] flex flex-wrap gap-3">
                        <span>DISTANCE: {list.distance_km} KM ({list.supplier?.address})</span>
                        <span>STOCK: {list.available_stock} {list.unit}</span>
                        <span className="text-[#d2ff00]">RATE: KSH {list.price_per_unit}/{list.unit}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 sm:border-l sm:border-[#22222c] sm:pl-4">
                      <div className="text-right">
                        <span className="text-[10px] text-[#666675] uppercase block">TOTAL INVOICE</span>
                        <span className="text-xl font-black text-[#d2ff00]">
                          KSh {grandTotal.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-[#777784] block">
                          INC. KSH {deliveryFee} BODA CARRIER
                        </span>
                      </div>

                      <button
                        onClick={() => handlePlaceOrder(list)}
                        className="px-4 py-2.5 bg-[#d2ff00] hover:bg-[#b8e000] text-black font-black text-xs uppercase tracking-wider transition-colors"
                      >
                        CONFIRM & REQUISITION »
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
