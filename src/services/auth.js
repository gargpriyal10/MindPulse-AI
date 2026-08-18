const AUTH_KEY = "mindpulse_auth";
const USER_KEY = "mindpulse_user";

/* ============================================================
   CHECK AUTHENTICATION
============================================================ */

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
   GET CURRENT USER
============================================================ */

export function getCurrentUser() {
  try {
    const storedUser =
      localStorage.getItem(USER_KEY);

    return storedUser
      ? JSON.parse(storedUser)
      : null;
  } catch (error) {
    console.error(
      "Unable to read user:",
      error
    );

    return null;
  }
}

/* ============================================================
   LOGOUT
============================================================ */

export function logout() {
  localStorage.removeItem(
    AUTH_KEY
  );

  localStorage.removeItem(
    USER_KEY
  );
}

/* ============================================================
   LOGIN STATE
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