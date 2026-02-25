export async function loginUser(email, password) {
  try {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      return { token: data.token, ...data };
    } else {
      return { message: data.message };
    }
  } catch (error) {
    return { message: error?.message || "Login error" };
  }
}
export const logUser = loginUser;
