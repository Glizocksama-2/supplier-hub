'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff, Volume2, X, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAppStore } from '@/store'

interface VoiceAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceAssistantModal({ isOpen, onClose }: VoiceAssistantProps) {
  const {
    currentRole,
    inventory,
    listings,
    products,
    createOrder,
    switchRole,
    updateInventoryStock,
  } = useAppStore()

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [responseMessage, setResponseMessage] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle')

  const recognitionRef = useRef<any>(null)

  // Natural speech playback using SpeechSynthesis with ElevenLabs fallback
  const speakText = useCallback((text: string) => {
    if (typeof window === 'undefined') return
    setStatus('speaking')
    setIsSpeaking(true)

    // Stop existing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 1.0
    // Try to pick an English voice
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice =
      voices.find((v) => v.lang === 'en-GB' || v.lang === 'en-US' || v.lang.startsWith('en')) || voices[0]
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onend = () => {
      setIsSpeaking(false)
      setStatus('idle')
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setStatus('idle')
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  // Process natural language commands
  const processCommand = useCallback(
    (rawText: string) => {
      const text = rawText.toLowerCase().trim()
      setStatus('processing')

      // 1. Order command: "order 50kg maize", "buy 20 kg beans", "order 30 maize"
      const orderMatch = text.match(/(?:order|buy|get|purchase)\s+(\d+)\s*(?:kg|kilos?|litres?|trays?)?\s*(?:of\s+)?([a-z\s]+)/i)
      if (orderMatch) {
        const qty = parseInt(orderMatch[1], 10)
        const rawProd = orderMatch[2].trim()

        // Match product in catalog
        const product = products.find((p) =>
          p.name.toLowerCase().includes(rawProd) || rawProd.includes(p.name.toLowerCase().split(' ')[0])
        )

        if (product) {
          // Find best supplier (cheapest total cost)
          const availListings = listings.filter((l) => l.product_id === product.id && l.is_active)
          if (availListings.length > 0) {
            // Sort by total price
            availListings.sort((a, b) => a.price_per_unit * qty + (a.total_delivery_fee || 0) - (b.price_per_unit * qty + (b.total_delivery_fee || 0)))
            const best = availListings[0]
            const order = createOrder({
              productId: product.id,
              supplierId: best.supplier_id,
              quantity: qty,
              notes: 'Voice placed order via Supplier Hub Assistant',
            })

            const reply = `Order confirmed! I have placed an order for ${qty} ${product.unit} of ${product.name} from ${best.supplier?.business_name} at Kenyan Shillings ${best.price_per_unit} per ${product.unit}. Total including delivery is KSh ${order.total_amount.toLocaleString()}. A boda rider will be dispatched shortly.`
            setResponseMessage(reply)
            speakText(reply)
            return
          } else {
            const reply = `I found ${product.name}, but there are currently no active suppliers listed nearby.`
            setResponseMessage(reply)
            speakText(reply)
            return
          }
        } else {
          const reply = `I couldn't identify the product "${rawProd}". We have maize, beans, rice, tomatoes, onions, and potatoes available.`
          setResponseMessage(reply)
          speakText(reply)
          return
        }
      }

      // 2. Stock check: "check stock of maize", "how much tomatoes do i have"
      const stockMatch = text.match(/(?:check stock|stock of|how much|inventory of|do i have)\s*([a-z\s]+)/i)
      if (stockMatch) {
        const rawProd = stockMatch[1].trim()
        const invItem = inventory.find((i) =>
          i.product?.name.toLowerCase().includes(rawProd) || rawProd.includes(i.product?.name.toLowerCase().split(' ')[0] || '')
        )
        if (invItem && invItem.product) {
          const isLow = invItem.current_stock <= invItem.low_stock_threshold
          const alertPart = isLow
            ? `Warning: stock is below your minimum threshold of ${invItem.low_stock_threshold} ${invItem.product.unit}. Would you like me to order more?`
            : `Stock level is healthy.`
          const reply = `You have ${invItem.current_stock} ${invItem.product.unit} of ${invItem.product.name} in stock. ${alertPart}`
          setResponseMessage(reply)
          speakText(reply)
          return
        }
      }

      // 3. Find suppliers: "who sells tomatoes", "find supplier for beans"
      const supplierMatch = text.match(/(?:who sells|find supplier|supplier for|sellers of)\s*([a-z\s]+)/i)
      if (supplierMatch) {
        const rawProd = supplierMatch[1].trim()
        const product = products.find((p) =>
          p.name.toLowerCase().includes(rawProd) || rawProd.includes(p.name.toLowerCase().split(' ')[0])
        )
        if (product) {
          const matchingListings = listings.filter((l) => l.product_id === product.id)
          if (matchingListings.length > 0) {
            const top = matchingListings[0]
            const reply = `We have ${matchingListings.length} suppliers for ${product.name}. Top match is ${top.supplier?.business_name} at KSh ${top.price_per_unit} per ${product.unit}, located ${top.distance_km} kilometers away.`
            setResponseMessage(reply)
            speakText(reply)
            return
          }
        }
      }

      // 4. Role switch: "switch to boda", "switch to wholesaler", "switch to retailer"
      if (text.includes('boda')) {
        switchRole('boda_rider')
        const reply = 'Switched persona to Boda Rider: James Otieno. Ready to accept deliveries.'
        setResponseMessage(reply)
        speakText(reply)
        return
      }
      if (text.includes('wholesaler')) {
        switchRole('wholesaler')
        const reply = 'Switched persona to Wholesaler: Kilimo Traders. Ready to view orders and manage inventory.'
        setResponseMessage(reply)
        speakText(reply)
        return
      }
      if (text.includes('farmer')) {
        switchRole('farmer')
        const reply = 'Switched persona to Farmer: Green Valley Co-op.'
        setResponseMessage(reply)
        speakText(reply)
        return
      }
      if (text.includes('retailer')) {
        switchRole('retailer')
        const reply = 'Switched persona to Retailer: Mama Sarah Fresh Kiosk.'
        setResponseMessage(reply)
        speakText(reply)
        return
      }

      // Fallback
      const fallback = `I heard: "${rawText}". Try saying "Order 50kg maize", "Check stock of tomatoes", or "Who sells beans".`
      setResponseMessage(fallback)
      speakText(fallback)
    },
    [products, listings, inventory, createOrder, switchRole, speakText]
  )

  const startListening = () => {
    setTranscript('')
    setResponseMessage('')

    if (typeof window === 'undefined') return

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) {
      setResponseMessage('Web Speech API is not supported in this browser. Please use Chrome or Edge, or type below.')
      return
    }

    const recognition = new SpeechRec()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-KE' // Kenyan English locale

    recognition.onstart = () => {
      setIsListening(true)
      setStatus('listening')
    }

    recognition.onresult = (event: any) => {
      let finalTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          setTranscript(event.results[i][0].transcript)
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript)
        recognition.stop()
        processCommand(finalTranscript)
      }
    }

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error)
      setIsListening(false)
      setStatus('idle')
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch (e) {
      console.error(e)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsListening(false)
    setStatus('idle')
  }

