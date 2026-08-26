const STORAGE_KEY = "mindpulse_monitoring_sessions";

/**
 * Get all locally stored monitoring sessions.
 */
export function getMonitoringSessions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    return JSON.parse(stored);
  } catch (error) {
    console.error(
      "Unable to read monitoring sessions:",
      error
    );

    return [];
  }
}

/**
 * Save all monitoring sessions.
 */
function saveMonitoringSessions(sessions) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(sessions)
    );
  } catch (error) {
    console.error(
      "Unable to save monitoring sessions:",
      error
    );
  }
}

/**
 * Create a new monitoring session.
 */
export function startMonitoringSession() {
  const session = {
    id: `session-${Date.now()}`,

    startedAt:
      new Date().toISOString(),

    endedAt: null,

    duration: 0,

    status: "Active",

    dominantEmotion: null,

    confidence: 0,

    wellbeingScore: 0,

    emotions: {
      Happy: 0,
      Calm: 0,
      Neutral: 0,
      Anxious: 0,
      Stressed: 0,
      Sad: 0,
    },

    observations: [],

    source: "frontend",
  };

  const sessions =
    getMonitoringSessions();

  sessions.unshift(session);

  saveMonitoringSessions(
    sessions
  );

  return session;
}

/**
 * Update an active monitoring session.
 */
export function updateMonitoringSession(
  sessionId,
  updates
) {
  const sessions =
    getMonitoringSessions();

  const index =
    sessions.findIndex(
      (session) =>
        session.id === sessionId
    );

  if (index === -1) {
    return null;
  }

  sessions[index] = {
    ...sessions[index],
    ...updates,
  };

  saveMonitoringSessions(
    sessions
  );

  return sessions[index];
}

/**
 * Finish a monitoring session.
 */
export function finishMonitoringSession(
  sessionId,
  result = {}
) {
  const sessions =
    getMonitoringSessions();

  const index =
    sessions.findIndex(
      (session) =>
        session.id === sessionId
    );

  if (index === -1) {
    return null;
  }

  const session =
    sessions[index];

  const finishedSession = {
    ...session,

    ...result,

    endedAt:
      new Date().toISOString(),

    status: "Completed",
  };

  sessions[index] =
    finishedSession;

  saveMonitoringSessions(
    sessions
  );

  return finishedSession;
}

/**
 * Delete a monitoring session.
 */
export function deleteMonitoringSession(
  sessionId
) {
  const sessions =
    getMonitoringSessions();

  const filtered =
    sessions.filter(
      (session) =>
        session.id !== sessionId
    );

  saveMonitoringSessions(
    filtered
  );

  return filtered;
}

/**
 * Clear all locally stored monitoring sessions.
 */
export function clearMonitoringSessions() {
  localStorage.removeItem(
    STORAGE_KEY
  );
}