"use client"

import React from "react"
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
  Paperclip,
  Image as ImageIcon,
  X,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Import dummy data
import dummyData from "@/lib/dummy-data.json"

interface UploadedImage {
  id: string
  file: File
  url: string
  name: string
}

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  language: string
  isEmergency?: boolean
  images?: UploadedImage[]
}

export default function ChatbotPage(): JSX.Element {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isListening, setIsListening] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
  ]

  const scrollToBottom = (): void => {
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
        "Hello! I'm your AI health assistant. How can I help you today? You can also upload images of symptoms or medical documents.",
      timestamp: new Date(),
      language: selectedLanguage,
    }
    setMessages([welcomeMessage])
  }, [selectedLanguage])

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    const newImages: UploadedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type (only images)
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file. Please upload only images.`)
        continue
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Please upload images smaller than 5MB.`)
        continue
      }

      const imageUrl = URL.createObjectURL(file)
      const uploadedImage: UploadedImage = {
        id: `img_${Date.now()}_${i}`,
        file,
        url: imageUrl,
        name: file.name
      }
      
      newImages.push(uploadedImage)
    }

    setUploadedImages(prev => [...prev, ...newImages])
    setIsUploading(false)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Remove uploaded image
  const removeImage = (imageId: string): void => {
    setUploadedImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.url)
      }
      return prev.filter(img => img.id !== imageId)
    })
  }

  // Format the API response for display
  const formatMedicalResponse = (response: any): string => {
    if (!response || typeof response === 'string') {
      return response || "I've analyzed your message and images. Please consult with a healthcare professional for proper diagnosis."
    }

    if (response.raw) {
      return response.raw
    }

    // Format the structured medical response
    let formatted = ""
    
    if (response.classification) {
      formatted += `**Classification: ${response.classification}**\n\n`
    }
    
    if (response.summary) {
      formatted += `**Summary:** ${response.summary}\n\n`
    }
    
    if (response.reasoning) {
      formatted += `**Analysis:** ${response.reasoning}\n\n`
    }
    
    if (response.recommended_care && Array.isArray(response.recommended_care)) {
      formatted += `**Recommended Care:**\n`
      response.recommended_care.forEach((care: string, index: number) => {
        formatted += `${index + 1}. ${care}\n`
      })
      formatted += `\n`
    }
    
    if (response.next_steps) {
      formatted += `**Next Steps:** ${response.next_steps}\n\n`
    }
    
    formatted += `\n⚠️ **Important:** This is AI-generated guidance. Please consult a healthcare professional for proper medical diagnosis and treatment.`
    
    return formatted
  }

  // Handle message submission with API call
  const handleSubmit = async (): Promise<void> => {
    if (!inputMessage.trim() && uploadedImages.length === 0) return

    setIsSubmitting(true)

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage || "Uploaded images",
      timestamp: new Date(),
      language: selectedLanguage,
      images: uploadedImages.length > 0 ? [...uploadedImages] : undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      // Prepare form data for API call
      const formData = new FormData()
      formData.append('message', inputMessage)
      formData.append('language', selectedLanguage)
      
      // Add images to form data
      uploadedImages.forEach((image, index) => {
        formData.append(`images`, image.file)
      })

      // Call Next.js API route
      const response = await fetch('/api/chatbot/analyze', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to get response from AI assistant')
      }

      const data = await response.json()
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: formatMedicalResponse(data.response),
        timestamp: new Date(),
        language: selectedLanguage,
        isEmergency: data.response?.classification === 'CRITICAL' || data.isEmergency || false,
      }

      setMessages((prev) => [...prev, botMessage])
      
    } catch (error) {
      console.error('Error calling chatbot API:', error)
      
      // Fallback to local AI response
      const aiResponse = getAIResponse(inputMessage, selectedLanguage)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: aiResponse.content + (uploadedImages.length > 0 ? " I can see you've uploaded images, but I'm having trouble analyzing them right now. Please try again later or consult a healthcare professional." : ""),
        timestamp: new Date(),
        language: selectedLanguage,
        isEmergency: aiResponse.isEmergency,
      }

      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsTyping(false)
      setIsSubmitting(false)
      
      // Clear uploaded images after submission
      uploadedImages.forEach(image => {
        URL.revokeObjectURL(image.url)
      })
      setUploadedImages([])
    }
  }

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

  const handleSendMessage = async (): Promise<void> => {
    await handleSubmit()
  }

  const handleVoiceInput = (): void => {
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const speakMessage = (text: string): void => {
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
            <Link href="/dashboard/refugee" passHref>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
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
              <ScrollArea className="h-full p-4">
                <div className="space-y-4">
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
                          
                          {/* Display uploaded images */}
                          {message.images && message.images.length > 0 && (
                            <div className="mb-3">
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                {message.images.map((image) => (
                                  <div key={image.id} className="relative">
                                    <Image
                                      src={image.url}
                                      alt={image.name}
                                      width={150}
                                      height={150}
                                      className="rounded-lg object-cover"
                                    />
                                    <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-xs p-1 rounded text-center truncate">
                                      {image.name}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {/* Updated message content display */}
                          <div className="text-sm leading-relaxed">
                            {message.content.split('\n').map((line, index) => {
                              if (line.startsWith('**') && line.endsWith('**')) {
                                // Bold headings
                                return (
                                  <div key={index} className="font-semibold text-foreground mb-2">
                                    {line.slice(2, -2)}
                                  </div>
                                )
                              } else if (line.startsWith('⚠️')) {
                                // Warning message
                                return (
                                  <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3 text-yellow-800 text-xs">
                                    {line}
                                  </div>
                                )
                              } else if (line.trim() === '') {
                                // Empty line
                                return <br key={index} />
                              } else {
                                // Regular text
                                return (
                                  <div key={index} className="mb-1">
                                    {line}
                                  </div>
                                )
                              }
                            })}
                          </div>
                          
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

            {/* Image Preview Area */}
            {uploadedImages.length > 0 && (
              <div className="border-t p-4 bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Attached Images ({uploadedImages.length})</span>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {uploadedImages.map((image) => (
                    <div key={image.id} className="relative flex-shrink-0">
                      <Image
                        src={image.url}
                        alt={image.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover border"
                      />
                      <Button
                        size="sm"
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 p-0 rounded-full"
                        onClick={() => removeImage(image.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                    className="pr-20"
                    dir={selectedLanguage === "ar" ? "rtl" : "ltr"}
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-muted-foreground"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading || isSubmitting}
                    >
                      {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Paperclip className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-8 w-8 p-0 ${
                        isListening ? "text-red-500" : "text-muted-foreground"
                      }`}
                      onClick={handleVoiceInput}
                      disabled={isSubmitting}
                    >
                      {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button 
                  onClick={handleSendMessage} 
                  disabled={(!inputMessage.trim() && uploadedImages.length === 0) || isTyping || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              
              {isListening && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Listening... Speak now
                </p>
              )}
              
              {isUploading && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading images...
                </p>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        {/* <motion.div
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
                <Link href="/symptom-checker" passHref>
                  <Button variant="outline" className="justify-start bg-transparent w-full">
                    <Heart className="w-4 h-4 mr-2" />
                    Symptom Checker
                  </Button>
                </Link>
                <Link href="/map" passHref>
                  <Button variant="outline" className="justify-start bg-transparent w-full">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Find Services
                  </Button>
                </Link>
                <Link href="/health-hub" passHref>
                  <Button variant="outline" className="justify-start bg-transparent w-full">
                    <Bot className="w-4 h-4 mr-2" />
                    Health Education
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div> */}
      </div>
    </div>
  )
}