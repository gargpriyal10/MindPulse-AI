// ============================================================
// MindPulse AI — Mock Data
// Frontend-only development data
// ============================================================

// ------------------------------------------------------------
// EMOTION DEFINITIONS
// ------------------------------------------------------------

export const emotions = [
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    color: "#FACC15",
    description: "Positive and uplifting emotional state",
    intensity: 82,
    category: "positive",
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "😔",
    color: "#60A5FA",
    description: "Low-energy emotional state",
    intensity: 34,
    category: "negative",
  },
  {
    id: "neutral",
    name: "Neutral",
    emoji: "😐",
    color: "#C084FC",
    description: "Balanced and emotionally stable state",
    intensity: 58,
    category: "neutral",
  },
  {
    id: "anxious",
    name: "Anxious",
    emoji: "😟",
    color: "#FB7185",
    description: "State associated with worry or nervousness",
    intensity: 46,
    category: "negative",
  },
  {
    id: "stressed",
    name: "Stressed",
    emoji: "😣",
    color: "#FF6B6B",
    description: "Elevated pressure or tension",
    intensity: 39,
    category: "negative",
  },
  {
    id: "calm",
    name: "Calm",
    emoji: "😌",
    color: "#14B8A6",
    description: "Relaxed and emotionally balanced state",
    intensity: 76,
    category: "positive",
  },
];

// ------------------------------------------------------------
// CURRENT USER
// ------------------------------------------------------------

export const currentUser = {
  id: "user-001",
  firstName: "Priyal",
  lastName: "Garg",
  name: "Priyal Garg",
  email: "priyal@example.com",
  avatar: null,
  role: "Student",
  university: "GLA University",
  course: "Artificial Intelligence & Machine Learning",
  year: "3rd Year",
  joinedDate: "2026-01-15",
  preferences: {
    theme: "dark",
    notifications: true,
    emailReports: true,
    weeklySummary: true,
    privacyMode: true,
  },
};

// ------------------------------------------------------------
// DASHBOARD OVERVIEW
// ------------------------------------------------------------

export const dashboardOverview = {
  wellbeingScore: 78,
  wellbeingChange: 6.4,

  dominantEmotion: {
    id: "calm",
    name: "Calm",
    emoji: "😌",
    intensity: 76,
  },

  totalSessions: 24,
  sessionsThisWeek: 5,

  averageSessionDuration: 8.6,

  stressLevel: 32,
  anxietyLevel: 27,

  streak: 7,

  lastSession: {
    id: "session-024",
    date: "2026-08-15",
    time: "10:42 AM",
    emotion: "Calm",
    score: 84,
    duration: 9,
  },
};

// ------------------------------------------------------------
// RECENT EMOTIONS
// ------------------------------------------------------------

export const recentEmotions = [
  {
    id: "emotion-001",
    emotion: "Calm",
    intensity: 82,
    confidence: 94,
    timestamp: "2026-08-15T10:42:00",
    duration: 4,
  },
  {
    id: "emotion-002",
    emotion: "Happy",
    intensity: 79,
    confidence: 91,
    timestamp: "2026-08-15T10:39:00",
    duration: 2,
  },
  {
    id: "emotion-003",
    emotion: "Neutral",
    intensity: 61,
    confidence: 88,
    timestamp: "2026-08-15T10:35:00",
    duration: 3,
  },
  {
    id: "emotion-004",
    emotion: "Calm",
    intensity: 74,
    confidence: 93,
    timestamp: "2026-08-14T18:24:00",
    duration: 5,
  },
  {
    id: "emotion-005",
    emotion: "Stressed",
    intensity: 42,
    confidence: 87,
    timestamp: "2026-08-14T15:12:00",
    duration: 2,
  },
  {
    id: "emotion-006",
    emotion: "Happy",
    intensity: 86,
    confidence: 95,
    timestamp: "2026-08-14T11:08:00",
    duration: 4,
  },
];

// ------------------------------------------------------------
// SESSION HISTORY
// ------------------------------------------------------------

