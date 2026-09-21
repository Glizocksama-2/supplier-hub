'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '@/types'

interface VoiceOptions {
  onTranscript?: (transcript: string, isFinal: boolean) => void
  onIntent?: (intent: string, entities: Record<string, unknown>, confidence: number) => void
  language?: string
  continuous?: boolean
  interimResults?: boolean
}

interface IntentResult {
  intent: string
  entities: Record<string, unknown>
  confidence: number
}

// Intent keywords mapping
const INTENT_PATTERNS: Record<string, RegExp[]> = {
  order: [
    /order\s+(\d+(?:\.\d+)?)\s*(kg|litres?|trays?)\s+of\s+(\w+)/i,
    /buy\s+(\d+(?:\.\d+)?)\s*(kg|litres?|trays?)\s+(\w+)/i,
    /get\s+(\d+(?:\.\d+)?)\s*(kg|litres?|trays?)\s+(\w+)/i,
    /need\s+(\d+(?:\.\d+)?)\s*(kg|litres?|trays?)\s+(\w+)/i,
  ],
  check_stock: [
    /check\s+stock\s+(?:of\s+)?(\w+)/i,
    /how\s+much\s+(\w+)\s+(?:do\s+i\s+have|left)/i,
    /stock\s+level\s+(\w+)/i,
  ],
  find_supplier: [
    /find\s+(?:a\s+)?(?:supplier|seller)\s+(?:for\s+)?(\w+)/i,
    /who\s+sells\s+(\w+)/i,
    /where\s+(?:can\s+i\s+)?get\s+(\w+)/i,
  ],
  check_orders: [
    /check\s+(?:my\s+)?orders?/i,
    /order\s+status/i,
    /where\s+(?:is\s+)?my\s+order/i,
  ],
  navigate: [
    /navigate\s+to\s+(.+)/i,
    /directions\s+to\s+(.+)/i,
  ],
  help: [
    /help/i,
    /what\s+can\s+you\s+do/i,
    /commands/i,
  ],
}

// Product synonyms for entity extraction
const PRODUCT_SYNONYMS: Record<string, string[]> = {
  maize: ['maize', 'corn'],
  beans: ['beans', 'bean'],
  rice: ['rice'],
  wheat: ['wheat'],
  tomatoes: ['tomatoes', 'tomato'],
  onions: ['onions', 'onion'],
  potatoes: ['potatoes', 'potato', 'irish'],
  cabbage: ['cabbage'],
  bananas: ['bananas', 'banana'],
  avocados: ['avocados', 'avocado'],
  milk: ['milk'],
  eggs: ['eggs', 'egg'],
  oil: ['oil', 'cooking oil', 'vegetable oil'],
  sugar: ['sugar'],
  salt: ['salt'],
}

