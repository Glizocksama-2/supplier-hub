'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Mic, MicOff, Volume2, X, Terminal, Radio, ShieldCheck, Activity } from 'lucide-react'
import { useAppStore } from '@/store'

interface VoiceAssistantProps {
  isOpen: boolean
  onClose: () => void
}

export function VoiceAssistantModal({ isOpen, onClose }: VoiceAssistantProps) {
  const {
    inventory,
    listings,
    products,
    createOrder,
    switchRole,
  } = useAppStore()

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [responseMessage, setResponseMessage] = useState('')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'PARSING' | 'SYNTHESIZING'>('IDLE')

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speakWithBrowserSpeech = useCallback((text: string) => {
    if (typeof window === 'undefined') return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.05
    utterance.pitch = 0.95
    const voices = window.speechSynthesis.getVoices()
    const preferredVoice =
      voices.find((v) => v.lang === 'en-GB' || v.lang === 'en-US' || v.lang.startsWith('en')) || voices[0]
    if (preferredVoice) utterance.voice = preferredVoice

    utterance.onend = () => {
      setIsSpeaking(false)
      setStatus('IDLE')
    }
    utterance.onerror = () => {
      setIsSpeaking(false)
      setStatus('IDLE')
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  const speakText = useCallback(
    async (text: string) => {
      if (typeof window === 'undefined') return
      setStatus('SYNTHESIZING')
      setIsSpeaking(true)

      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })

        if (res.ok) {
          const audioBlob = await res.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          const audio = new Audio(audioUrl)
          audioRef.current = audio

          audio.onended = () => {
            setIsSpeaking(false)
            setStatus('IDLE')
            URL.revokeObjectURL(audioUrl)
          }
          audio.onerror = () => {
            URL.revokeObjectURL(audioUrl)
            speakWithBrowserSpeech(text)
          }

          await audio.play()
          return
        }
      } catch {
        // Fallback to browser synthesis
      }

      speakWithBrowserSpeech(text)
    },
    [speakWithBrowserSpeech]
  )

  const processCommand = useCallback(
    (rawText: string) => {
      const text = rawText.toLowerCase().trim()
      setStatus('PARSING')

      // 1. Order command: "order 50kg maize", "buy 20 kg beans"
      const orderMatch = text.match(/(?:order|buy|get|purchase)\s+(\d+)\s*(?:kg|kilos?|litres?|trays?)?\s*(?:of\s+)?([a-z\s]+)/i)
      if (orderMatch) {
        const qty = parseInt(orderMatch[1], 10)
        const rawProd = orderMatch[2].trim()

        const product = products.find((p) =>
          p.name.toLowerCase().includes(rawProd) || rawProd.includes(p.name.toLowerCase().split(' ')[0])
        )

        if (product) {
          const availListings = listings.filter((l) => l.product_id === product.id && l.is_active)
          if (availListings.length > 0) {
            availListings.sort((a, b) => a.price_per_unit * qty + (a.total_delivery_fee || 0) - (b.price_per_unit * qty + (b.total_delivery_fee || 0)))
            const best = availListings[0]
            const order = createOrder({
              productId: product.id,
              supplierId: best.supplier_id,
              quantity: qty,
              notes: 'Tactical Voice HUD requisition',
            })

            const reply = `Order SH-${order.id.slice(-4)} logged. Sourced ${qty} ${product.unit} ${product.name} from ${best.supplier?.business_name} at KSh ${best.price_per_unit}/${product.unit}. Total invoice KSh ${order.total_amount.toLocaleString()}. Boda dispatch broadcast initiated.`
            setResponseMessage(reply)
            speakText(reply)
            return
          } else {
            const reply = `Commodity ${product.name} detected, but zero active depot listings in current transit radius.`
            setResponseMessage(reply)
            speakText(reply)
            return
          }
        } else {
          const reply = `Commodity "${rawProd}" not indexed. Supported items: Maize, Beans, Rice, Tomatoes, Red Onions, Potatoes, Milk, Eggs.`
          setResponseMessage(reply)
          speakText(reply)
          return
        }
      }

      // 2. Stock check
      const stockMatch = text.match(/(?:check stock|stock of|how much|inventory of|do i have)\s*([a-z\s]+)/i)
      if (stockMatch) {
        const rawProd = stockMatch[1].trim()
        const invItem = inventory.find((i) =>
          i.product?.name.toLowerCase().includes(rawProd) || rawProd.includes(i.product?.name.toLowerCase().split(' ')[0] || '')
        )
        if (invItem && invItem.product) {
          const isLow = invItem.current_stock <= invItem.low_stock_threshold
          const alertPart = isLow
            ? `Warning: Below minimum threshold of ${invItem.low_stock_threshold} ${invItem.product.unit}. Immediate restock advised.`
            : `Inventory level nominal.`
          const reply = `Current balance: ${invItem.current_stock} ${invItem.product.unit} ${invItem.product.name}. ${alertPart}`
          setResponseMessage(reply)
          speakText(reply)
          return
        }
      }

      // 3. Find suppliers
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
            const reply = `Located ${matchingListings.length} suppliers for ${product.name}. Optimal: ${top.supplier?.business_name} at KSh ${top.price_per_unit} per ${product.unit}, distance ${top.distance_km} kilometers.`
            setResponseMessage(reply)
            speakText(reply)
            return
          }
        }
      }

      // 4. Role switch
      if (text.includes('boda')) {
        switchRole('boda_rider')
        const reply = 'Persona routed to Boda Logistics: James Otieno.'
        setResponseMessage(reply)
        speakText(reply)
        return
      }
      if (text.includes('wholesaler')) {
        switchRole('wholesaler')
        const reply = 'Persona routed to Wholesale Depot: Kilimo Traders.'
        setResponseMessage(reply)
        speakText(reply)
        return
      }
      if (text.includes('farmer')) {
        switchRole('farmer')
        const reply = 'Persona routed to Farm Gate: Green Valley Co-op.'
        setResponseMessage(reply)
        speakText(reply)
        return
      }
      if (text.includes('retailer')) {
        switchRole('retailer')
        const reply = 'Persona routed to Retail Operations: Mama Sarah Fresh Kiosk.'
        setResponseMessage(reply)
        speakText(reply)
        return
      }

      // Fallback
      const fallback = `Input captured: "${rawText}". Issue voice instructions like: "Order 50kg maize", "Check stock of tomatoes", or "Who sells beans".`
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
      setResponseMessage('Web Speech API not supported in this client. Use prompt buttons below.')
      return
    }

    const recognition = new SpeechRec()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-KE'

    recognition.onstart = () => {
      setIsListening(true)
      setStatus('LISTENING')
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

    recognition.onerror = () => {
      setIsListening(false)
      setStatus('IDLE')
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
    setStatus('IDLE')
  }

  const triggerSample = (phrase: string) => {
    setTranscript(phrase)
    processCommand(phrase)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 font-mono">
      <div className="relative w-full max-w-xl bg-[#0a0a0d] border-2 border-[#262832] text-[#e2e4e9] shadow-2xl p-6">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#22242b]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-600" />
            <span className="text-xs font-black tracking-widest text-white uppercase">
              VOICE DISPATCH TERMINAL // AUDIO_INPUT_01
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-[#9497a1] hover:text-white px-2 py-1 text-xs font-bold border border-[#22242b] hover:border-[#383b48]"
          >
            [ESC / CLOSE]
          </button>
        </div>

        {/* Audio Visualizer & Frequency Simulation */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-full bg-[#050608] border border-[#1e2028] p-4 mb-5">
            <div className="flex items-center justify-between text-[10px] text-[#9497a1] pb-2 border-b border-[#181a22] mb-3">
              <span>INPUT STATUS: <strong className={status === 'LISTENING' ? 'text-blue-400' : 'text-white'}>[{status}]</strong></span>
              <span>SAMPLING: 44.1kHz • EN-KE</span>
              <span>LOC: NAIROBI_CORRIDOR</span>
            </div>

            {/* Audio bar simulation */}
            <div className="flex items-end justify-between h-14 gap-1 px-2">
              {[15, 35, 70, 45, 85, 95, 60, 40, 80, 100, 75, 45, 65, 30, 90, 50, 20, 60, 40, 70].map((h, i) => (
                <div
                  key={i}
                  className={`w-full transition-all duration-100 ${
                    isListening || isSpeaking
                      ? 'bg-blue-500'
                      : 'bg-[#1e2028]'
                  }`}
                  style={{
                    height: isListening || isSpeaking ? `${Math.max(12, Math.round(h * Math.random()))}%` : '8%',
                  }}
                />
              ))}
            </div>
          </div>

          <button
            onClick={isListening ? stopListening : startListening}
            className={`w-full py-4 border text-sm font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${
              isListening
                ? 'bg-blue-700 text-white border-blue-500'
                : isSpeaking
                ? 'bg-blue-950/60 text-blue-300 border-blue-500'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-600'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 animate-pulse" />
                <span>[RECORDING... TAP TO TRANSMIT]</span>
              </>
            ) : isSpeaking ? (
              <>
                <Volume2 className="w-5 h-5 animate-bounce text-blue-400" />
                <span>[TRANSMITTING AUDIO TELEMETRY]</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>[CLICK TO INITIATE VOICE COMMAND]</span>
              </>
            )}
          </button>

          {/* Transcript telemetry */}
          {transcript && (
            <div className="w-full mt-4 p-3 bg-[#111318] border border-[#222530] text-left">
              <span className="text-[10px] text-blue-400 uppercase block mb-0.5">» RECOGNIZED PHRASE:</span>
              <p className="text-xs font-bold text-white">"{transcript}"</p>
            </div>
          )}

          {/* Response Telemetry */}
          {responseMessage && (
            <div className="w-full mt-3 p-3 bg-[#0a101d] border border-blue-800/60 text-left">
              <span className="text-[10px] text-blue-400 uppercase block mb-0.5">» SYSTEM DISPATCH CONFIRMATION:</span>
              <p className="text-xs font-semibold text-white leading-relaxed">
                {responseMessage}
              </p>
            </div>
          )}
        </div>

        {/* Demo Fast Triggers */}
        <div className="pt-3 border-t border-[#1e2028]">
          <span className="text-[10px] text-[#616572] uppercase block mb-2 font-bold">
            // HARDWARE TRIGGER MACROS (TEST WITHOUT MICROPHONE):
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => triggerSample('Order 50kg maize from cheapest supplier')}
              className="p-2 bg-[#121318] hover:bg-[#181a22] border border-[#22242c] hover:border-blue-500 text-left text-white transition-colors"
            >
              [MACRO 1] » "Order 50kg maize"
            </button>
            <button
              onClick={() => triggerSample('Check stock of tomatoes')}
              className="p-2 bg-[#121318] hover:bg-[#181a22] border border-[#22242c] hover:border-blue-500 text-left text-white transition-colors"
            >
              [MACRO 2] » "Check stock of tomatoes"
            </button>
            <button
              onClick={() => triggerSample('Find supplier for beans')}
              className="p-2 bg-[#121318] hover:bg-[#181a22] border border-[#22242c] hover:border-blue-500 text-left text-white transition-colors"
            >
              [MACRO 3] » "Who sells beans"
            </button>
            <button
              onClick={() => triggerSample('Switch to boda rider')}
              className="p-2 bg-[#121318] hover:bg-[#181a22] border border-[#22242c] hover:border-blue-500 text-left text-white transition-colors"
            >
              [MACRO 4] » "Switch to Boda Dispatch"
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
