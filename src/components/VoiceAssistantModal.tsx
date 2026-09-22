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
  const [manualCommand, setManualCommand] = useState('')
  const [speechError, setSpeechError] = useState<'network' | 'not-allowed' | 'other' | null>(null)

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const silenceTimerRef = useRef<any>(null)
  const transcriptRef = useRef<string>('')
  const inputRef = useRef<HTMLInputElement | null>(null)

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

            const reply = `Order ${order.id} logged. Sourced ${qty} ${product.unit} ${product.name} from ${best.supplier?.business_name} at KSh ${best.price_per_unit}/${product.unit}. Total invoice KSh ${order.total_amount.toLocaleString()}. Boda dispatch broadcast initiated.`
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

      // 4. Comparison query: "who is cheaper", "which is faster", "compare maize", "who is cheaper and faster"
      if (text.includes('cheap') || text.includes('fast') || text.includes('compare') || text.includes('sourcing')) {
        const matchedProd = products.find((p) =>
          text.includes(p.name.toLowerCase()) || text.includes(p.name.toLowerCase().split(' ')[0])
        ) || products[0]

        const avail = listings.filter((l) => l.product_id === matchedProd.id && l.is_active)
        if (avail.length >= 2) {
          const qty = 50
          const withTotals = avail.map((l) => ({
            ...l,
            total: l.price_per_unit * qty + (l.total_delivery_fee || Math.round((l.distance_km || 3) * 50)),
            etaMins: Math.max(5, Math.round(5 + (l.distance_km || 3) * 2.2)),
          }))

          const cheapest = [...withTotals].sort((a, b) => a.total - b.total)[0]
          const fastest = [...withTotals].sort((a, b) => a.etaMins - b.etaMins)[0]
          const savings = Math.max(...withTotals.map(w => w.total)) - cheapest.total
          const timeSaved = Math.max(...withTotals.map(w => w.etaMins)) - fastest.etaMins

          const reply = `Analysis for ${matchedProd.name}: ${cheapest.supplier?.business_name} is the cheapest at KSh ${cheapest.price_per_unit} per ${matchedProd.unit}, saving KSh ${savings.toLocaleString()} on a 50kg batch. ${fastest.supplier?.business_name} is the fastest, arriving in approximately ${fastest.etaMins} minutes via Boda, saving ${timeSaved} minutes.`
          setResponseMessage(reply)
          speakText(reply)
          return
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

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch {}
      recognitionRef.current = null
    }

    setIsListening(false)

    // If text was accumulated, process it immediately upon user tap
    const captured = transcriptRef.current.trim()
    if (captured && status === 'LISTENING') {
      processCommand(captured)
    } else if (status === 'LISTENING') {
      setStatus('IDLE')
    }
  }, [processCommand, status])

  const startListening = async () => {
    setTranscript('')
    transcriptRef.current = ''
    setResponseMessage('')
    setSpeechError(null)

    if (typeof window === 'undefined') return

    // Stop any ongoing speech playback
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    window.speechSynthesis.cancel()
    setIsSpeaking(false)

    // Pre-flight mic permission verification (prompts browser to allow microphone)
    if (navigator?.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Immediately release tracks once access is verified
        stream.getTracks().forEach((track) => track.stop())
      } catch (err: any) {
        console.warn('Microphone permission check failed:', err)
        setSpeechError('not-allowed')
        setResponseMessage(
          'Microphone permission blocked or device unavailable. Allow microphone in your browser address bar.'
        )
        setStatus('IDLE')
        setIsListening(false)
        return
      }
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRec) {
      setResponseMessage('Web Speech API is not supported in this browser. Please use the quick prompt buttons.')
      return
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch {}
    }

    const recognition = new SpeechRec()
    recognition.continuous = true
    recognition.interimResults = true
    // Force en-US for maximum reliability on Chromium speech cloud servers
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setStatus('LISTENING')
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      let final = ''

      for (let i = 0; i < event.results.length; i++) {
        const item = event.results[i]
        if (item.isFinal) {
          final += item[0].transcript + ' '
        } else {
          interim += item[0].transcript
        }
      }

      const combined = (final + interim).trim()
      setTranscript(combined)
      transcriptRef.current = combined

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }

      // Auto-submit after 1.8 seconds of silence once user speaks a meaningful phrase
      if (combined.length >= 3) {
        silenceTimerRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            try {
              recognitionRef.current.stop()
            } catch {}
          }
          setIsListening(false)
          processCommand(combined)
        }, 1800)
      }
    }

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error event:', event?.error)
      const err = event?.error

      if (err === 'not-allowed' || err === 'service-not-allowed') {
        setSpeechError('not-allowed')
        setResponseMessage('Microphone access blocked. Click the lock/settings icon in the browser address bar to allow.')
      } else if (err === 'network') {
        setSpeechError('network')
        setResponseMessage(
          'Browser speech cloud blocked by network or browser privacy setting (common in Brave/Edge). Type any command below or tap the quick macros to speak!'
        )
        setTimeout(() => inputRef.current?.focus(), 150)
      } else if (err === 'language-not-supported') {
        console.warn('Language not supported, retrying with en-US fallback')
        recognition.lang = 'en-US'
        try {
          recognition.start()
          return
        } catch {}
      } else if (err === 'no-speech') {
        if (!transcriptRef.current) {
          setResponseMessage('No voice activity detected. Speak into your microphone, type below, or tap a macro.')
        }
      } else if (err === 'audio-capture') {
        setSpeechError('not-allowed')
        setResponseMessage('No microphone hardware detected. Please connect an audio input device.')
      } else {
        if (!transcriptRef.current) {
          setResponseMessage(`Voice input stopped: [${err || 'unknown'}]. You can type your command below or tap a prompt.`)
        }
      }

      setIsListening(false)
      setStatus('IDLE')
    }

    recognition.onend = () => {
      setIsListening(false)
      if (transcriptRef.current.trim() && status === 'LISTENING') {
        processCommand(transcriptRef.current.trim())
      } else if (status === 'LISTENING') {
        setStatus('IDLE')
      }
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch (e: any) {
      console.error('Failed to start recognition:', e)
      setResponseMessage('Failed to initialize microphone. Please click to retry.')
      setIsListening(false)
      setStatus('IDLE')
    }
  }

  const triggerSample = (phrase: string) => {
    setSpeechError(null)
    setTranscript(phrase)
    processCommand(phrase)
  }

  useEffect(() => {
    if (!isOpen) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort()
        } catch {}
        recognitionRef.current = null
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (typeof window !== 'undefined') {
        window.speechSynthesis?.cancel()
      }
      setIsListening(false)
      setIsSpeaking(false)
      setStatus('IDLE')
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 font-mono">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 text-slate-900 shadow-2xl p-6">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-orange-600 rounded-full" />
            <span className="text-xs font-black tracking-widest text-slate-900 uppercase">
              VOICE DISPATCH TERMINAL // AUDIO_INPUT_01
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 px-2 py-1 text-xs font-bold border border-slate-200 hover:border-slate-300 rounded-xs"
          >
            [ESC / CLOSE]
          </button>
        </div>

        {/* Audio Visualizer & Frequency Simulation */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div className="w-full bg-slate-50 border border-slate-200 p-4 mb-5">
            <div className="flex items-center justify-between text-[10px] text-slate-500 pb-2 border-b border-slate-200 mb-3">
              <span>INPUT STATUS: <strong className={status === 'LISTENING' ? 'text-orange-600' : 'text-slate-900'}>[{status}]</strong></span>
              <span>AUDIO ENGINE: ELEVENLABS NEURAL // MULTILINGUAL</span>
              <span>LOC: NAIROBI_CORRIDOR</span>
            </div>

            {/* Audio bar simulation */}
            <div className="flex items-end justify-between h-14 gap-1 px-2">
              {[15, 35, 70, 45, 85, 95, 60, 40, 80, 100, 75, 45, 65, 30, 90, 50, 20, 60, 40, 70].map((h, i) => (
                <div
                  key={i}
                  className={`w-full transition-all duration-100 ${
                    isListening || isSpeaking
                      ? 'bg-orange-500'
                      : 'bg-slate-200'
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
            className={`w-full py-4 border text-sm font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-xs ${
              isListening
                ? 'bg-orange-700 text-white border-orange-600'
                : isSpeaking
                ? 'bg-orange-50 text-orange-700 border-orange-300'
                : 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600'
            }`}
          >
            {isListening ? (
              <>
                <MicOff className="w-5 h-5 animate-pulse" />
                <span>[RECORDING... TAP TO TRANSMIT]</span>
              </>
            ) : isSpeaking ? (
              <>
                <Volume2 className="w-5 h-5 animate-bounce text-orange-600" />
                <span>[TRANSMITTING AUDIO TELEMETRY]</span>
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                <span>[CLICK TO INITIATE VOICE COMMAND]</span>
              </>
            )}
          </button>

          {/* Direct 1-Tap Voice Audio Test Buttons (Instant Neural Audio Playback) */}
          <div className="w-full mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => triggerSample('Who is cheaper and faster for maize?')}
              className="py-2 px-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-800 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="truncate">▶ PLAY BELLA: SOURCING RADAR</span>
            </button>
            <button
              type="button"
              onClick={() => triggerSample('Order 50kg maize from cheapest supplier')}
              className="py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-orange-400 text-slate-800 font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="truncate">▶ PLAY BELLA: REQUISITION</span>
            </button>
          </div>

          {/* Dedicated Brave / Edge Speech Diagnosis Card */}
          {speechError === 'network' && (
            <div className="w-full mt-3 p-3 bg-orange-50/70 border border-orange-300 text-left font-mono">
              <div className="flex items-center justify-between pb-1.5 border-b border-orange-200 mb-2">
                <span className="text-xs font-bold text-orange-950 flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-orange-600 rounded-full animate-ping" />
                  BRAVE / EDGE PRIVACY SHIELD DETECTED
                </span>
                <span className="text-[10px] text-orange-700 font-mono font-bold">ERR: NET_SPEECH_BLOCKED</span>
              </div>
              <p className="text-[11px] text-slate-700 mb-2 leading-relaxed">
                Brave blocks Google Speech Cloud recognition by default. To enable your microphone:
              </p>
              <div className="bg-white p-2 border border-orange-200 text-[11px] space-y-1 mb-2">
                <div className="text-slate-900">
                  1. Open tab: <code className="text-orange-700 underline select-all bg-orange-50 px-1 py-0.5 border border-orange-100">brave://settings/system</code>
                </div>
                <div className="text-slate-900">
                  2. Turn <strong className="text-orange-700">ON</strong>: "Use Google services for speech recognition"
                </div>
                <div className="text-slate-600">
                  3. Refresh this page & tap microphone to stream speech!
                </div>
              </div>
              <p className="text-[10px] text-orange-800 font-semibold">
                ⚡ Or type any voice command in the box below and press Enter — Bella will synthesize audio immediately!
              </p>
            </div>
          )}

          {/* Tactical Command Input (Guaranteed fallback for network or browser speech limitations) */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!manualCommand.trim()) return
              const cmd = manualCommand.trim()
              setTranscript(cmd)
              setManualCommand('')
              processCommand(cmd)
            }}
            className="w-full mt-3 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-600 font-bold text-xs">»</span>
              <input
                ref={inputRef}
                type="text"
                value={manualCommand}
                onChange={(e) => setManualCommand(e.target.value)}
                placeholder="TYPE VOICE COMMAND (e.g. 'Order 50kg maize', 'Who is cheaper?')..."
                className="w-full bg-slate-50 border border-slate-300 focus:border-orange-500 focus:bg-white text-slate-900 pl-7 pr-3 py-2.5 text-xs font-mono placeholder:text-slate-400 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider transition-colors shrink-0 shadow-xs"
            >
              TRANSMIT »
            </button>
          </form>

          {/* Transcript telemetry */}
          {transcript && (
            <div className="w-full mt-4 p-3 bg-slate-50 border border-slate-200 text-left">
              <span className="text-[10px] text-orange-600 uppercase block mb-0.5 font-bold">» RECOGNIZED PHRASE:</span>
              <p className="text-xs font-bold text-slate-900">"{transcript}"</p>
            </div>
          )}

          {/* Response Telemetry */}
          {responseMessage && (
            <div className="w-full mt-3 p-3 bg-orange-50/60 border border-orange-200 text-left">
              <span className="text-[10px] text-orange-700 uppercase block mb-0.5 font-bold">» SYSTEM DISPATCH CONFIRMATION:</span>
              <p className="text-xs font-semibold text-slate-900 leading-relaxed">
                {responseMessage}
              </p>
            </div>
          )}
        </div>

        {/* Demo Fast Triggers */}
        <div className="pt-3 border-t border-slate-200">
          <span className="text-[10px] text-slate-500 uppercase block mb-2 font-bold">
            // HARDWARE TRIGGER MACROS (TEST WITHOUT MICROPHONE):
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => triggerSample('Order 50kg maize from cheapest supplier')}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-orange-500 text-left text-slate-800 transition-colors font-medium"
            >
              [MACRO 1] » "Order 50kg maize"
            </button>
            <button
              onClick={() => triggerSample('Check stock of tomatoes')}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-orange-500 text-left text-slate-800 transition-colors font-medium"
            >
              [MACRO 2] » "Check stock of tomatoes"
            </button>
            <button
              onClick={() => triggerSample('Find supplier for beans')}
              className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-orange-500 text-left text-slate-800 transition-colors font-medium"
            >
              [MACRO 3] » "Who sells beans"
            </button>
            <button
              onClick={() => triggerSample('Who is cheaper and faster for maize?')}
              className="p-2 bg-orange-50 hover:bg-orange-100 border border-orange-300 hover:border-orange-500 text-left text-orange-950 transition-colors col-span-2 font-bold"
            >
              [★ SMART RADAR] » "Who is cheaper and faster for maize?"
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
