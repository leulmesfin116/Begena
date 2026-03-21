const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email: email.trim(), password }),
    });

    const text = await res.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }
    }

    if (res.ok) return { token: data.token, role: data?.data?.role, ...data?.data };
    return {
      message: data.message || data.error || res.statusText || "Login failed",
    };
  } catch (error) {
    return { message: error?.message || "Login error" };
  }
}
export async function signupUser(name, email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email: email.trim(), password }),
    });

    const text = await res.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }
    }

    if (res.ok) return { token: data.token, role: data?.data?.role, ...data?.data };
    return {
      message: data.message || data.error || res.statusText || "Signup failed",
    };
  } catch (error) {
    return { message: error?.message || "signup error" };
  }
}
