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
  const response = await apiClient.post(
    "/auth/register",
    userData
  );

  return response;
};

export const getUserProfile = async () => {
    const response = await apiClient.get("/users/profile");
    return response;
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

export const getEmotionHistory = async () => {
  const response = await apiClient.get(
    "/emotions/history"
  );

  return response;
};

export const uploadEmotionImage = async (imageBlob) => {
  const formData = new FormData();

  formData.append("image", imageBlob, "camera-capture.jpg");

  const response = await apiClient.post(
    "/emotions/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response;
};

export const uploadAudioFile = async (audioBlob) => {
  const formData = new FormData();
  formData.append("audio", audioBlob, "audio-recording.wav");

  const response = await apiClient.post("/audio/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response;
};



export const uploadFusionData = async (imageBlob, audioBlob) => {
  const formData = new FormData();

  formData.append("image", imageBlob, "camera-capture.jpg");
  formData.append("audio", audioBlob, "audio-recording.wav");

  return await apiClient.post("/emotions/fusion", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};




// ------------------------------------------------------------
// Monitoring
// ------------------------------------------------------------

export const getLiveMonitoring = async () => {
  return mockRequest(liveMonitoring, 500);
};

export const startMonitoringSession = async () => {
  return await apiClient.post("/sessions/start");
};

export const stopMonitoringSession = async (sessionId) => {
  return await apiClient.put(`/sessions/${sessionId}/end`);
};

// ------------------------------------------------------------
// Session History
// ------------------------------------------------------------

export const getSessionHistory = async () => {
  return await apiClient.get("/sessions");
};

export const getSessionById = async (sessionId) => {
  const response = await apiClient.get("/sessions");
  const sessions = response.data.sessions || [];

  const session = sessions.find(
    (item) => String(item.id) === String(sessionId)
  );

  if (!session) {
    throw new Error(`Session "${sessionId}" was not found.`);
  }

  return { data: session };
};

export const getBackendSessions = async () => {
  return await apiClient.get("/sessions");
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

export const getEmotionAnalytics = async () => {
  const response = await apiClient.get("/emotions/analytics");

  return response;
};

export const getEmotionSummary = async () => {
  const response = await apiClient.get("/reports");
  return response;
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

export const getEmotionReport = async (period = "week") => {
  const response = await apiClient.get("/reports", {
    params: {
      period,
    },
  });

  return response;
};

// ------------------------------------------------------------
// User Settings
// ------------------------------------------------------------

export const getSettings = async () => {
  const response = await apiClient.get("/users/profile");
  return response.data.user?.preferences || {};
};

export const updateSettings = async (updatedSettings) => {
  const response = await apiClient.put("/users/profile", {
    preferences: updatedSettings,
  });

  return response.data.user?.preferences || {};
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