export function useVoiceRecognition(options: VoiceOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { 
    onTranscript, 
    onIntent, 
    language = 'en-KE', 
    continuous = true, 
    interimResults = true 
  } = options

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      setIsSupported(!!SpeechRecognition)
    }
  }, [])

  const extractIntent = useCallback((text: string): IntentResult | null => {
    const lowerText = text.toLowerCase().trim()
    
    for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
      for (const pattern of patterns) {
        const match = lowerText.match(pattern)
        if (match) {
          const entities: Record<string, unknown> = {}
          
          if (intent === 'order') {
            entities.quantity = parseFloat(match[1])
            entities.unit = match[2]
            entities.product = match[3]
            
            // Normalize product name
            for (const [canonical, synonyms] of Object.entries(PRODUCT_SYNONYMS)) {
              if (synonyms.some(s => match[3].toLowerCase().includes(s))) {
                entities.product = canonical
                break
              }
            }
          } else if (['check_stock', 'find_supplier'].includes(intent)) {
            let product = match[1]
            for (const [canonical, synonyms] of Object.entries(PRODUCT_SYNONYMS)) {
              if (synonyms.some(s => product.toLowerCase().includes(s))) {
                product = canonical
                break
              }
            }
            entities.product = product
          }
          
          return { intent, entities, confidence: 0.85 }
        }
      }
    }
    
    // Check for help
    if (/help|commands|what can you do/i.test(lowerText)) {
      return { intent: 'help', entities: {}, confidence: 0.9 }
    }
    
    return null
  }, [])

  const processFinalTranscript = useCallback((finalTranscript: string) => {
    const intentResult = extractIntent(finalTranscript)
    if (intentResult && onIntent) {
      onIntent(intentResult.intent, intentResult.entities, intentResult.confidence)
    }
  }, [extractIntent, onIntent])

  const startListening = useCallback(() => {
    if (typeof window === 'undefined' || !isSupported) {
      setError('Speech recognition not supported in this browser')
      return
    }

    if (isListening) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = language
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      setTranscript('')
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = ''
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcriptPart = result[0].transcript
        
        if (result.isFinal) {
          finalTranscript += transcriptPart + ' '
        } else {
          interimTranscript += transcriptPart
        }
      }

      const fullTranscript = (finalTranscript || interimTranscript).trim()
      setTranscript(fullTranscript)
      
      if (onTranscript) {
        onTranscript(fullTranscript, event.results[event.results.length - 1].isFinal)
      }

      if (finalTranscript) {
        processFinalTranscript(finalTranscript.trim())
      }

      // Reset silence timer
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop()
        }
      }, 5000)
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error)
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(`Speech recognition error: ${event.error}`)
      }
    }

    recognition.onend = () => {
      setIsListening(false)
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      
      // Auto-restart if continuous
      if (continuous && isListening) {
        setTimeout(() => {
          if (recognitionRef.current) {
            try { recognitionRef.current.start() } catch (e) {}
          }
        }, 100)
      }
    }

    recognitionRef.current = recognition
    
    try {
      recognition.start()
    } catch (e) {
      setError('Failed to start speech recognition')
      setIsListening(false)
    }
  }, [isSupported, language, continuous, interimResults, onTranscript, processFinalTranscript])

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    setIsListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) stopListening()
    else startListening()
  }, [isListening, startListening, stopListening])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    }
  }, [])

  return {
    isListening,
    transcript,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    setTranscript,
  }
}

// ElevenLabs TTS hook
export function useElevenLabsTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const speak = useCallback(async (text: string, voiceId: string = '21m00Tcm4TlvDq8ikWAM') => {
    if (isSpeaking) return

    try {
      setIsSpeaking(true)
      
      // Call Supabase Edge Function for ElevenLabs proxy
      const { data, error } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, voice_id: voiceId }
      })

      if (error) throw error

      if (data?.audio_base64) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audio_base64), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        )
        const audioUrl = URL.createObjectURL(audioBlob)
        
        if (audioRef.current) {
          audioRef.current.pause()
          URL.revokeObjectURL(audioRef.current.src)
        }
        
        audioRef.current = new Audio(audioUrl)
        audioRef.current.onended = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }
        audioRef.current.onerror = () => {
          setIsSpeaking(false)
          URL.revokeObjectURL(audioUrl)
        }
        await audioRef.current.play()
      }
    } catch (err) {
      console.error('TTS error:', err)
      setIsSpeaking(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
      setIsSpeaking(false)
    }
  }, [])

  return { speak, stop, isSpeaking }
}

// Combined voice interface hook
export function useVoiceInterface() {
  const voiceRecognition = useVoiceRecognition()
  const tts = useElevenLabsTTS()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleVoiceCommand = useCallback(async (transcript: string) => {
    setIsProcessing(true)
    // Process intent and execute action
    // This would integrate with your app's command handlers
    setIsProcessing(false)
  }, [])

  return {
    ...voiceRecognition,
    ...tts,
    isProcessing,
    handleVoiceCommand,
  }
}