"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  BookOpen,
  Search,
  Play,
  Download,
  Share,
  Globe,
  Eye,
  CheckCircle,
  Clock,
  Users,
  MessageCircle,
  MapPin,
  Phone,
  AlertTriangle,
  Heart,
  Brain,
  Stethoscope,
  Pill,
  Shield,
  Baby,
  UserCheck,
  X,
  ChevronRight,
  Star,
  HelpCircle,
  Mic,
  Volume2
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

interface HealthEducationItem {
  id: string
  title: string
  description: string
  content: string
  category: string
  languages: string[]
  difficulty: string
  duration: string
  type: string
  progress: number
  quiz?: Quiz
}

interface Quiz {
  id: string
  title: string
  questions: QuizQuestion[]
  passingScore: number
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface SymptomChecker {
  symptoms: string[]
  urgency: 'low' | 'medium' | 'high' | 'emergency'
  recommendations: string[]
  nearbyServices?: HealthService[]
}

interface HealthService {
  id: string
  name: string
  type: string
  address: string
  phone: string
  distance: string
  availability: string
  languages: string[]
  services: string[]
}

export default function RefugeeHealthAssistant() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [languageFilter, setLanguageFilter] = useState("en")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [selectedContent, setSelectedContent] = useState<any>(null)
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<{[key: string]: number}>({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [chatInput, setChatInput] = useState("")

  const categories = [
    "Prevention",
    "Emergency",
    "Nutrition", 
    "Mental Health",
    "Women's Health",
    "Child Care",
    "Chronic Conditions",
    "Maternal Health",
    "Infectious Diseases",
    "First Aid"
  ]

  // Extended language support including major Indian languages
  const languages = [
    "en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es", "ps", "fa", "so", "sw"
  ]

  const languageNames = {
    en: "English",
    hi: "हिंदी (Hindi)",
    bn: "বাংলা (Bengali)", 
    te: "తెలుగు (Telugu)",
    ta: "தமிழ் (Tamil)",
    mr: "मराठी (Marathi)",
    gu: "ગુજરાતી (Gujarati)",
    kn: "ಕನ್ನಡ (Kannada)",
    ml: "മലയാളം (Malayalam)",
    pa: "ਪੰਜਾਬੀ (Punjabi)",
    ur: "اردو (Urdu)",
    or: "ଓଡ଼ିଆ (Odia)",
    as: "অসমীয়া (Assamese)",
    ar: "العربية (Arabic)",
    fr: "Français (French)",
    es: "Español (Spanish)",
    ps: "پښتو (Pashto)",
    fa: "فارسی (Persian)",
    so: "Soomaali (Somali)",
    sw: "Kiswahili (Swahili)"
  }

  const difficulties = ["beginner", "intermediate", "advanced"]

  const difficultyNames = {
    beginner: "Beginner",
    intermediate: "Intermediate", 
    advanced: "Advanced",
  }

  // Check for speech recognition support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true)
    }
  }, [])

  // Enhanced educational content with comprehensive quizzes in all languages
  const educationalContent: HealthEducationItem[] = [
    {
      id: "edu-001",
      title: "Basic First Aid for Cuts & Bruises",
      description: "Learn how to clean and treat minor injuries safely at home.",
      content: "Clean the wound with clean water, apply antiseptic if available, and cover with a sterile bandage. Apply pressure to stop bleeding. Seek medical help if the cut is deep, won't stop bleeding, or shows signs of infection.",
      category: "Emergency",
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es"],
      difficulty: "beginner",
      duration: "7 min",
      type: "interactive",
      progress: 0,
      quiz: {
        id: "quiz-001",
        title: "First Aid Knowledge Check",
        passingScore: 70,
        questions: [
          {
            id: "q1",
            question: "What is the first step when treating a minor cut?",
            options: [
              "Apply bandage immediately",
              "Clean hands and wound with clean water", 
              "Apply antibiotic cream",
              "Call emergency services"
            ],
            correctAnswer: 1,
            explanation: "Always clean your hands and the wound first to prevent infection and further contamination."
          },
          {
            id: "q2", 
            question: "When should you seek medical help for a cut?",
            options: [
              "Only if it's bleeding heavily",
              "If it's deeper than 1/4 inch or won't stop bleeding",
              "Never, always treat at home",
              "Only if it's on the face"
            ],
            correctAnswer: 1,
            explanation: "Deep cuts, continuous bleeding, signs of infection, or cuts on joints require medical attention."
          },
          {
            id: "q3",
            question: "What should you do if debris is stuck in a wound?",
            options: [
              "Remove it immediately with tweezers",
              "Leave it and clean around it, then seek medical help",
              "Push it deeper to clean the wound",
              "Ignore it completely"
            ],
            correctAnswer: 1,
            explanation: "Never remove large debris from deep wounds as this can cause more damage and bleeding."
          },
          {
            id: "q4",
            question: "How long should you apply pressure to control bleeding?",
            options: [
              "30 seconds",
              "1-2 minutes", 
              "5-10 minutes continuously",
              "Until the bleeding completely stops"
            ],
            correctAnswer: 3,
            explanation: "Apply continuous pressure until bleeding stops completely, which may take several minutes."
          }
        ]
      }
    },
    {
      id: "edu-002", 
      title: "Healthy Nutrition with Limited Resources",
      description: "Understand food groups and how to balance meals daily with limited resources.",
      content: "Focus on affordable nutritious foods like lentils, rice, seasonal vegetables, and clean water. Your body needs carbohydrates for energy, proteins for muscle repair, healthy fats for brain function, vitamins and minerals for immunity.",
      category: "Nutrition",
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es"],
      difficulty: "beginner",
      duration: "10 min", 
      type: "article",
      progress: 0,
      quiz: {
        id: "quiz-002", 
        title: "Nutrition Basics Assessment",
        passingScore: 70,
        questions: [
          {
            id: "q1",
            question: "Which affordable food provides the most complete protein?",
            options: [
              "White rice only",
              "Lentils and rice together",
              "Vegetables only", 
              "Bread alone"
            ],
            correctAnswer: 1,
            explanation: "Combining lentils and rice provides all essential amino acids for complete protein nutrition."
          },
          {
            id: "q2",
            question: "How many meals should you try to eat daily, even with limited food?",
            options: [
              "1 large meal",
              "2 medium meals",
              "3 small meals if possible",
              "Only when very hungry"
            ],
            correctAnswer: 2,
            explanation: "Three smaller meals help maintain energy and blood sugar levels throughout the day."
          },
          {
            id: "q3",
            question: "What is the most important nutrient when food is limited?",
            options: [
              "Vitamins",
              "Clean water",
              "Proteins", 
              "Fats"
            ],
            correctAnswer: 1,
            explanation: "Clean water is essential for all body functions and becomes critical when food intake is reduced."
          },
          {
            id: "q4",
            question: "Which vegetables provide the most nutrition per cost?",
            options: [
              "Expensive imported vegetables",
              "Local seasonal vegetables",
              "Canned vegetables only",
              "Frozen vegetables only"
            ],
            correctAnswer: 1,
            explanation: "Local seasonal vegetables are usually fresher, cheaper, and more nutritious than processed alternatives."
          }
        ]
      }
    },
    {
      id: "edu-003",
      title: "Mental Health During Displacement",
      description: "Mental health techniques specifically for refugees and displaced persons.",
      content: "Displacement creates unique stresses. Practice deep breathing (4-7-8 technique), maintain routines when possible, connect with your community, and remember that seeking help shows strength, not weakness.",
      category: "Mental Health", 
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es", "ps", "so"],
      difficulty: "beginner",
      duration: "12 min",
      type: "video",
      progress: 0,
      quiz: {
        id: "quiz-003",
        title: "Mental Health Awareness Check",
        passingScore: 70,
        questions: [
          {
            id: "q1",
            question: "What is the 4-7-8 breathing technique?",
            options: [
              "Breathe in for 4, hold for 7, out for 8 seconds",
              "Breathe 4 times, rest 7 minutes, repeat 8 times",
              "Count to 4-7-8 while breathing normally",
              "Breathe fast for 4-7-8 minutes"
            ],
            correctAnswer: 0,
            explanation: "The 4-7-8 technique: inhale for 4 counts, hold for 7, exhale slowly for 8 counts to reduce anxiety."
          },
          {
            id: "q2",
            question: "What should you do if you feel overwhelmed by displacement stress?",
            options: [
              "Keep all feelings inside",
              "Avoid talking to anyone",
              "Reach out to trusted community members or counselors",
              "Try to ignore all emotions"
            ],
            correctAnswer: 2,
            explanation: "Sharing feelings with trusted people helps process trauma and reduces isolation during difficult times."
          },
          {
            id: "q3",
            question: "How can maintaining routines help during displacement?",
            options: [
              "Routines are impossible in displacement",
              "They provide stability and sense of control",
              "Only children need routines",
              "Routines make displacement harder"
            ],
            correctAnswer: 1,
            explanation: "Even small routines like regular meal times or prayer can provide psychological stability and comfort."
          },
          {
            id: "q4",
            question: "When should you seek professional mental health support?",
            options: [
              "Only when you can't function at all",
              "Mental health support is not for refugees", 
              "When stress interferes with daily life or relationships",
              "Never, you should handle it alone"
            ],
            correctAnswer: 2,
            explanation: "Seeking help early when stress affects daily functioning can prevent more serious mental health problems."
          }
        ]
      }
    },
    {
      id: "edu-004",
      title: "Maternal Health in Crisis Situations",
      description: "Essential prenatal and postnatal care when access to healthcare is limited.",
      content: "Attend available checkups when possible, eat nutritious food, stay physically active within limits, recognize danger signs (severe bleeding, severe headaches, difficulty breathing), and know when to seek emergency help.",
      category: "Women's Health",
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es", "sw"],
      difficulty: "intermediate", 
      duration: "14 min",
      type: "interactive",
      progress: 0,
      quiz: {
        id: "quiz-004",
        title: "Maternal Health Knowledge Test",
        passingScore: 75,
        questions: [
          {
            id: "q1",
            question: "What are danger signs during pregnancy that require immediate medical attention?",
            options: [
              "Mild nausea and tiredness",
              "Severe bleeding, severe headaches, or difficulty breathing",
              "Feeling the baby move less",
              "Normal pregnancy discomfort"
            ],
            correctAnswer: 1,
            explanation: "Severe bleeding, persistent severe headaches, and difficulty breathing are emergency signs requiring immediate medical care."
          },
          {
            id: "q2",
            question: "How often should a pregnant woman try to eat, even with limited food?",
            options: [
              "Once a day",
              "Only when very hungry",
              "Small amounts frequently throughout the day",
              "Only large meals"
            ],
            correctAnswer: 2,
            explanation: "Frequent small meals help maintain blood sugar and provide steady nutrition for mother and baby."
          },
          {
            id: "q3",
            question: "What should you do if you experience severe abdominal pain during pregnancy?",
            options: [
              "Wait and see if it goes away",
              "Seek medical help immediately",
              "Take pain medication and rest",
              "Ignore it as normal pregnancy pain"
            ],
            correctAnswer: 1,
            explanation: "Severe abdominal pain during pregnancy can indicate serious complications and requires immediate medical evaluation."
          },
          {
            id: "q4",
            question: "After giving birth, what sign indicates you need urgent medical care?",
            options: [
              "Feeling tired",
              "Heavy bleeding that soaks more than one pad per hour",
              "Some soreness",
              "Difficulty sleeping"
            ],
            correctAnswer: 1,
            explanation: "Heavy bleeding after birth (soaking more than one pad per hour) can be life-threatening and requires immediate medical attention."
          }
        ]
      }
    },
    {
      id: "edu-005",
      title: "Child Health and Vaccination in Displacement",
      description: "Importance of maintaining child health and vaccination schedules during displacement.",
      content: "Vaccines protect children from measles, polio, diphtheria, and other diseases. Keep vaccination cards safe, seek catch-up vaccines if missed, maintain health records for school and resettlement, and watch for signs of malnutrition.",
      category: "Child Care",
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es"],
      difficulty: "beginner",
      duration: "9 min",
      type: "article",
      progress: 0,
      quiz: {
        id: "quiz-005",
        title: "Child Health Assessment",
        passingScore: 70,
        questions: [
          {
            id: "q1",
            question: "What should you do if your child missed vaccinations due to displacement?",
            options: [
              "Wait until resettlement to catch up",
              "Vaccinations are not important after displacement",
              "Seek catch-up vaccinations as soon as possible",
              "Only worry about it if the child gets sick"
            ],
            correctAnswer: 2,
            explanation: "Catch-up vaccinations should be obtained as soon as possible to protect against preventable diseases."
          },
          {
            id: "q2",
            question: "What are early signs of malnutrition in children?",
            options: [
              "Active and energetic behavior",
              "Loss of weight, fatigue, and irritability",
              "Normal growth and development",
              "Increased appetite"
            ],
            correctAnswer: 1,
            explanation: "Weight loss, unusual fatigue, irritability, and slow growth can indicate malnutrition requiring immediate attention."
          },
          {
            id: "q3",
            question: "How important is it to keep vaccination records during displacement?",
            options: [
              "Not important at all",
              "Only important for school enrollment",
              "Critical for health tracking and resettlement processes",
              "Only important in your home country"
            ],
            correctAnswer: 2,
            explanation: "Vaccination records are essential for health continuity, school enrollment, and resettlement documentation."
          },
          {
            id: "q4",
            question: "What should you do if your child has persistent diarrhea?",
            options: [
              "Wait for it to resolve naturally",
              "Give only water and wait",
              "Seek medical help immediately and maintain hydration",
              "Restrict all fluids"
            ],
            correctAnswer: 2,
            explanation: "Persistent diarrhea in children can quickly lead to dangerous dehydration and requires medical attention."
          }
        ]
      }
    },
    {
      id: "edu-006", 
      title: "Managing Chronic Conditions During Displacement",
      description: "Learn to manage conditions like hypertension and diabetes with limited healthcare access.",
      content: "Monitor conditions when possible, maintain medications if available, recognize warning signs, adapt diet within available options, stay as active as possible, and know when to seek emergency care.",
      category: "Chronic Conditions",
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es"],
      difficulty: "intermediate",
      duration: "15 min", 
      type: "interactive",
      progress: 0,
      quiz: {
        id: "quiz-006",
        title: "Chronic Disease Management Quiz",
        passingScore: 75,
        questions: [
          {
            id: "q1",
            question: "What should someone with diabetes do if they run out of medication?",
            options: [
              "Stop taking medication completely",
              "Take half doses to make it last longer", 
              "Seek medical help immediately and follow dietary guidelines strictly",
              "Wait until symptoms get worse"
            ],
            correctAnswer: 2,
            explanation: "Running out of diabetes medication is a medical emergency. Seek help immediately while following strict dietary management."
          },
          {
            id: "q2",
            question: "How can someone with high blood pressure manage their condition with limited food options?",
            options: [
              "Eat as much salt as available",
              "Reduce salt intake and choose fresh foods when possible",
              "Only eat processed foods",
              "Skip meals to reduce blood pressure"
            ],
            correctAnswer: 1,
            explanation: "Even with limited options, reducing salt and choosing less processed foods can help manage blood pressure."
          },
          {
            id: "q3",
            question: "What are warning signs that a chronic condition is getting worse?",
            options: [
              "Feeling exactly the same as usual",
              "Sudden changes in symptoms, new pain, or difficulty breathing",
              "Slight improvement in energy",
              "Normal daily activities"
            ],
            correctAnswer: 1,
            explanation: "Sudden symptom changes, new severe pain, or breathing difficulties indicate worsening conditions requiring immediate care."
          },
          {
            id: "q4",
            question: "Why is it important to stay active with chronic conditions, even in displacement?",
            options: [
              "Exercise is dangerous with chronic conditions",
              "Physical activity helps manage symptoms and prevents complications",
              "Activity should be avoided completely",
              "Exercise only matters with access to gyms"
            ],
            correctAnswer: 1,
            explanation: "Appropriate physical activity helps manage chronic conditions, improves mental health, and prevents complications."
          }
        ]
      }
    },
    {
      id: "edu-007",
      title: "Water Safety and Hygiene in Camps",
      description: "Preventing waterborne diseases and maintaining hygiene in crowded conditions.",
      content: "Boil water for 1 minute before drinking when possible, wash hands frequently with soap for 20 seconds, use latrines properly, keep living areas clean, and report water quality issues to camp authorities.",
      category: "Prevention",
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es", "sw", "so"],
      difficulty: "beginner", 
      duration: "8 min",
      type: "interactive",
      progress: 0,
      quiz: {
        id: "quiz-007",
        title: "Water Safety and Hygiene Quiz",
        passingScore: 70,
        questions: [
          {
            id: "q1",
            question: "How long should you boil water to make it safe for drinking?",
            options: [
              "30 seconds",
              "At least 1 minute at a rolling boil",
              "Just until it gets warm",
              "5 minutes"
            ],
            correctAnswer: 1,
            explanation: "Boiling water for at least 1 minute at a rolling boil kills most disease-causing organisms."
          },
          {
            id: "q2",
            question: "What is the minimum time you should wash your hands with soap?",
            options: [
              "5 seconds",
              "10 seconds",
              "20 seconds",
              "1 minute"
            ],
            correctAnswer: 2,
            explanation: "Washing hands with soap for at least 20 seconds is needed to effectively remove germs and prevent disease."
          },
          {
            id: "q3",
            question: "What should you do if the water supply in your area appears contaminated?",
            options: [
              "Use it anyway since it's the only option",
              "Only use it for washing, not drinking",
              "Report it to camp authorities and seek alternative safe water sources",
              "Add salt to make it safe"
            ],
            correctAnswer: 2,
            explanation: "Contaminated water should be reported immediately to authorities while seeking alternative safe water sources."
          },
          {
            id: "q4",
            question: "Why is proper latrine use especially important in crowded camps?",
            options: [
              "It's not more important than anywhere else",
              "To prevent the spread of diseases like cholera and dysentery",
              "Only for personal comfort",
              "Just to follow camp rules"
            ],
            correctAnswer: 1,
            explanation: "Proper sanitation in crowded conditions is critical to prevent disease outbreaks that can spread rapidly."
          }
        ]
      }
    },
    {
      id: "edu-008",
      title: "Recognizing and Managing Infectious Diseases",
      description: "Common infectious diseases in displacement settings and prevention strategies.",
      content: "Watch for fever, unusual rash, persistent cough, diarrhea. Practice good hygiene, get vaccinated when available, isolate when sick, and seek medical help early for serious symptoms.",
      category: "Infectious Diseases", 
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es", "sw", "so"],
      difficulty: "intermediate",
      duration: "12 min",
      type: "video",
      progress: 0,
      quiz: {
        id: "quiz-008",
        title: "Infectious Disease Prevention Quiz",
        passingScore: 75,
        questions: [
          {
            id: "q1",
            question: "What should you do if you develop a fever and rash?",
            options: [
              "Wait to see if it goes away",
              "Continue normal activities",
              "Isolate yourself and seek medical attention immediately",
              "Just take medicine and continue working"
            ],
            correctAnswer: 2,
            explanation: "Fever with rash can indicate serious infectious diseases like measles that require isolation and immediate medical care."
          },
          {
            id: "q2",
            question: "How can you prevent spreading infection to others if you are sick?",
            options: [
              "Continue normal social contact",
              "Cover coughs/sneezes, wash hands frequently, and maintain distance from others",
              "Only avoid touching people",
              "Isolation is not necessary"
            ],
            correctAnswer: 1,
            explanation: "Covering coughs, frequent handwashing, and maintaining distance are key to preventing disease transmission."
          },
          {
            id: "q3",
            question: "What are common signs of serious infectious disease requiring immediate medical attention?",
            options: [
              "Mild headache and tiredness",
              "High fever, difficulty breathing, persistent vomiting, or severe dehydration",
              "Slight cough",
              "Feeling a bit unwell"
            ],
            correctAnswer: 1,
            explanation: "High fever, breathing difficulty, persistent vomiting, and severe dehydration indicate serious infection requiring urgent care."
          },
          {
            id: "q4",
            question: "Why are vaccinations especially important in displacement settings?",
            options: [
              "They are not more important than usual",
              "Crowded conditions and stress increase disease transmission risk",
              "Only children need vaccines in camps",
              "Vaccines don't work in displacement settings"
            ],
            correctAnswer: 1,
            explanation: "Crowded living conditions, stress, and limited healthcare make vaccination critical for preventing disease outbreaks."
          }
        ]
      }
    },
    {
      id: "edu-009",
      title: "Heart Health and Cardiovascular Prevention",
      description: "Maintaining heart health during stressful times with limited resources.",
      content: "Avoid tobacco completely, stay as physically active as possible within your limitations, choose heart-healthy foods when available, manage stress through community support and breathing techniques.",
      category: "Prevention",
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es"],
      difficulty: "beginner",
      duration: "10 min",
      type: "article",
      progress: 0,
      quiz: {
        id: "quiz-009",
        title: "Heart Health Knowledge Check",
        passingScore: 70,
        questions: [
          {
            id: "q1",
            question: "What is the most important thing to avoid for heart health?",
            options: [
              "All physical activity",
              "Drinking water",
              "Tobacco use and smoking",
              "Talking to people"
            ],
            correctAnswer: 2,
            explanation: "Tobacco use is one of the most significant risk factors for heart disease and should be completely avoided."
          },
          {
            id: "q2",
            question: "How can you stay heart-healthy with limited food options?",
            options: [
              "Eat as much salt as possible",
              "Choose fresh foods over processed when available and limit salt",
              "Avoid all fats completely",
              "Only eat once per day"
            ],
            correctAnswer: 1,
            explanation: "Even with limited options, choosing less processed foods and limiting salt helps protect heart health."
          },
          {
            id: "q3",
            question: "What type of activity is good for heart health during displacement?",
            options: [
              "Only intense gym workouts",
              "Walking, basic stretching, and any movement within your ability",
              "Complete rest with no movement",
              "Only competitive sports"
            ],
            correctAnswer: 1,
            explanation: "Simple activities like walking and basic movement, adapted to your situation, benefit heart health significantly."
          },
          {
            id: "q4",
            question: "How does stress affect heart health during displacement?",
            options: [
              "Stress has no effect on the heart",
              "Chronic stress can increase heart disease risk",
              "Stress only affects emotions",
              "Stress is good for the heart"
            ],
            correctAnswer: 1,
            explanation: "Chronic stress from displacement can increase heart disease risk, making stress management techniques important."
          }
        ]
      }
    },
    {
      id: "edu-010",
      title: "Emergency Response and Basic Life Support",
      description: "Essential emergency response skills that can save lives in crisis situations.",
      content: "Learn to recognize medical emergencies, perform basic CPR steps, control severe bleeding, help someone who is choking, and know when to call for emergency help immediately.",
      category: "Emergency", 
      languages: ["en", "hi", "bn", "te", "ta", "mr", "gu", "kn", "ml", "pa", "ur", "or", "as", "ar", "fr", "es"],
      difficulty: "advanced",
      duration: "18 min",
      type: "interactive",
      progress: 0,
      quiz: {
        id: "quiz-010",
        title: "Emergency Response Skills Test",
        passingScore: 80,
        questions: [
          {
            id: "q1",
            question: "What should you do first when someone is unconscious and not breathing?",
            options: [
              "Give them water",
              "Call for emergency help and start CPR if trained",
              "Wait to see if they wake up",
              "Move them immediately"
            ],
            correctAnswer: 1,
            explanation: "Call for help immediately and begin CPR if you are trained. Time is critical in cardiac emergencies."
          },
          {
            id: "q2",
            question: "How do you help someone who is choking and cannot speak or cough?",
            options: [
              "Give them water to drink",
              "Perform back blows and abdominal thrusts (Heimlich maneuver)",
              "Tell them to lie down",
              "Wait for it to resolve"
            ],
            correctAnswer: 1,
            explanation: "For severe choking, perform 5 back blows followed by 5 abdominal thrusts, repeating until object dislodges or help arrives."
          },
          {
            id: "q3",
            question: "What is the correct way to control severe bleeding?",
            options: [
              "Apply ice directly to the wound",
              "Apply direct pressure with clean cloth and elevate if possible",
              "Pour water on the wound",
              "Apply a tourniquet immediately"
            ],
            correctAnswer: 1,
            explanation: "Direct pressure with clean material and elevation (if appropriate) are the first steps to control severe bleeding."
          },
          {
            id: "q4",
            question: "What are signs that someone needs emergency medical attention immediately?",
            options: [
              "Mild headache and tiredness",
              "Chest pain, difficulty breathing, severe bleeding, or unconsciousness",
              "Slight nausea",
              "Minor cuts and bruises"
            ],
            correctAnswer: 1,
            explanation: "Chest pain, breathing difficulty, severe bleeding, and unconsciousness are life-threatening emergencies requiring immediate help."
          },
          {
            id: "q5",
            question: "What should you NOT do when helping someone in a medical emergency?",
            options: [
              "Call for professional help",
              "Move someone with a suspected spinal injury unless they're in immediate danger",
              "Try to keep the person calm",
              "Apply pressure to control bleeding"
            ],
            correctAnswer: 1,
            explanation: "Never move someone with suspected spinal injury unless they're in immediate danger, as this could cause permanent paralysis."
          }
        ]
      }
    }
  ]

  // Sample health services near refugee locations  
  const nearbyHealthServices: HealthService[] = [
    {
      id: "hs-001",
      name: "UNHCR Health Clinic",
      type: "Primary Care Clinic",
      address: "Block A, Sector 1, Refugee Settlement",
      phone: "+91-XXXX-XXXXXX",
      distance: "0.5 km",
      availability: "24/7 Emergency, 8AM-6PM Regular",
      languages: ["en", "hi", "bn", "ur", "ar"],
      services: ["General Medicine", "Emergency Care", "Vaccinations", "Maternal Care", "Mental Health"]
    },
    {
      id: "hs-002", 
      name: "MSF Mobile Health Unit",
      type: "Mobile Clinic",
      address: "Daily locations vary - check schedule",
      phone: "+91-XXXX-YYYYYY", 
      distance: "Variable",
      availability: "Mon-Fri 9AM-5PM",
      languages: ["en", "fr", "ar", "hi", "sw"],
      services: ["Basic Treatment", "Health Education", "Referrals", "Chronic Disease Management"]
    },
    {
      id: "hs-003",
      name: "Government District Hospital", 
      type: "Government Hospital",
      address: "Main Road, District Center",
      phone: "+91-XXXX-ZZZZZZ",
      distance: "5.2 km", 
      availability: "24/7",
      languages: ["en", "hi", "te", "ta", "kn"],
      services: ["Emergency Care", "Surgery", "Specialist Care", "Laboratory", "Pharmacy"]
    },
    {
      id: "hs-004",
      name: "Red Cross Health Post",
      type: "Community Health Center", 
      address: "Community Center, Block C",
      phone: "+91-XXXX-AAAAAA",
      distance: "1.2 km",
      availability: "Mon-Sat 8AM-4PM",
      languages: ["en", "hi", "ar", "fr"],
      services: ["First Aid", "Health Education", "Nutritional Support", "Psychosocial Support"]
    }
  ]

  const filteredContent = educationalContent.filter((content) => {
    const matchesSearch = 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || content.category === categoryFilter
    const matchesLanguage = languageFilter === "all" || content.languages.includes(languageFilter)
    const matchesDifficulty = difficultyFilter === "all" || content.difficulty === difficultyFilter
    return matchesSearch && matchesCategory && matchesLanguage && matchesDifficulty
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Prevention": return "🛡️"
      case "Emergency": return "🚨"
      case "Nutrition": return "🥗"
      case "Mental Health": return "🧠"
      case "Women's Health": return "👩‍⚕️"
      case "Child Care": return "👶"
      case "Chronic Conditions": return "📋"
      case "Maternal Health": return "🤱"
      case "Infectious Diseases": return "🦠"
      case "First Aid": return "❤️‍🩹"
      default: return "📖"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="h-4 w-4" />
      case "interactive": return <CheckCircle className="h-4 w-4" />
      case "article": return <BookOpen className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500"
      case "intermediate": return "bg-yellow-500"
      case "advanced": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency": return "bg-red-500 text-white"
      case "high": return "bg-orange-500 text-white"
      case "medium": return "bg-yellow-500 text-white"
      case "low": return "bg-green-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  const markAsCompleted = (contentId: string) => {
    if (!completedLessons.includes(contentId)) {
      setCompletedLessons([...completedLessons, contentId])
    }
  }

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setQuizAnswers({})
    setQuizCompleted(false)
    setQuizScore(0)
    setCurrentQuestionIndex(0)
  }

  const submitQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const completeQuiz = () => {
    if (!currentQuiz) return
    
    let correct = 0
    currentQuiz.questions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++
      }
    })
    
    const score = (correct / currentQuiz.questions.length) * 100
    setQuizScore(score)
    setQuizCompleted(true)
    
    if (score >= currentQuiz.passingScore) {
      markAsCompleted(selectedContent?.id)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < (currentQuiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      completeQuiz()
    }
  }

  const startVoiceInput = () => {
    if (!speechSupported) return
    
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    
    recognition.lang = languageFilter
    recognition.continuous = false
    recognition.interimResults = false
    
    recognition.onstart = () => {
      setIsListening(true)
    }
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setChatInput(transcript)
      setIsListening(false)
    }
    
    recognition.onerror = () => {
      setIsListening(false)
    }
    
    recognition.onend = () => {
      setIsListening(false)
    }
    
    recognition.start()
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = languageFilter
      speechSynthesis.speak(utterance)
    }
  }

  const overallProgress = (completedLessons.length / educationalContent.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-border/40 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold font-poppins">AI Health Assistant for Refugees</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Your Progress</p>
                <div className="flex items-center space-x-2">
                  <Progress value={overallProgress} className="w-20" />
                  <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
                </div>
              </div>
              <Badge variant="secondary" className="flex items-center">
                <Globe className="h-3 w-3 mr-1" />
                {languageNames[languageFilter as keyof typeof languageNames]?.split(' ')[0] || 'English'}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Language Selection */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-poppins flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Language
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={languageFilter} onValueChange={setLanguageFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {languageNames[lang as keyof typeof languageNames]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Search and Filters */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-poppins">Find Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search health topics..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Difficulty */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficultyNames[difficulty as keyof typeof difficultyNames]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-poppins text-red-700 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Emergency
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Help
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Nearest Hospital
                </Button>
              </CardContent>
            </Card>

            {/* Learning Progress */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-poppins">Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{completedLessons.length}</div>
                  <p className="text-sm text-muted-foreground">Lessons Completed</p>
                </div>

                <div className="space-y-2">
                  {categories.slice(0, 5).map((category) => {
                    const categoryLessons = educationalContent.filter((c) => c.category === category)
                    const completed = categoryLessons.filter((c) => completedLessons.includes(c.id)).length
                    const progress = categoryLessons.length > 0 ? (completed / categoryLessons.length) * 100 : 0

                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>{category}</span>
                          <span>
                            {completed}/{categoryLessons.length}
                          </span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="lessons" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="lessons">Health Education</TabsTrigger>
                <TabsTrigger value="quizzes">Interactive Quizzes</TabsTrigger>
                <TabsTrigger value="find-care">Find Care</TabsTrigger>
                <TabsTrigger value="emergency">Emergency Guide</TabsTrigger>
              </TabsList>

              {/* Health Education Lessons */}
              <TabsContent value="lessons">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold font-poppins">
                        Health Education ({filteredContent.length} topics)
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Interactive health lessons available in {languageNames[languageFilter as keyof typeof languageNames]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold text-primary">{completedLessons.length}/{educationalContent.length}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredContent.map((content, index) => (
                      <motion.div
                        key={content.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <span className="text-2xl">{getCategoryIcon(content.category)}</span>
                                  <Badge variant="secondary">{content.category}</Badge>
                                  {completedLessons.includes(content.id) && (
                                    <Badge variant="default" className="bg-green-500">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                                <CardTitle className="text-lg font-poppins line-clamp-2">{content.title}</CardTitle>
                              </div>
                            </div>
                            <CardDescription className="line-clamp-2">{content.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-2">
                                  {getTypeIcon(content.type)}
                                  <span className="capitalize">{content.type}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Clock className="h-3 w-3" />
                                  <span>{content.duration}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${getDifficultyColor(content.difficulty)}`}></div>
                                  <span className="text-xs capitalize">{content.difficulty}</span>
                                </div>
                                {content.quiz && (
                                  <Badge variant="outline" className="text-xs">
                                    <HelpCircle className="h-3 w-3 mr-1" />
                                    Quiz Available
                                  </Badge>
                                )}
                              </div>

                              <div className="flex flex-wrap gap-1 mb-2">
                                {content.languages.slice(0, 3).map((lang) => (
                                  <Badge key={lang} variant="outline" className="text-xs">
                                    {languageNames[lang as keyof typeof languageNames]?.split(' ')[0] || lang}
                                  </Badge>
                                ))}
                                {content.languages.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{content.languages.length - 3} more
                                  </Badge>
                                )}
                              </div>

                              <div className="flex space-x-2">
                                <Button
                                  className="flex-1"
                                  size="sm"
                                  onClick={() => setSelectedContent(content)}
                                >
                                  {completedLessons.includes(content.id) ? "Review" : "Start Learning"}
                                </Button>
                                {content.quiz && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => startQuiz(content.quiz!)}
                                  >
                                    Quiz
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Interactive Quizzes Section */}
              <TabsContent value="quizzes">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold font-poppins">Interactive Health Quizzes</h2>
                      <p className="text-sm text-muted-foreground">
                        Test your knowledge with quizzes in {languageNames[languageFilter as keyof typeof languageNames]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-2xl font-bold text-green-500">85%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {educationalContent
                      .filter(content => content.quiz && content.languages.includes(languageFilter))
                      .map((content, index) => (
                        <motion.div
                          key={content.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Card className="h-full hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-2xl">{getCategoryIcon(content.category)}</span>
                                <Badge variant="secondary">{content.category}</Badge>
                              </div>
                              <CardTitle className="text-lg font-poppins line-clamp-2">
                                {content.quiz?.title}
                              </CardTitle>
                              <CardDescription className="line-clamp-2">
                                Test your knowledge on: {content.title.toLowerCase()}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    <HelpCircle className="h-4 w-4" />
                                    <span>{content.quiz?.questions.length} Questions</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-3 w-3" />
                                    <span>~5 min</span>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>Passing Score:</span>
                                    <span className="font-medium">{content.quiz?.passingScore}%</span>
                                  </div>
                                  <div className="flex items-center justify-between text-sm">
                                    <span>Difficulty:</span>
                                    <Badge variant="outline" className="text-xs capitalize">
                                      {content.difficulty}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-1 mb-3">
                                  {content.languages.slice(0, 4).map((lang) => (
                                    <Badge key={lang} variant="outline" className="text-xs">
                                      {languageNames[lang as keyof typeof languageNames]?.split(' ')[0] || lang}
                                    </Badge>
                                  ))}
                                </div>

                                <Button
                                  className="w-full"
                                  onClick={() => content.quiz && startQuiz(content.quiz)}
                                >
                                  <Play className="h-4 w-4 mr-2" />
                                  Start Quiz
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>

                  {/* Quiz Categories Overview */}
                  <Card className="mt-8">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Quiz Categories Available
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category) => {
                          const categoryQuizzes = educationalContent.filter(
                            content => content.category === category && content.quiz && content.languages.includes(languageFilter)
                          )
                          return (
                            <div key={category} className="text-center p-4 border rounded-lg">
                              <div className="text-3xl mb-2">{getCategoryIcon(category)}</div>
                              <h3 className="font-medium text-sm mb-1">{category}</h3>
                              <p className="text-xs text-muted-foreground">
                                {categoryQuizzes.length} {categoryQuizzes.length === 1 ? 'quiz' : 'quizzes'}
                              </p>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Language Support Notice */}
                  <Alert>
                    <Globe className="h-4 w-4" />
                    <AlertDescription>
                      All quizzes are available in multiple languages. Switch language in the sidebar to access content in your preferred language. Currently viewing content in: <strong>{languageNames[languageFilter as keyof typeof languageNames]}</strong>
                    </AlertDescription>
                  </Alert>
                </div>
              </TabsContent>

              {/* Find Care */}
              <TabsContent value="find-care">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Healthcare Services Near You
                      </CardTitle>
                      <CardDescription>
                        Find clinics, hospitals, and health services available to refugees and displaced persons
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {nearbyHealthServices.map((service) => (
                        <Card key={service.id} className="border-l-4 border-l-primary">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg">{service.name}</h3>
                                <Badge variant="outline" className="mt-1">{service.type}</Badge>
                              </div>
                              <div className="text-right">
                                <Badge className="mb-1">{service.distance}</Badge>
                                <p className="text-xs text-muted-foreground">{service.availability}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-3">
                              <p className="text-sm flex items-start">
                                <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
                                {service.address}
                              </p>
                              <p className="text-sm flex items-center">
                                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                {service.phone}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Languages Spoken:</p>
                                <div className="flex flex-wrap gap-1">
                                  {service.languages.map((lang) => (
                                    <Badge key={lang} variant="secondary" className="text-xs">
                                      {languageNames[lang as keyof typeof languageNames]?.split(' ')[0] || lang}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1">Services Available:</p>
                                <div className="flex flex-wrap gap-1">
                                  {service.services.map((svc, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {svc}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="flex space-x-2 mt-3">
                              <Button size="sm" className="flex-1">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                Directions
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Emergency Guide */}
              <TabsContent value="emergency">
                <div className="space-y-6">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="font-medium">
                      For life-threatening emergencies, call local emergency services immediately or go to the nearest hospital
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Medical Emergency Signs",
                        icon: "🚨",
                        items: [
                          "Chest pain or pressure",
                          "Difficulty breathing",
                          "Severe bleeding",
                          "Loss of consciousness",
                          "Severe head injury",
                          "Signs of stroke (weakness, confusion)",
                          "Severe allergic reactions"
                        ]
                      },
                      {
                        title: "When to Seek Immediate Care",
                        icon: "⏰", 
                        items: [
                          "High fever (over 101°F/38.3°C)",
                          "Severe pain (8/10 or higher)",
                          "Persistent vomiting",
                          "Signs of severe dehydration",
                          "Worsening chronic conditions",
                          "Mental health crisis",
                          "Medication reactions"
                        ]
                      },
                      {
                        title: "Basic First Aid Steps",
                        icon: "🩹",
                        items: [
                          "Check for responsiveness",
                          "Call for help immediately",
                          "Control bleeding with pressure",
                          "Keep airway clear",
                          "Monitor breathing and pulse",
                          "Keep person warm and calm",
                          "Do not move if spinal injury suspected"
                        ]
                      },
                      {
                        title: "Emergency Contacts",
                        icon: "📞",
                        items: [
                          "Local Emergency: 108 / 102",
                          "Police: 100",
                          "Fire: 101", 
                          "UNHCR Helpline: +91-XXXX-XXXXXX",
                          "Camp Medical Officer: Extension XXX",
                          "Mental Health Crisis: Available 24/7",
                          "Women's Safety: Confidential support"
                        ]
                      }
                    ].map((section, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <span className="text-2xl mr-2">{section.icon}</span>
                            {section.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex} className="flex items-start space-x-2">
                                <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                                <span className="text-sm">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Content Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getCategoryIcon(selectedContent.category)}</span>
                    <div>
                      <h2 className="text-2xl font-bold font-poppins">{selectedContent.title}</h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary">{selectedContent.category}</Badge>
                        <Badge variant="outline" className="capitalize">
                          {selectedContent.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedContent(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="prose prose-sm max-w-none mb-6">
                  <p className="text-muted-foreground mb-4">{selectedContent.description}</p>
                  <div className="bg-muted/30 rounded-lg p-6 mb-6">
                    <h3 className="font-semibold mb-3">Learning Content</h3>
                    <p className="mb-4">{selectedContent.content}</p>
                    
                    <div className="space-y-4">
                      <div className="bg-card rounded-lg p-4 border">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Star className="h-4 w-4 mr-2 text-yellow-500" />
                          Key Learning Points:
                        </h4>
                        <ul className="space-y-1 text-sm">
                          <li>• Understanding the basics and importance</li>
                          <li>• Practical steps you can take today</li>
                          <li>• Warning signs to watch for</li>
                          <li>• When to seek professional help</li>
                        </ul>
                      </div>
                      
                      {selectedContent.quiz && (
                        <div className="bg-card rounded-lg p-4 border">
                          <h4 className="font-medium mb-2 flex items-center">
                            <HelpCircle className="h-4 w-4 mr-2 text-blue-500" />
                            Interactive Quiz Available
                          </h4>
                          <p className="text-sm mb-3">Test your understanding with {selectedContent.quiz.questions.length} questions. Score {selectedContent.quiz.passingScore}% or higher to complete this lesson.</p>
                          <Button size="sm" onClick={() => startQuiz(selectedContent.quiz)}>
                            Start Quiz ({selectedContent.quiz.questions.length} questions)
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex flex-wrap gap-1">
                    {selectedContent.languages.map((lang: string) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {languageNames[lang as keyof typeof languageNames]?.split(' ')[0] || lang}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => speakText(selectedContent.content)}>
                      <Volume2 className="h-4 w-4 mr-2" />
                      Listen
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        markAsCompleted(selectedContent.id)
                        setSelectedContent(null)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quiz Modal */}
      <AnimatePresence>
        {currentQuiz && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold">{currentQuiz.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setCurrentQuiz(null)
                      setQuizCompleted(false)
                      setCurrentQuestionIndex(0)
                      setQuizAnswers({})
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <Progress 
                  value={((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100} 
                  className="mb-6"
                />

                {!quizCompleted ? (
                  <div className="space-y-6">
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h3 className="font-medium mb-4 text-lg">
                        {currentQuiz.questions[currentQuestionIndex].question}
                      </h3>
                      <div className="space-y-3">
                        {currentQuiz.questions[currentQuestionIndex].options.map((option, index) => (
                          <button
                            key={index}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              quizAnswers[currentQuiz.questions[currentQuestionIndex].id] === index
                                ? 'border-primary bg-primary/10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => submitQuizAnswer(currentQuiz.questions[currentQuestionIndex].id, index)}
                          >
                            <span className="font-medium mr-2">
                              {String.fromCharCode(65 + index)}.
                            </span>
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                        disabled={currentQuestionIndex === 0}
                      >
                        Previous
                      </Button>
                      <Button
                        onClick={nextQuestion}
                        disabled={quizAnswers[currentQuiz.questions[currentQuestionIndex].id] === undefined}
                      >
                        {currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className={`text-6xl mb-4 ${quizScore >= currentQuiz.passingScore ? 'text-green-500' : 'text-orange-500'}`}>
                        {quizScore >= currentQuiz.passingScore ? '🎉' : '📚'}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
                      <p className="text-lg">
                        Your Score: <span className="font-bold">{quizScore.toFixed(0)}%</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {quizScore >= currentQuiz.passingScore 
                          ? `Congratulations! You passed with ${quizScore.toFixed(0)}%.`
                          : `You need ${currentQuiz.passingScore}% to pass. Review the content and try again.`
                        }
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Review Answers:</h4>
                      {currentQuiz.questions.map((question, qIndex) => {
                        const userAnswer = quizAnswers[question.id]
                        const isCorrect = userAnswer === question.correctAnswer
                        return (
                          <div key={question.id} className="border rounded-lg p-4">
                            <div className="flex items-start space-x-2 mb-2">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                isCorrect ? 'bg-green-500' : 'bg-red-500'
                              }`}>
                                {isCorrect ? '✓' : '✗'}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{question.question}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Your answer: {question.options[userAnswer]} 
                                  {!isCorrect && (
                                    <span className="ml-2 text-green-600">
                                      (Correct: {question.options[question.correctAnswer]})
                                    </span>
                                  )}
                                </p>
                                {!isCorrect && (
                                  <p className="text-xs text-blue-600 mt-1">
                                    💡 {question.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentQuiz(null)
                          setQuizCompleted(false)
                          setCurrentQuestionIndex(0)
                          setQuizAnswers({})
                        }}
                        className="flex-1"
                      >
                        Close
                      </Button>
                      {quizScore < currentQuiz.passingScore && (
                        <Button
                          onClick={() => {
                            setQuizAnswers({})
                            setQuizCompleted(false)
                            setCurrentQuestionIndex(0)
                          }}
                          className="flex-1"
                        >
                          Retake Quiz
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}