export const sessionHistory = [
  {
    id: "session-024",
    date: "2026-08-15",
    startTime: "10:42 AM",
    duration: 9,
    dominantEmotion: "Calm",
    emotionScore: 84,
    wellbeingScore: 86,
    stressLevel: 24,
    anxietyLevel: 18,
    confidence: 94,
    status: "Completed",
  },
  {
    id: "session-023",
    date: "2026-08-14",
    startTime: "06:24 PM",
    duration: 7,
    dominantEmotion: "Happy",
    emotionScore: 88,
    wellbeingScore: 91,
    stressLevel: 19,
    anxietyLevel: 15,
    confidence: 92,
    status: "Completed",
  },
  {
    id: "session-022",
    date: "2026-08-14",
    startTime: "03:12 PM",
    duration: 6,
    dominantEmotion: "Stressed",
    emotionScore: 48,
    wellbeingScore: 61,
    stressLevel: 67,
    anxietyLevel: 54,
    confidence: 87,
    status: "Completed",
  },
  {
    id: "session-021",
    date: "2026-08-13",
    startTime: "11:15 AM",
    duration: 11,
    dominantEmotion: "Calm",
    emotionScore: 81,
    wellbeingScore: 84,
    stressLevel: 28,
    anxietyLevel: 21,
    confidence: 95,
    status: "Completed",
  },
  {
    id: "session-020",
    date: "2026-08-12",
    startTime: "08:05 PM",
    duration: 8,
    dominantEmotion: "Neutral",
    emotionScore: 64,
    wellbeingScore: 72,
    stressLevel: 38,
    anxietyLevel: 31,
    confidence: 89,
    status: "Completed",
  },
  {
    id: "session-019",
    date: "2026-08-12",
    startTime: "01:42 PM",
    duration: 5,
    dominantEmotion: "Anxious",
    emotionScore: 51,
    wellbeingScore: 59,
    stressLevel: 62,
    anxietyLevel: 71,
    confidence: 86,
    status: "Completed",
  },
  {
    id: "session-018",
    date: "2026-08-11",
    startTime: "09:18 AM",
    duration: 10,
    dominantEmotion: "Happy",
    emotionScore: 90,
    wellbeingScore: 92,
    stressLevel: 16,
    anxietyLevel: 12,
    confidence: 96,
    status: "Completed",
  },
  {
    id: "session-017",
    date: "2026-08-10",
    startTime: "05:30 PM",
    duration: 7,
    dominantEmotion: "Calm",
    emotionScore: 79,
    wellbeingScore: 82,
    stressLevel: 26,
    anxietyLevel: 22,
    confidence: 93,
    status: "Completed",
  },
  {
    id: "session-016",
    date: "2026-08-09",
    startTime: "12:15 PM",
    duration: 6,
    dominantEmotion: "Sad",
    emotionScore: 42,
    wellbeingScore: 55,
    stressLevel: 51,
    anxietyLevel: 48,
    confidence: 84,
    status: "Completed",
  },
  {
    id: "session-015",
    date: "2026-08-08",
    startTime: "07:45 PM",
    duration: 9,
    dominantEmotion: "Neutral",
    emotionScore: 67,
    wellbeingScore: 74,
    stressLevel: 35,
    anxietyLevel: 29,
    confidence: 90,
    status: "Completed",
  },
  {
    id: "session-014",
    date: "2026-08-07",
    startTime: "10:30 AM",
    duration: 8,
    dominantEmotion: "Calm",
    emotionScore: 83,
    wellbeingScore: 85,
    stressLevel: 22,
    anxietyLevel: 19,
    confidence: 94,
    status: "Completed",
  },
  {
    id: "session-013",
    date: "2026-08-06",
    startTime: "04:15 PM",
    duration: 5,
    dominantEmotion: "Anxious",
    emotionScore: 47,
    wellbeingScore: 58,
    stressLevel: 64,
    anxietyLevel: 68,
    confidence: 85,
    status: "Completed",
  },
];

// ------------------------------------------------------------
// WEEKLY EMOTION DISTRIBUTION
// ------------------------------------------------------------

export const emotionDistribution = [
  {
    emotion: "Happy",
    percentage: 24,
    sessions: 12,
  },
  {
    emotion: "Calm",
    percentage: 31,
    sessions: 16,
  },
  {
    emotion: "Neutral",
    percentage: 22,
    sessions: 11,
  },
  {
    emotion: "Anxious",
    percentage: 9,
    sessions: 5,
  },
  {
    emotion: "Stressed",
    percentage: 8,
    sessions: 4,
  },
  {
    emotion: "Sad",
    percentage: 6,
    sessions: 3,
  },
];

// ------------------------------------------------------------
// DAILY WELL-BEING ANALYTICS
// ------------------------------------------------------------

