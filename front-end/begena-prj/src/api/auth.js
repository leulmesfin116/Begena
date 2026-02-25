export const logUser = async (email, password) => {
  try {
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token); // store JWT
      return { success: true, data };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {}
};
