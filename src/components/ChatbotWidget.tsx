import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Cake, ImagePlus, Loader2, Send, Sparkles, X } from 'lucide-react'
import { toast } from 'sonner'
import { createOrder } from '@/lib/supabase'
import {
  extractOrderFromConversation,
  extractOrderFromMessages,
  sanitizeAssistantResponse,
  sendChatMessage,
} from '@/lib/openai'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  imageUrl?: string
}

const WELCOME_MESSAGE =
  "Welcome to Evocative Cakes. I can answer pricing and cake questions, or take your order step by step. Tap a quick option below, tell me what you're celebrating, or upload an inspiration photo."

const QUICK_ACTIONS = [
  { label: 'Place an order', prompt: 'I want to place an order.' },
  { label: 'Pricing', prompt: 'Can you tell me about pricing?' },
  { label: 'Flavors', prompt: 'What flavors do you offer?' },
  { label: 'Delivery', prompt: 'Do you offer delivery or pickup?' },
]

const PROMPT_DELAY_MS = 8000
const PROMPT_VISIBLE_MS = 12000

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

function createOrderSignature(orderData: {
  customer_name: string
  customer_email: string
  customer_phone: string
  event_type: string
  event_date?: string
  cake_description: string
}) {
  return [
    orderData.customer_name,
    orderData.customer_email,
    orderData.customer_phone,
    orderData.event_type,
    orderData.event_date || '',
    orderData.cake_description,
  ]
    .join('|')
    .toLowerCase()
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: WELCOME_MESSAGE,
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showPromptBubble, setShowPromptBubble] = useState(false)
  const [hasPromptShown, setHasPromptShown] = useState(false)
  const [isMobileViewport, setIsMobileViewport] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lastSubmittedOrderRef = useRef<string | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    textareaRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || isLoading) {
      return
    }

    const focusFrame = window.requestAnimationFrame(() => {
      textareaRef.current?.focus()
    })

    return () => window.cancelAnimationFrame(focusFrame)
  }, [isLoading, isOpen, messages.length])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 639px)')
    const updateViewport = () => setIsMobileViewport(mediaQuery.matches)

    updateViewport()
    mediaQuery.addEventListener('change', updateViewport)

    return () => mediaQuery.removeEventListener('change', updateViewport)
  }, [])

  useEffect(() => {
    if (!(isOpen && isMobileViewport)) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isMobileViewport, isOpen])

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true)
      setShowPromptBubble(false)
      setHasPromptShown(true)
    }

    window.addEventListener('open-chatbot', handleOpenChatbot)
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot)
  }, [])

  useEffect(() => {
    if (isOpen || hasPromptShown) {
      return
    }

    const timer = window.setTimeout(() => {
      setShowPromptBubble(true)
      setHasPromptShown(true)
    }, PROMPT_DELAY_MS)

    return () => window.clearTimeout(timer)
  }, [hasPromptShown, isOpen])

  useEffect(() => {
    if (!showPromptBubble || isOpen) {
      return
    }

    const timer = window.setTimeout(() => {
      setShowPromptBubble(false)
    }, PROMPT_VISIBLE_MS)

    return () => window.clearTimeout(timer)
  }, [isOpen, showPromptBubble])

  const openChat = () => {
    setIsOpen(true)
    setShowPromptBubble(false)
    setHasPromptShown(true)
  }

  const applyImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be less than 10MB')
      return
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setUploadedImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setUploadedImage(null)
    setImagePreview(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const sendMessage = async (messageOverride?: string) => {
    const nextInput = (messageOverride ?? inputValue).trim()

    if (!nextInput && !uploadedImage) {
      return
    }

    openChat()

    const currentImage = uploadedImage
    const currentImagePreview = imagePreview

    let imageBase64: string | null = null
    if (currentImage) {
      imageBase64 = await readFileAsDataUrl(currentImage)
    }

    const userMessage: Message = {
      role: 'user',
      content: nextInput,
      timestamp: new Date(),
      imageUrl: imageBase64 || currentImagePreview || undefined,
    }

    const conversationHistory = [
      ...messages.map((message) => ({
        role: message.role as 'user' | 'assistant',
        content:
          message.content ||
          (message.imageUrl ? 'Customer shared a cake inspiration image for reference.' : ''),
      })),
      {
        role: 'user' as const,
        content: nextInput || 'Here is a cake inspiration image for reference.',
      },
    ]

    setMessages((previous) => [...previous, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const rawAssistantResponse = await sendChatMessage(
        conversationHistory,
        imageBase64 || undefined
      )
      const orderData =
        extractOrderFromConversation(rawAssistantResponse) ||
        extractOrderFromMessages(conversationHistory, Boolean(currentImage))
      const displayResponse =
        sanitizeAssistantResponse(rawAssistantResponse) ||
        "Perfect, I've captured your request and our team will follow up soon."

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: displayResponse,
          timestamp: new Date(),
        },
      ])

      if (orderData) {
        const orderSignature = createOrderSignature(orderData)

        if (lastSubmittedOrderRef.current !== orderSignature) {
          const result = await createOrder(
            {
              source: 'chatbot',
              customer_name: orderData.customer_name,
              customer_email: orderData.customer_email,
              customer_phone: orderData.customer_phone,
              event_type: orderData.event_type,
              event_date: orderData.event_date,
              cake_description: orderData.cake_description,
              dietary_restrictions: orderData.dietary_restrictions,
              serving_size: orderData.serving_size,
              design_preferences: orderData.design_preferences,
            },
            currentImage ? [currentImage] : undefined
          )

          lastSubmittedOrderRef.current = orderSignature
          toast.success(
            result.customerAcknowledgementSent
              ? "Your cake request has been received. A confirmation email is on the way."
              : "Your cake request has been received. We'll follow up soon."
          )
        }
      }

      if (currentImage) {
        removeImage()
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
      window.requestAnimationFrame(() => {
        textareaRef.current?.focus()
      })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    applyImageFile(file)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = event.clipboardData?.items
    if (!items) {
      return
    }

    for (let index = 0; index < items.length; index += 1) {
      if (items[index].type.includes('image')) {
        const file = items[index].getAsFile()
        if (!file) {
          continue
        }

        applyImageFile(file)
        toast.success('Image pasted. Send it whenever you are ready.')
      }
    }
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && showPromptBubble && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 z-50 w-[min(18rem,calc(100vw-2rem))] rounded-3xl border border-pink-200/80 bg-pink-50/75 p-4 text-left shadow-[0_16px_36px_rgba(236,72,153,0.14)] backdrop-blur-lg sm:bottom-28 sm:right-6"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg">
                <motion.div
                  animate={{ rotate: [0, 14, -10, 0] }}
                  transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Cake className="h-5 w-5" />
                </motion.div>
              </div>

              <button
                type="button"
                onClick={openChat}
                className="min-w-0 flex-1 text-left"
              >
                <p className="text-sm font-semibold text-slate-900">Have questions?</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">
                  I can help or take your order interactively.
                </p>
              </button>

              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  setShowPromptBubble(false)
                }}
                className="rounded-full p-1 text-slate-400 transition-colors hover:bg-pink-100/80 hover:text-pink-600"
                aria-label="Dismiss chat prompt"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            onClick={openChat}
            className="group fixed bottom-4 right-4 z-50 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-4 text-white shadow-[0_20px_45px_rgba(168,85,247,0.38)] transition-all duration-300 hover:from-pink-600 hover:to-purple-600 hover:shadow-[0_24px_50px_rgba(168,85,247,0.44)] sm:bottom-6 sm:right-6"
            aria-label="Open chat assistant"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Cake className="h-6 w-6" />
            </motion.div>
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-green-500 animate-pulse"></span>

            <div className="pointer-events-none absolute bottom-full right-0 mb-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <div className="whitespace-nowrap rounded-full bg-slate-900 px-3 py-2 text-sm text-white shadow-lg">
                Cake concierge
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && isMobileViewport && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-slate-950/18 backdrop-blur-[2px] sm:hidden"
            aria-label="Close chat assistant backdrop"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-x-3 bottom-3 z-50 flex h-[min(82svh,42rem)] flex-col overflow-hidden rounded-[1.75rem] border border-pink-100/80 bg-white/98 shadow-[0_24px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(78vh,640px)] sm:w-[420px] sm:rounded-[2rem] sm:shadow-[0_28px_80px_rgba(15,23,42,0.22)]"
          >
            <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 px-4 py-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20">
                    <motion.div
                      animate={{ rotate: [0, 10, -8, 0] }}
                      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Cake className="h-5 w-5" />
                    </motion.div>
                  </div>

                  <div>
                    <h3 className="font-semibold">EVO Cakes Concierge</h3>
                    <p className="text-xs text-white/85">
                      Answers questions and takes orders
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-2 transition-colors hover:bg-white/20"
                  aria-label="Close chat assistant"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="border-b border-pink-100 bg-gradient-to-b from-white to-pink-50/60 px-4 py-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-purple-500">
                <Sparkles className="h-3.5 w-3.5" />
                Quick Help
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    onClick={() => void sendMessage(action.prompt)}
                    disabled={isLoading}
                    className="shrink-0 rounded-full border border-purple-200 bg-white px-3 py-2 text-sm font-medium text-purple-700 shadow-sm transition-all hover:border-purple-300 hover:bg-purple-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-pink-50/60 via-white to-purple-50/40 p-4 overscroll-contain">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}-${message.timestamp.getTime()}`}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-[1.5rem] px-4 py-3 shadow-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                        : 'border border-white bg-white/95 text-slate-800'
                    }`}
                  >
                    {message.imageUrl && (
                      <img
                        src={message.imageUrl}
                        alt="Cake inspiration"
                        className="mb-3 w-full rounded-2xl border border-pink-100 object-cover"
                      />
                    )}

                    {message.content && (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                    <p
                      className={`text-xs ${
                        message.content ? 'mt-2' : 'mt-0'
                      } ${
                        message.role === 'user' ? 'text-white/75' : 'text-slate-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-[1.5rem] border border-white bg-white/95 px-4 py-3 shadow-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {imagePreview && (
              <div className="border-t border-pink-100 bg-pink-50/80 px-4 py-3">
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-20 w-20 rounded-2xl border border-pink-100 object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -right-2 -top-2 rounded-full bg-slate-900 p-1 text-white transition-colors hover:bg-slate-700"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}

            <div className="border-t border-pink-100 bg-white px-4 py-4">
              <div className="flex items-end gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-purple-100 p-2.5 text-purple-600 transition-colors hover:bg-purple-200"
                  disabled={isLoading}
                  aria-label="Upload cake inspiration image"
                >
                  <ImagePlus className="h-5 w-5" />
                </button>

                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  onPaste={handlePaste}
                  placeholder="Ask about pricing or start your order..."
                  rows={1}
                  className="max-h-24 flex-1 resize-none rounded-2xl border border-pink-100 px-4 py-3 text-sm text-slate-700 outline-none transition-all focus:border-purple-300 focus:ring-2 focus:ring-purple-200"
                  disabled={isLoading}
                />

                <button
                  onClick={() => void sendMessage()}
                  disabled={(!inputValue.trim() && !uploadedImage) || isLoading}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 p-2.5 text-white transition-all hover:from-pink-600 hover:to-purple-600 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
