"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, BookOpen, Search, Play, Download, Share, Globe, Eye, CheckCircle, Clock, Users } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import dummyDataRaw from "@/lib/dummy-data.json"

interface HealthEducationItem {
    id: string;
    title: string;
    description: string;
    content: string;
    category: string;
    languages: string[];
    difficulty: string;
    duration: string;
    type: string;
    progress: number;
}

interface DummyData {
    healthEducation: HealthEducationItem[];
    // Add other properties if needed
}

const dummyData = dummyDataRaw as DummyData;

export default function HealthEducationPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [languageFilter, setLanguageFilter] = useState("all")
    const [difficultyFilter, setDifficultyFilter] = useState("all")
    const [selectedContent, setSelectedContent] = useState<any>(null)
    const [completedLessons, setCompletedLessons] = useState<string[]>([])

    const categories = [
        "Prevention",
        "Emergency",
        "Nutrition",
        "Mental Health",
        "Women's Health",
        "Child Care",
        "Chronic Conditions",
    ]
    const languages = ["en", "ar", "fr", "es"]
    const difficulties = ["beginner", "intermediate", "advanced"]

    const languageNames = {
        en: "English",
        ar: "العربية",
        fr: "Français",
        es: "Español",
    }

    const difficultyNames = {
        beginner: "Beginner",
        intermediate: "Intermediate",
        advanced: "Advanced",
    }

    // Enhanced educational content
    const educationalContent = [
        ...dummyData.healthEducation,
        {
            id: "edu-007",
            title: "Understanding Diabetes Management",
            description: "Complete guide to managing diabetes through diet, exercise, and medication",
            content: "Diabetes management requires a comprehensive approach...",
            category: "Chronic Conditions",
            languages: ["en", "ar", "es"],
            difficulty: "intermediate",
            duration: "15 min",
            type: "interactive",
            progress: 0,
        },
        {
            id: "edu-008",
            title: "Heart Health Basics",
            description: "Learn about cardiovascular health and prevention strategies",
            content: "Your heart is your body's most important muscle...",
            category: "Prevention",
            languages: ["en", "fr", "es"],
            difficulty: "beginner",
            duration: "10 min",
            type: "article",
            progress: 0,
        },
        {
            id: "edu-009",
            title: "Managing Anxiety and Stress",
            description: "Practical techniques for mental wellness and stress reduction",
            content: "Mental health is just as important as physical health...",
            category: "Mental Health",
            languages: ["en", "ar", "fr"],
            difficulty: "beginner",
            duration: "12 min",
            type: "video",
            progress: 0,
        },
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
            case "Prevention":
                return "🛡️"
            case "Emergency":
                return "🚨"
            case "Nutrition":
                return "🥗"
            case "Mental Health":
                return "🧠"
            case "Women's Health":
                return "👩‍⚕️"
            case "Child Care":
                return "👶"
            case "Chronic Conditions":
                return "📋"
            default:
                return "📖"
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "video":
                return <Play className="h-4 w-4" />
            case "interactive":
                return <CheckCircle className="h-4 w-4" />
            case "article":
                return <BookOpen className="h-4 w-4" />
            default:
                return <BookOpen className="h-4 w-4" />
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return "bg-green-500"
            case "intermediate":
                return "bg-yellow-500"
            case "advanced":
                return "bg-red-500"
            default:
                return "bg-gray-500"
        }
    }

    const markAsCompleted = (contentId: string) => {
        if (!completedLessons.includes(contentId)) {
            setCompletedLessons([...completedLessons, contentId])
        }
    }

    const overallProgress = (completedLessons.length / educationalContent.length) * 100

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border/40 bg-card">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/dashboard/refugee">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Link>
                            </Button>
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-6 w-6 text-primary" />
                                <h1 className="text-2xl font-bold font-poppins">Health Education Center</h1>
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
                                Multilingual
                            </Badge>
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Search and Filters */}
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-poppins">Find Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search topics..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

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

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Language</label>
                                    <Select value={languageFilter} onValueChange={setLanguageFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All languages" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Languages</SelectItem>
                                            {languages.map((lang) => (
                                                <SelectItem key={lang} value={lang}>
                                                    {languageNames[lang as keyof typeof languageNames]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

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
                                    {categories.slice(0, 4).map((category) => {
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
                            <TabsList>
                                <TabsTrigger value="lessons">Interactive Lessons</TabsTrigger>
                                <TabsTrigger value="articles">Articles</TabsTrigger>
                                <TabsTrigger value="videos">Videos</TabsTrigger>
                                <TabsTrigger value="assessments">Self-Assessments</TabsTrigger>
                            </TabsList>

                            <TabsContent value="lessons">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold font-poppins">
                                            Interactive Health Lessons ({filteredContent.length})
                                        </h2>
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
                                                                    <div
                                                                        className={`w-2 h-2 rounded-full ${getDifficultyColor(content.difficulty)}`}
                                                                    ></div>
                                                                    <span className="text-xs capitalize">{content.difficulty}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {content.languages.slice(0, 2).map((lang) => (
                                                                        <Badge key={lang} variant="outline" className="text-xs">
                                                                            {languageNames[lang as keyof typeof languageNames]}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <Button
                                                                className="w-full"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedContent(content)
                                                                    markAsCompleted(content.id)
                                                                }}
                                                            >
                                                                {completedLessons.includes(content.id) ? "Review" : "Start Learning"}
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="articles">
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold font-poppins">Health Articles</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Article content similar to lessons but focused on reading */}
                                        {filteredContent
                                            .filter((c) => c.type === "article" || !c.type)
                                            .map((article, index) => (
                                                <Card key={article.id} className="hover:shadow-lg transition-shadow">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <span className="text-2xl">{getCategoryIcon(article.category)}</span>
                                                            <Badge variant="secondary">{article.category}</Badge>
                                                        </div>
                                                        <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{article.description}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                                <Eye className="h-3 w-3" />
                                                                <span>2.1k reads</span>
                                                            </div>
                                                            <Button size="sm" variant="outline">
                                                                Read More
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="videos">
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold font-poppins">Educational Videos</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {/* Video content */}
                                        {[
                                            { title: "Proper Hand Washing", duration: "3:45", category: "Prevention" },
                                            { title: "Recognizing Heart Attack Signs", duration: "5:20", category: "Emergency" },
                                            { title: "Healthy Meal Planning", duration: "8:15", category: "Nutrition" },
                                            { title: "Stress Management Techniques", duration: "6:30", category: "Mental Health" },
                                        ].map((video, index) => (
                                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                                <CardContent className="p-0">
                                                    <div className="aspect-video bg-muted/30 rounded-t-lg flex items-center justify-center relative">
                                                        <span className="text-4xl">{getCategoryIcon(video.category)}</span>
                                                        <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                                                            <Button size="sm" className="rounded-full w-12 h-12">
                                                                <Play className="h-5 w-5" />
                                                            </Button>
                                                        </div>
                                                        <Badge className="absolute bottom-2 right-2 text-xs">{video.duration}</Badge>
                                                    </div>
                                                    <div className="p-4">
                                                        <h3 className="font-semibold mb-1">{video.title}</h3>
                                                        <Badge variant="outline" className="text-xs">
                                                            {video.category}
                                                        </Badge>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="assessments">
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold font-poppins">Health Self-Assessments</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            {
                                                title: "Mental Health Check-in",
                                                description: "Assess your current mental wellness and get personalized recommendations",
                                                questions: 15,
                                                duration: "5 min",
                                                category: "Mental Health",
                                            },
                                            {
                                                title: "Nutrition Assessment",
                                                description: "Evaluate your eating habits and discover areas for improvement",
                                                questions: 20,
                                                duration: "7 min",
                                                category: "Nutrition",
                                            },
                                            {
                                                title: "Physical Activity Level",
                                                description: "Check how active you are and get exercise recommendations",
                                                questions: 12,
                                                duration: "4 min",
                                                category: "Prevention",
                                            },
                                        ].map((assessment, index) => (
                                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex items-center space-x-2 mb-3">
                                                        <span className="text-2xl">{getCategoryIcon(assessment.category)}</span>
                                                        <Badge variant="secondary">{assessment.category}</Badge>
                                                    </div>
                                                    <h3 className="font-semibold mb-2">{assessment.title}</h3>
                                                    <p className="text-sm text-muted-foreground mb-4">{assessment.description}</p>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                                            <div className="flex items-center space-x-1">
                                                                <Users className="h-4 w-4" />
                                                                <span>{assessment.questions} questions</span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{assessment.duration}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button className="w-full">Start Assessment</Button>
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
            {selectedContent && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-card rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto"
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
                                    ×
                                </Button>
                            </div>

                            <div className="prose prose-sm max-w-none mb-6">
                                <p className="text-muted-foreground mb-4">{selectedContent.description}</p>
                                <div className="bg-muted/30 rounded-lg p-6 mb-6">
                                    <h3 className="font-semibold mb-3">Interactive Learning Module</h3>
                                    <p className="mb-4">{selectedContent.content}</p>
                                    <div className="space-y-4">
                                        <div className="bg-card rounded-lg p-4 border">
                                            <h4 className="font-medium mb-2">💡 Key Learning Points:</h4>
                                            <ul className="space-y-1 text-sm">
                                                <li>• Understanding the basics and importance</li>
                                                <li>• Practical steps you can take today</li>
                                                <li>• Warning signs to watch for</li>
                                                <li>• When to seek professional help</li>
                                            </ul>
                                        </div>
                                        <div className="bg-card rounded-lg p-4 border">
                                            <h4 className="font-medium mb-2">🎯 Quick Quiz:</h4>
                                            <p className="text-sm mb-3">Test your understanding with these questions:</p>
                                            <Button size="sm" variant="outline">
                                                Start Quiz
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t">
                                <div className="flex flex-wrap gap-1">
                                    {selectedContent.languages.map((lang: string) => (
                                        <Badge key={lang} variant="outline" className="text-xs">
                                            {languageNames[lang as keyof typeof languageNames]}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    <Button size="sm" variant="outline">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        <Share className="h-4 w-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button size="sm">
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Mark Complete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}