export const dailyWellbeing = [
  {
    date: "2026-08-09",
    label: "Sun",
    score: 68,
    stress: 48,
    anxiety: 43,
  },
  {
    date: "2026-08-10",
    label: "Mon",
    score: 74,
    stress: 39,
    anxiety: 35,
  },
  {
    date: "2026-08-11",
    label: "Tue",
    score: 81,
    stress: 28,
    anxiety: 24,
  },
  {
    date: "2026-08-12",
    label: "Wed",
    score: 76,
    stress: 35,
    anxiety: 31,
  },
  {
    date: "2026-08-13",
    label: "Thu",
    score: 84,
    stress: 23,
    anxiety: 19,
  },
  {
    date: "2026-08-14",
    label: "Fri",
    score: 88,
    stress: 19,
    anxiety: 16,
  },
  {
    date: "2026-08-15",
    label: "Sat",
    score: 86,
    stress: 24,
    anxiety: 18,
  },
];

// ------------------------------------------------------------
// WEEKLY WELL-BEING ANALYTICS
// ------------------------------------------------------------

export const weeklyWellbeing = [
  {
    week: "Week 1",
    score: 64,
    stress: 51,
    anxiety: 47,
    sessions: 8,
  },
  {
    week: "Week 2",
    score: 69,
    stress: 46,
    anxiety: 42,
    sessions: 10,
  },
  {
    week: "Week 3",
    score: 74,
    stress: 39,
    anxiety: 35,
    sessions: 13,
  },
  {
    week: "Week 4",
    score: 78,
    stress: 32,
    anxiety: 27,
    sessions: 15,
  },
];

// ------------------------------------------------------------
// MONTHLY WELL-BEING ANALYTICS
// ------------------------------------------------------------

export const monthlyWellbeing = [
  {
    month: "March",
    score: 61,
    stress: 57,
    anxiety: 52,
  },
  {
    month: "April",
    score: 65,
    stress: 51,
    anxiety: 47,
  },
  {
    month: "May",
    score: 69,
    stress: 46,
    anxiety: 41,
  },
  {
    month: "June",
    score: 72,
    stress: 41,
    anxiety: 36,
  },
  {
    month: "July",
    score: 75,
    stress: 37,
    anxiety: 32,
  },
  {
    month: "August",
    score: 78,
    stress: 32,
    anxiety: 27,
  },
];

// ------------------------------------------------------------
// EMOTION TREND DATA
// ------------------------------------------------------------

export const emotionTrends = {
  labels: [
    "Aug 09",
    "Aug 10",
    "Aug 11",
    "Aug 12",
    "Aug 13",
    "Aug 14",
    "Aug 15",
  ],

  happy: [62, 68, 74, 69, 78, 84, 81],

  calm: [71, 73, 78, 75, 81, 86, 84],

  neutral: [54, 51, 58, 61, 55, 49, 52],

  anxious: [44, 39, 31, 42, 28, 21, 24],

  stressed: [51, 43, 36, 47, 29, 22, 26],

  sad: [31, 28, 24, 33, 21, 18, 20],
};

// ------------------------------------------------------------
// LIVE MONITORING DATA
// ------------------------------------------------------------

export const liveMonitoring = {
  isActive: true,

  currentEmotion: {
    emotion: "Calm",
    emoji: "😌",
    intensity: 78,
    confidence: 94,
  },

  sessionDuration: 124,

  status: "Monitoring",

  emotionHistory: [
    {
      time: "10:40:12",
      emotion: "Neutral",
      intensity: 61,
      confidence: 88,
    },
    {
      time: "10:40:34",
      emotion: "Calm",
      intensity: 69,
      confidence: 91,
    },
    {
      time: "10:41:02",
      emotion: "Calm",
      intensity: 74,
      confidence: 93,
    },
    {
      time: "10:41:27",
      emotion: "Happy",
      intensity: 79,
      confidence: 92,
    },
    {
      time: "10:41:51",
      emotion: "Calm",
      intensity: 78,
      confidence: 94,
    },
  ],
};

// ------------------------------------------------------------
// WELL-BEING INSIGHTS
// ------------------------------------------------------------

