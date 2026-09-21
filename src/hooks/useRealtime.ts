'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useAuthStore } from '@/store'
import { Profile, Product, RetailerInventory, SupplierListing, Order, Notification, BodaAssignment } from '@/types'

export function useRealtimeProfile(userId: string) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      setProfile(data)
      setLoading(false)
    }
    fetchProfile()

    const channel = supabase
      .channel(`profile:${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` }, (payload) => {
        setProfile(payload.new as Profile)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  return { profile, loading }
}

export function useRealtimeInventory(retailerId: string) {
  const [inventory, setInventory] = useState<RetailerInventory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInventory = async () => {
      const { data } = await supabase
        .from('retailer_inventory')
        .select('*, product:products(*)')
        .eq('retailer_id', retailerId)
      setInventory(data || [])
      setLoading(false)
    }
    fetchInventory()

    const channel = supabase
      .channel(`inventory:${retailerId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'retailer_inventory', filter: `retailer_id=eq.${retailerId}` }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setInventory(prev => prev.filter(i => i.id !== payload.old.id))
        } else {
          setInventory(prev => {
            const idx = prev.findIndex(i => i.id === payload.new.id)
            if (idx >= 0) prev[idx] = payload.new as RetailerInventory
            else prev.push(payload.new as RetailerInventory)
            return [...prev]
          })
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [retailerId])

  return { inventory, loading }
}

export function useSupplierListings(productId?: string) {
  const [listings, setListings] = useState<SupplierListing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      let query = supabase
        .from('supplier_listings')
        .select('*, product:products(*), supplier:profiles(*)')
        .eq('is_active', true)
      
      if (productId) query = query.eq('product_id', productId)
      
      const { data } = await query
      setListings(data || [])
      setLoading(false)
    }
    fetchListings()

    const channel = supabase
      .channel(`listings:${productId || 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'supplier_listings', filter: productId ? `product_id=eq.${productId}` : 'is_active=eq.true' }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setListings(prev => prev.filter(l => l.id !== payload.old.id))
        } else {
          setListings(prev => {
            const idx = prev.findIndex(l => l.id === payload.new.id)
            if (idx >= 0) prev[idx] = payload.new as SupplierListing
            else prev.push(payload.new as SupplierListing)
            return [...prev]
          })
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [productId])

  return { listings, loading }
}

export function useRealtimeOrders(userId: string, role: string) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      let query = supabase
        .from('orders')
        .select('*, product:products(*), supplier:profiles(*), retailer:profiles(*), boda_assignment:boda_assignments(*, rider:profiles(*))')
      
      if (role === 'retailer') query = query.eq('retailer_id', userId)
      else if (role === 'wholesaler' || role === 'farmer') query = query.eq('supplier_id', userId)
      
      const { data } = await query.order('created_at', { ascending: false })
      setOrders(data || [])
      setLoading(false)
    }
    fetchOrders()

    const channel = supabase
      .channel(`orders:${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: role === 'retailer' ? `retailer_id=eq.${userId}` : `supplier_id=eq.${userId}` }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setOrders(prev => prev.filter(o => o.id !== payload.old.id))
        } else {
          setOrders(prev => {
            const idx = prev.findIndex(o => o.id === payload.new.id)
            if (idx >= 0) prev[idx] = payload.new as Order
            else prev.unshift(payload.new as Order)
            return [...prev]
          })
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId, role])

  return { orders, loading }
}

export function useBodaAssignments(bodaRiderId: string) {
  const [assignments, setAssignments] = useState<BodaAssignment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAssignments = async () => {
      const { data } = await supabase
        .from('boda_assignments')
        .select('*, order:orders(*, product:products(*), retailer:profiles(*), supplier:profiles(*)), rider:profiles(*)')
        .eq('boda_rider_id', bodaRiderId)
        .order('offered_at', { ascending: false })
      setAssignments(data || [])
      setLoading(false)
    }
    fetchAssignments()

    const channel = supabase
      .channel(`assignments:${bodaRiderId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boda_assignments', filter: `boda_rider_id=eq.${bodaRiderId}` }, (payload) => {
        if (payload.eventType === 'DELETE') {
          setAssignments(prev => prev.filter(a => a.id !== payload.old.id))
        } else {
          setAssignments(prev => {
            const idx = prev.findIndex(a => a.id === payload.new.id)
            if (idx >= 0) prev[idx] = payload.new as BodaAssignment
            else prev.unshift(payload.new as BodaAssignment)
            return [...prev]
          })
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [bodaRiderId])

  return { assignments, loading }
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)
      setNotifications(data || [])
      setUnreadCount(data?.filter(n => !n.is_read).length || 0)
      setLoading(false)
    }
    fetchNotifications()

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setNotifications(prev => [payload.new as Notification, ...prev].slice(0, 50))
          setUnreadCount(prev => prev + 1)
        } else if (payload.eventType === 'UPDATE' && payload.new.is_read && !payload.old.is_read) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  return { notifications, unreadCount, loading }
}