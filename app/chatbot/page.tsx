"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Navigation } from "@/components/navigation"
import {
  MessageCircle,
  Send,
  Mic,
  MicOff,
  Volume2,
  Languages,
  Bot,
  User,
  AlertTriangle,
  Heart,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

// Import dummy data
import dummyData from "@/lib/dummy-data.json"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  language: string
  isEmergency?: boolean
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add welcome message when component mounts
    const welcomeMessage: Message = {
      id: "welcome",
      type: "bot",
      content:
        dummyData.chatbotResponses[selectedLanguage as keyof typeof dummyData.chatbotResponses]?.greeting ||
        "Hello! I'm your AI health assistant. How can I help you today?",
      timestamp: new Date(),
      language: selectedLanguage,
    }
    setMessages([welcomeMessage])
  }, [selectedLanguage])

  const getAIResponse = (userMessage: string, language: string): { content: string; isEmergency: boolean } => {
    const lowerMessage = userMessage.toLowerCase()
    const responses = dummyData.chatbotResponses[language as keyof typeof dummyData.chatbotResponses]

    // Emergency keywords detection
    const emergencyKeywords = [
      "emergency",
      "urgent",
      "severe pain",
      "can't breathe",
      "chest pain",
      "bleeding",
      "unconscious",
      "طوارئ",
      "عاجل",
      "ألم شديد",
      "لا أستطيع التنفس",
      "ألم في الصدر",
      "نزيف",
      "urgence",
      "douleur sévère",
      "ne peux pas respirer",
      "douleur thoracique",
      "saignement",
    ]

    const isEmergency = emergencyKeywords.some((keyword) => lowerMessage.includes(keyword))

    if (isEmergency) {
      return {
        content:
          responses?.emergency ||
          "This sounds like it could be serious. Please seek immediate medical attention or call emergency services at 112.",
        isEmergency: true,
      }
    }

    // Fever and cough symptoms
    if (
      lowerMessage.includes("fever") ||
      lowerMessage.includes("cough") ||
      lowerMessage.includes("حمى") ||
      lowerMessage.includes("سعال") ||
      lowerMessage.includes("fièvre") ||
      lowerMessage.includes("toux")
    ) {
      return {
        content:
          responses?.fever_cough ||
          "Based on your symptoms of fever and cough, you may have a mild respiratory infection. Please rest, drink plenty of fluids, and monitor your temperature.",
        isEmergency: false,
      }
    }

    // Default responses based on language
    const defaultResponses = {
      en: [
        "I understand your concern. Can you tell me more about your symptoms?",
        "Thank you for sharing that information. How long have you been experiencing these symptoms?",
        "Based on what you've told me, I recommend monitoring your symptoms. If they worsen, please seek medical attention.",
        "It's important to stay hydrated and get plenty of rest. Would you like me to help you find nearby medical services?",
      ],
      ar: [
        "أفهم قلقك. هل يمكنك إخباري المزيد عن أعراضك؟",
        "شكراً لك على مشاركة هذه المعلومات. منذ متى وأنت تعاني من هذه الأعراض؟",
        "بناءً على ما أخبرتني به، أنصح بمراقبة أعراضك. إذا ساءت، يرجى طلب العناية الطبية.",
        "من المهم البقاء رطباً والحصول على قسط كافٍ من الراحة. هل تريد مني مساعدتك في العثور على الخدمات الطبية القريبة؟",
      ],
      fr: [
        "Je comprends votre préoccupation. Pouvez-vous me parler davantage de vos symptômes?",
        "Merci de partager cette information. Depuis combien de temps ressentez-vous ces symptômes?",
        "D'après ce que vous m'avez dit, je recommande de surveiller vos symptômes. S'ils s'aggravent, consultez un médecin.",
        "Il est important de rester hydraté et de bien se reposer. Voulez-vous que je vous aide à trouver des services médicaux à proximité?",
      ],
    }

    const langResponses = defaultResponses[language as keyof typeof defaultResponses] || defaultResponses.en
    const randomResponse = langResponses[Math.floor(Math.random() * langResponses.length)]

    return {
      content: randomResponse,
      isEmergency: false,
    }
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
      language: selectedLanguage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage, selectedLanguage)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: aiResponse.content,
        timestamp: new Date(),
        language: selectedLanguage,
        isEmergency: aiResponse.isEmergency,
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true)
      // Simulate voice recognition
      setTimeout(() => {
        setInputMessage("I have fever and cough")
        setIsListening(false)
      }, 2000)
    } else {
      setIsListening(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const speakMessage = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = selectedLanguage === "ar" ? "ar-SA" : selectedLanguage === "fr" ? "fr-FR" : "en-US"
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/10">
      <Navigation userRole="refugee" />
      <div className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/refugee">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-primary" />
              AI Health Assistant
            </h1>
            <p className="text-muted-foreground">Get instant medical guidance in your preferred language</p>
          </motion.div>
        </div>

        {/* Language Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Languages className="w-5 h-5 text-primary" />
                <span className="font-medium">Language:</span>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                HealthBridge AI Assistant
                <Badge variant="secondary" className="ml-auto">
                  Online
                </Badge>
              </CardTitle>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-96 p-4 overflow-y-auto">
                <div className="space-y-4 ">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.type === "bot" && (
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : message.isEmergency
                                ? "bg-destructive/10 border border-destructive/20"
                                : "bg-muted"
                          }`}
                        >
                          {message.isEmergency && (
                            <div className="flex items-center gap-2 mb-2 text-destructive">
                              <AlertTriangle className="w-4 h-4" />
                              <span className="text-xs font-medium">EMERGENCY ALERT</span>
                            </div>
                          )}
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs opacity-70">
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            {message.type === "bot" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                onClick={() => speakMessage(message.content)}
                              >
                                <Volume2 className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                        {message.type === "user" && (
                          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-secondary-foreground" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>
            </CardContent>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={
                      selectedLanguage === "ar"
                        ? "اكتب رسالتك هنا..."
                        : selectedLanguage === "fr"
                          ? "Tapez votre message ici..."
                          : "Type your message here..."
                    }
                    className="pr-12"
                    dir={selectedLanguage === "ar" ? "rtl" : "ltr"}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 ${
                      isListening ? "text-red-500" : "text-muted-foreground"
                    }`}
                    onClick={handleVoiceInput}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {isListening && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Listening... Speak now
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start bg-transparent" asChild>
                  <Link href="/symptom-checker">
                    <Heart className="w-4 h-4 mr-2" />
                    Symptom Checker
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start bg-transparent" asChild>
                  <Link href="/map">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Find Services
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start bg-transparent" asChild>
                  <Link href="/health-hub">
                    <Bot className="w-4 h-4 mr-2" />
                    Health Education
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