export const wellbeingInsights = [
  {
    id: "insight-001",
    type: "positive",
    title: "Your calm moments are increasing",
    description:
      "Your calm emotional state appeared more frequently this week compared with last week.",
    metric: "+18%",
    icon: "TrendingUp",
  },
  {
    id: "insight-002",
    type: "positive",
    title: "Stress levels are trending down",
    description:
      "Your average detected stress level has decreased over the past seven days.",
    metric: "-14%",
    icon: "Activity",
  },
  {
    id: "insight-003",
    type: "neutral",
    title: "Your sessions are becoming more consistent",
    description:
      "You've completed monitoring sessions on 7 consecutive days.",
    metric: "7 days",
    icon: "CalendarCheck",
  },
];

// ------------------------------------------------------------
// NOTIFICATIONS
// ------------------------------------------------------------

export const notifications = [
  {
    id: "notification-001",
    type: "success",
    title: "Weekly report ready",
    message: "Your latest well-being summary is available.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notification-002",
    type: "info",
    title: "7-day streak achieved",
    message: "You've completed a monitoring session for seven consecutive days.",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "notification-003",
    type: "warning",
    title: "Elevated stress detected",
    message: "A higher stress level was detected during yesterday's session.",
    time: "1 day ago",
    read: true,
  },
];

// ------------------------------------------------------------
// REPORT SUMMARY
// ------------------------------------------------------------

export const reportSummary = {
  period: "August 9 - August 15, 2026",

  wellbeingScore: 78,
  previousScore: 73,
  change: 6.8,

  averageStress: 32,
  previousStress: 38,

  averageAnxiety: 27,
  previousAnxiety: 34,

  totalSessions: 15,
  totalMonitoringTime: 128,

  dominantEmotion: "Calm",

  positiveEmotionPercentage: 55,

  recommendations: [
    "Continue your regular monitoring routine.",
    "Take short breaks during periods of extended screen time.",
    "Practice slow breathing when stress levels increase.",
    "Maintain a consistent sleep and study schedule.",
  ],
};

// ------------------------------------------------------------
// SETTINGS
// ------------------------------------------------------------

export const settings = {
  appearance: {
    theme: "dark",
    compactMode: false,
    animations: true,
  },

  notifications: {
    pushNotifications: true,
    emailNotifications: true,
    weeklyReports: true,
    emotionAlerts: true,
  },

  privacy: {
    saveSessionHistory: true,
    anonymousAnalytics: true,
    cameraPermission: true,
  },

  api: {
    environment: "mock",
    baseUrl: "http://localhost:5000/api",
    timeout: 10000,
  },
};

// ------------------------------------------------------------
// PRICING PLANS
// ------------------------------------------------------------

export const pricingPlans = [
  {
    id: "free",
    name: "MindPulse Free",
    price: 0,
    period: "forever",
    description: "Explore your emotional patterns.",
    features: [
      "5 monitoring sessions per month",
      "Basic emotion detection",
      "7-day emotion history",
      "Basic well-being score",
    ],
    highlighted: false,
  },
  {
    id: "plus",
    name: "MindPulse Plus",
    price: 9,
    period: "month",
    description: "Build a deeper understanding of your well-being.",
    features: [
      "Unlimited monitoring sessions",
      "Detailed emotion analytics",
      "Complete session history",
      "Weekly well-being reports",
      "Personalized insights",
    ],
    highlighted: true,
  },
  {
    id: "pro",
    name: "MindPulse Pro",
    price: 19,
    period: "month",
    description: "Advanced monitoring and analytics.",
    features: [
      "Everything in Plus",
      "Advanced trend analysis",
      "Long-term reports",
      "Priority processing",
      "Exportable reports",
      "Advanced privacy controls",
    ],
    highlighted: false,
  },
];

// ------------------------------------------------------------
// DASHBOARD QUICK ACTIONS
// ------------------------------------------------------------

export const quickActions = [
  {
    id: "start-session",
    title: "Start Monitoring",
    description: "Begin a new emotion monitoring session.",
    action: "monitoring",
  },
  {
    id: "view-history",
    title: "View History",
    description: "Review your previous monitoring sessions.",
    action: "history",
  },
  {
    id: "view-report",
    title: "View Report",
    description: "Explore your latest well-being analytics.",
    action: "reports",
  },
];

// ------------------------------------------------------------
// API RESPONSE METADATA
// ------------------------------------------------------------

export const mockMeta = {
  source: "mock",
  environment: "development",
  version: "1.0.0",
  generatedAt: "2026-08-15T18:30:00",
};