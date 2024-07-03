import React, { useState } from "react";
import { supabase } from "../supabase";

function BuilderLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error, session } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:5173/",
      },
    });

    if (error) {
      setMessage("Login failed: " + error.message);
      setLoading(false);
      return;
    }

    setMessage("Login successful!");
    setLoading(false);
    // You can redirect or do additional tasks here
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Builder Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p>{message}</p>
    </form>
  );
}

export default BuilderLogin;
