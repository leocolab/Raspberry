// src/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/* ---------- Shared UI primitives ---------- */
const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg font-medium bg-[#E30B5C] hover:bg-[#B1124D] text-white disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-gray-900 rounded-2xl border shadow ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-8 space-y-5 ${className}`}>{children}</div>
);

export default function Login() {
  /* controlled inputs */
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");

  const { emailSignup: signup, emailLogin: login, googleLogin, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const navigate = useNavigate();

  /* redirect if already logged in */
  useEffect(() => { if (user) navigate("/", { replace: true }); }, [user, navigate]);

  const formReady = email !== "" && pass !== "";

  const friendly = (code, fallback) =>
    code === "auth/email-already-in-use"
      ? "That email is already registered."
      : code === "auth/user-not-found"
      ? "No account with that email."
      : fallback;

  const handleSignup = async () => {
    if (!formReady) return setError("Please enter an email and password first.");
    setLoading(true); setError("");
    try { await signup(email, pass); navigate("/", { replace: true }); }
    catch (e) { setError("Signup failed: " + friendly(e.code, e.message)); }
    setLoading(false);
  };

  const handleLogin = async () => {
    if (!formReady) return setError("Please enter an email and password first.");
    setLoading(true); setError("");
    try { await login(email, pass); navigate("/", { replace: true }); }
    catch (e) { setError("Login failed: " + friendly(e.code, e.message)); }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true); setError("");
    try { await googleLogin(); navigate("/", { replace: true }); }
    catch (e) { setError("Google login failed: " + e.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 px-4">
      <Card className="w-full max-w-md">
        <CardContent>
          {/* Title + slogan */}
          <h1 className="text-3xl font-extrabold text-center">Raspberrry</h1>
          <p className="text-center text-[#E30B5C] font-semibold">
            One prompt. <em>Any</em> model.
          </p>

          {/* Description */}
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Access GPT-4o, Gemini 1.5 Pro, Claude Sonnet & more from one workspace.
          </p>

          {/* Instructional helper text */}
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            New here? enter an email & password and click <strong>Sign Up</strong>.<br/>
            Returning user? enter the same credentials and click <strong>Log In</strong>.<br/>
            Or, you can <strong> Continue With Google </strong>.
          </p>

          {/* Inputs */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 ${
              error && email === "" ? "border-red-500" : ""
            }`}
          />
          <input
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className={`w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 ${
              error && pass === "" ? "border-red-500" : ""
            }`}
          />

          {/* Inline error */}
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          {/* Email actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSignup} disabled={loading || !formReady} className="w-full">
              Sign Up
            </Button>
            <Button
              onClick={handleLogin}
              disabled={loading || !formReady}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Log In
            </Button>
          </div>

          {/* Google OAuth */}
          <Button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-white dark:text-gray-800"
        >
          {/* G icon */}
          <svg className="w-5 h-5" viewBox="0 0 533.5 544.3">
            <path d="M533.5 278.4c0-17.4-1.6-34.2-4.7-50.4H272v95.4h146.9c-6.4 34.5-25 64-53.4 83.5v69.3h86.4c50.4-46.5 81.6-115 81.6-197.8z" fill="#4285F4"/>
            <path d="M272 544.3c72.6 0 133.8-24 178.4-65.3l-86.4-69.3c-24 16-54.8 25.5-92 25.5-70.7 0-130.5-47.7-151.9-111.4H31.1v69.8C75.8 497 167.8 544.3 272 544.3z" fill="#34A853"/>
            <path d="M120.1 323.8c-10.1-30-10.1-62.8 0-92.8V161H31.1c-45.2 89.9-45.2 195.2 0 285.1l89-69.8z" fill="#FBBC04"/>
            <path d="M272 108.7c39.6 0 75.3 13.6 103.4 40.4l77.6-77.6C406-7.1 345.2-24 272-24 167.8-24 75.8 23.2 31.1 114.1l89 69.8C141.5 156.4 201.3 108.7 272 108.7z" fill="#EA4335"/>
          </svg>

          {/* label always black (Google spec) */}
          <span className="font-medium text-sm text-black">Sign&nbsp;in&nbsp;with&nbsp;Google</span>
        </Button>
        </CardContent>
      </Card>
    </div>
  );
}