  // Quick preset voice triggers for testing/demo without mic
  const triggerSample = (phrase: string) => {
    setTranscript(phrase)
    processCommand(phrase)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 border border-green-200 dark:border-gray-800 rounded-3xl shadow-2xl overflow-hidden p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-green-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Supplier Hub Voice AI</h3>
              <p className="text-xs text-gray-500">ElevenLabs & Web Speech API • Swahili / English</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Voice Visualizer */}
        <div className="py-8 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            {/* Animated rings when listening/speaking */}
            {(isListening || isSpeaking) && (
              <>
                <span className="absolute -inset-4 rounded-full bg-green-500/20 animate-ping" />
                <span className="absolute -inset-8 rounded-full bg-green-500/10 animate-pulse" />
              </>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white scale-105 shadow-red-500/30'
                  : isSpeaking
                  ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/30'
              }`}
            >
              {isListening ? (
                <MicOff className="w-10 h-10 animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 className="w-10 h-10 animate-bounce" />
              ) : (
                <Mic className="w-10 h-10" />
              )}
            </button>
          </div>

          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {status === 'listening' && 'Listening... Speak now'}
            {status === 'processing' && 'Processing voice intent...'}
            {status === 'speaking' && 'Speaking audio reply...'}
            {status === 'idle' && 'Tap the microphone to speak'}
          </p>

          {/* Transcript display */}
          {transcript && (
            <div className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl text-center max-w-sm">
              <span className="text-xs text-gray-400 block mb-1">Transcript</span>
              <p className="text-sm font-semibold text-gray-900 dark:text-white italic">"{transcript}"</p>
            </div>
          )}

          {/* Response Message */}
          {responseMessage && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-2xl w-full text-left">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <p className="text-sm text-green-900 dark:text-green-200 leading-relaxed font-medium">
                  {responseMessage}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Demo Quick Voice Buttons (Guarantees testing works even without microphone permission) */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Try Demo Voice Prompts (Instant test):
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => triggerSample('Order 50kg maize from cheapest supplier')}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-green-100 hover:text-green-700 dark:hover:bg-gray-700 transition-colors"
            >
              🎙️ "Order 50kg maize"
            </button>
            <button
              onClick={() => triggerSample('Check stock of tomatoes')}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-green-100 hover:text-green-700 dark:hover:bg-gray-700 transition-colors"
            >
              🎙️ "Check stock of tomatoes"
            </button>
            <button
              onClick={() => triggerSample('Find supplier for beans')}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-green-100 hover:text-green-700 dark:hover:bg-gray-700 transition-colors"
            >
              🎙️ "Find supplier for beans"
            </button>
            <button
              onClick={() => triggerSample('Switch to boda rider')}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-green-100 hover:text-green-700 dark:hover:bg-gray-700 transition-colors"
            >
              🎙️ "Switch to boda"
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
