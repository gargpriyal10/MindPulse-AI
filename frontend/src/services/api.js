import axios from "axios";
import {
  emotions,
  currentUser,
  dashboardOverview,
  recentEmotions,
  sessionHistory,
  emotionDistribution,
  dailyWellbeing,
  weeklyWellbeing,
  monthlyWellbeing,
  emotionTrends,
  liveMonitoring,
  wellbeingInsights,
  notifications,
  reportSummary,
  settings,
  pricingPlans,
  quickActions,
  mockMeta,
} from "./mockData";

// ============================================================
// MindPulse AI — Mock API Service
// Frontend-only API abstraction layer
// ============================================================

const MOCK_DELAY = 700;

// Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ------------------------------------------------------------
// Request Interceptor
// Automatically attaches JWT token if available
// ------------------------------------------------------------

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ------------------------------------------------------------
// Response Interceptor
// ------------------------------------------------------------

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
    }

    return Promise.reject(error);
  }
);

// ------------------------------------------------------------
// Mock request helper
// ------------------------------------------------------------

const mockRequest = (data, delay = MOCK_DELAY) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        meta: {
          ...mockMeta,
          responseTime: delay,
        },
      });
    }, delay);
  });
};

// ------------------------------------------------------------
// Authentication
// ------------------------------------------------------------

export const loginUser = async (credentials) => {
  const response = await apiClient.post(
    "/auth/login",
    credentials
  );

  return response;
};

export const registerUser = async (userData) => {
  await mockRequest(null, 800);

  return {
    data: {
      user: {
        ...currentUser,
        ...userData,
        id: `user-${Date.now()}`,
      },
      token: "mock-access-token",
      authenticated: true,
    },
  };
};

export const logoutUser = async () => {
  return mockRequest({
    success: true,
    message: "User logged out successfully.",
  });
};

export const getCurrentUser = async () => {
  return mockRequest(currentUser);
};

// ------------------------------------------------------------
// Dashboard
// ------------------------------------------------------------

export const getDashboardOverview = async () => {
  return mockRequest(dashboardOverview);
};

export const getRecentEmotions = async () => {
  return mockRequest(recentEmotions);
};

export const getQuickActions = async () => {
  return mockRequest(quickActions);
};

// ------------------------------------------------------------
// Emotions
// ------------------------------------------------------------

export const getEmotions = async () => {
  return mockRequest(emotions);
};

export const getEmotionById = async (emotionId) => {
  const emotion = emotions.find((item) => item.id === emotionId);

  if (!emotion) {
    throw new Error(`Emotion "${emotionId}" was not found.`);
  }

  return mockRequest(emotion);
};

// ------------------------------------------------------------
// Monitoring
// ------------------------------------------------------------

export const getLiveMonitoring = async () => {
  return mockRequest(liveMonitoring, 500);
};

export const startMonitoringSession = async () => {
  return mockRequest(
    {
      ...liveMonitoring,
      isActive: true,
      status: "Monitoring",
    },
    900
  );
};

export const stopMonitoringSession = async () => {
  return mockRequest(
    {
      success: true,
      isActive: false,
      status: "Completed",
      message: "Monitoring session completed successfully.",
    },
    700
  );
};

// ------------------------------------------------------------
// Session History
// ------------------------------------------------------------

export const getSessionHistory = async (filters = {}) => {
  let results = [...sessionHistory];

  if (filters.emotion && filters.emotion !== "all") {
    results = results.filter(
      (session) =>
        session.dominantEmotion.toLowerCase() ===
        filters.emotion.toLowerCase()
    );
  }

  if (filters.status && filters.status !== "all") {
    results = results.filter(
      (session) =>
        session.status.toLowerCase() === filters.status.toLowerCase()
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();

    results = results.filter(
      (session) =>
        session.dominantEmotion.toLowerCase().includes(searchTerm) ||
        session.date.includes(searchTerm)
    );
  }

  return mockRequest(results);
};

export const getSessionById = async (sessionId) => {
  const session = sessionHistory.find(
    (item) => item.id === sessionId
  );

  if (!session) {
    throw new Error(`Session "${sessionId}" was not found.`);
  }

  return mockRequest(session);
};

// ------------------------------------------------------------
// Analytics
// ------------------------------------------------------------

export const getEmotionDistribution = async () => {
  return mockRequest(emotionDistribution);
};

export const getDailyWellbeing = async () => {
  return mockRequest(dailyWellbeing);
};

export const getWeeklyWellbeing = async () => {
  return mockRequest(weeklyWellbeing);
};

export const getMonthlyWellbeing = async () => {
  return mockRequest(monthlyWellbeing);
};

export const getEmotionTrends = async () => {
  return mockRequest(emotionTrends);
};

export const getReportSummary = async () => {
  return mockRequest(reportSummary);
};

// ------------------------------------------------------------
// Insights
// ------------------------------------------------------------

export const getWellbeingInsights = async () => {
  return mockRequest(wellbeingInsights);
};

// ------------------------------------------------------------
// Notifications
// ------------------------------------------------------------

export const getNotifications = async () => {
  return mockRequest(notifications);
};

export const markNotificationAsRead = async (notificationId) => {
  return mockRequest({
    success: true,
    notificationId,
    read: true,
  });
};

// ------------------------------------------------------------
// User Settings
// ------------------------------------------------------------

export const getSettings = async () => {
  return mockRequest(settings);
};

export const updateSettings = async (updatedSettings) => {
  return mockRequest({
    ...settings,
    ...updatedSettings,
  });
};

// ------------------------------------------------------------
// Pricing
// ------------------------------------------------------------

export const getPricingPlans = async () => {
  return mockRequest(pricingPlans);
};

// ------------------------------------------------------------
// API health check
// ------------------------------------------------------------

export const checkApiHealth = async () => {
  return mockRequest({
    status: "healthy",
    environment: "mock",
    service: "MindPulse AI Frontend",
  });
};

// ------------------------------------------------------------
// Axios client export
// ------------------------------------------------------------

export { apiClient };