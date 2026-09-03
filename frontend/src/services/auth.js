const AUTH_KEY = "mindpulse_auth";
const USER_KEY = "mindpulse_user";

export function isAuthenticated() {
  try {
    const storedAuth =
      localStorage.getItem(AUTH_KEY);

    if (!storedAuth) {
      return false;
    }

    const auth =
      JSON.parse(storedAuth);

    return auth?.authenticated === true;
  } catch (error) {
    console.error(
      "Unable to read authentication state:",
      error
    );

    return false;
  }
}

/* ============================================================
  CURRENT USER
============================================================ */

export function getCurrentUser() {
  try {
    const storedUser =
      localStorage.getItem(USER_KEY);

    if (!storedUser) {
      return null;
    }

    return JSON.parse(storedUser);
  } catch (error) {
    console.error(
      "Unable to read current user:",
      error
    );

    return null;
  }
}

/* ============================================================
  SET AUTH STATE
============================================================ */

export function setAuthState(
  user,
  rememberMe = false
) {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      authenticated: true,
      rememberMe,
      loginTime:
        new Date().toISOString(),
    })
  );

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}

/* ============================================================
  UPDATE CURRENT USER
============================================================ */

export function updateCurrentUser(
  updates
) {
  const currentUser =
    getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const updatedUser = {
    ...currentUser,
    ...updates,
  };

  localStorage.setItem(
    USER_KEY,
    JSON.stringify(updatedUser)
  );

  return updatedUser;
}

/* ============================================================
  LOGOUT
============================================================ */

export function logout() {
  localStorage.removeItem(AUTH_KEY);

  localStorage.removeItem(USER_KEY);

  localStorage.removeItem("access_token");
}